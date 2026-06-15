# Sending the OTP Email with Gmail (SMTP)

This guide explains, step by step, how the email-based OTP (verification code) works in
Tech Store and how to configure **Gmail SMTP** so the codes are actually delivered to
users' inboxes.

> ✅ You don't need to install anything — `nodemailer` is already a dependency.
> The only thing missing is the SMTP credentials in your `.env` file.

---

## 1. How the OTP flow works (the big picture)

```
                ┌──────────────┐   OTP saved to    ┌─────────────────┐
  Register ───▶ │ /api/auth/   │ ───────────────▶  │  PendingUser    │
  form          │ register     │   (expires 15m)   │  collection     │
                └──────┬───────┘                   └─────────────────┘
                       │ sendVerificationEmail(email, otp)
                       ▼
                ┌──────────────┐
                │  lib/email.ts│  ──── Gmail SMTP ────▶  📧  user's inbox
                │ (nodemailer) │
                └──────────────┘

  User types the 6-digit code on /verify-otp
                       │
                       ▼
                ┌──────────────┐  OTP matches?   ┌─────────────────┐
  Verify ─────▶ │ /api/auth/   │ ──────────────▶ │  User           │  isVerified: true
                │ verify-otp   │  move record    │  collection     │
                └──────────────┘                 └─────────────────┘
```

Key files:

| File | Responsibility |
|------|----------------|
| [`app/api/auth/register/route.ts`](../app/api/auth/register/route.ts) | Generates the 6-digit OTP, stores a `PendingUser`, calls `sendVerificationEmail`. |
| [`app/api/auth/verify-otp/route.ts`](../app/api/auth/verify-otp/route.ts) | Checks the OTP, then promotes `PendingUser` → `User`. |
| [`app/api/auth/resend-otp/route.ts`](../app/api/auth/resend-otp/route.ts) | Regenerates and re-sends the OTP. |
| [`lib/email.ts`](../lib/email.ts) | Builds the Nodemailer SMTP transport and the HTML email. |
| [`app/(main)/verify-otp/page.tsx`](../app/(main)/verify-otp/page.tsx) | The 6-box code entry UI. |

The OTP itself is a 6-digit number that **expires after 15 minutes** (enforced both by
the `expiresAt` check in the verify route and by a MongoDB TTL index on `PendingUser`).

---

## 2. The environment variables you need

`lib/email.ts` reads these five variables:

| Variable | What it is | Gmail value |
|----------|-----------|-------------|
| `EMAIL_SERVER_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `EMAIL_SERVER_PORT` | SMTP port (defaults to `587` if unset) | `587` |
| `EMAIL_SERVER_USER` | The Gmail address you send from | `youraddress@gmail.com` |
| `EMAIL_SERVER_PASSWORD` | A Gmail **App Password** (NOT your login password) | 16-character app password |
| `EMAIL_FROM` | The "From" header shown to recipients | `"Tech Store <youraddress@gmail.com>"` |

> ⚠️ **`EMAIL_SERVER_PASSWORD` is not your normal Gmail password.** Google blocks
> plain-password SMTP logins. You must create an **App Password** (next section).

---

## 3. Create a Gmail App Password (one-time setup)

An App Password is a 16-character password that lets one specific app sign in to your
Google account over SMTP. It only works when **2-Step Verification is enabled**.

### Step 3.1 — Turn on 2-Step Verification

1. Go to <https://myaccount.google.com/security>
2. Under **"How you sign in to Google"**, click **2-Step Verification**.
3. Follow the prompts to enable it (you'll confirm with your phone).

> If 2-Step Verification is **off**, the App Passwords option will not appear.

### Step 3.2 — Generate the App Password

1. Go directly to <https://myaccount.google.com/apppasswords>
   (or search "App passwords" in your Google Account settings).
2. You may be asked to re-enter your Google password.
3. Under **"App name"**, type something memorable like `Tech Store Dev`.
4. Click **Create**.
5. Google shows a **16-character password** in a yellow box, e.g. `abcd efgh ijkl mnop`.
6. **Copy it now** — you can't view it again later. (You can always delete it and make a new one.)

> When you paste it into `.env`, **remove the spaces**: `abcdefghijklmnop`.

---

## 4. Add the variables to `.env`

Open the `.env` file in the project root and add these lines (replace with your values):

```env
# ---- Email / SMTP (Gmail) ----
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=youraddress@gmail.com
EMAIL_SERVER_PASSWORD=abcdefghijklmnop
EMAIL_FROM="Tech Store <youraddress@gmail.com>"
```

Notes:
- `EMAIL_SERVER_USER` and the address inside `EMAIL_FROM` should normally be the **same**
  Gmail address. Gmail rewrites/forces the From to your authenticated address anyway.
- Keep the quotes around `EMAIL_FROM` because of the space and angle brackets.
- **Never commit `.env`** — it holds secrets. (It should already be in `.gitignore`.)

---

## 5. Restart the dev server

Next.js only reads `.env` **at startup**, so changes won't take effect until you restart.

```bash
# stop the running server (Ctrl+C), then:
pnpm dev
```

---

## 6. Test it end-to-end

1. Open <http://localhost:3000/register> and register with a **real email you can check**.
2. You should be redirected to `/verify-otp?email=...`.
3. Check that inbox (and the **Spam** folder the first time) for an email titled
   **"Your Verification Code - Tech Store"** with a big green 6-digit code.
4. Enter the code → you should see *"Email verified! You can now login."*

### Verify from the server logs too
Even when email works, the register route logs the code to the terminal:

```
Registration OTP for youraddress@gmail.com: 482913
```

This is handy for debugging — but see the security note in §8 about removing it for production.

### Test the "Resend" button
On the verify page, wait for the 60-second timer to hit 0, then click **Resend New Code**.
A second email should arrive. (If SMTP is misconfigured, this button returns a
*"Failed to send email"* error — unlike registration, the resend route does **not** hide
email errors.)

---

## 7. Troubleshooting

| Symptom | Likely cause / fix |
|---------|--------------------|
| `Invalid login: 535-5.7.8 Username and Password not accepted` | You used your normal password, or pasted the App Password with spaces. Regenerate and paste 16 chars, no spaces. |
| `Missing credentials for "PLAIN"` | One of `EMAIL_SERVER_USER` / `EMAIL_SERVER_PASSWORD` is empty. Check spelling in `.env`. |
| No error, but no email | You changed `.env` but didn't restart `pnpm dev`. Restart it. |
| Email goes to Spam | Normal for Gmail-sent dev mail. Mark "Not spam"; for production use a real domain + provider (see §9). |
| `self-signed certificate` / TLS errors | Rare on Gmail; usually a corporate proxy. Try from a normal network. |
| Connection timeout on port 587 | A firewall/ISP is blocking SMTP. Try port `465` with `secure: true` (requires a small code change in `lib/email.ts`). |
| App Passwords option missing in Google | 2-Step Verification isn't enabled yet (see §3.1). |

### How to confirm the env vars actually loaded
The values are read in [`lib/email.ts:3-10`](../lib/email.ts#L3-L10). A quick check is to
add a temporary log there (remove it after):

```ts
console.log("SMTP host:", process.env.EMAIL_SERVER_HOST, "user set:", !!process.env.EMAIL_SERVER_USER);
```

---

## 8. Security & good practices

- **Never commit `.env`.** Use a separate Gmail account or App Password for dev vs. prod.
- **Remove the OTP console logs before production.** They appear in
  [`register/route.ts:36`](../app/api/auth/register/route.ts#L36) and
  [`resend-otp/route.ts:42`](../app/api/auth/resend-otp/route.ts#L42). Logging the code
  defeats the purpose of a one-time secret if logs are ever exposed.
- **Rotate / revoke** an App Password anytime at
  <https://myaccount.google.com/apppasswords> if it leaks.
- Consider adding basic **rate limiting** to register/resend so the OTP endpoints can't be
  abused to send mass email from your Gmail account.

---

## 9. Gmail limits (when to move on)

Gmail SMTP is great for development and small volume, but:

- A normal Gmail account can send to roughly **~500 recipients/day**; Google Workspace
  ~2,000/day. Exceeding this temporarily locks sending.
- Deliverability is weaker than a dedicated service (more spam-foldering).

For production, switch to a transactional email provider (Resend, Mailgun, SendGrid,
Brevo, Amazon SES). The good news: `lib/email.ts` is provider-agnostic SMTP, so you only
swap the five `EMAIL_*` values in `.env` — **no code changes needed**.

---

## Quick reference (copy-paste)

```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=youraddress@gmail.com
EMAIL_SERVER_PASSWORD=your16charapppassword
EMAIL_FROM="Tech Store <youraddress@gmail.com>"
```

1. Enable 2-Step Verification → 2. Create App Password → 3. Paste into `.env` →
4. `pnpm dev` → 5. Register with a real email → 6. Check inbox. ✅
