import connectDB from "@/lib/db";
import Settings from "@/models/Settings";
import SettingsManager from "./SettingsManager";

export default async function SiteSettingsPage() {
  await connectDB();

  let settings = await Settings.findOne({}).lean();
  if (!settings) {
    settings = (await Settings.create({})).toObject();
  }

  const s = settings as any;

  const initialValues = {
    siteName: s.siteName || "",
    siteLogo: s.siteLogo || "",
    siteDescription: s.siteDescription || "",
    contactEmail: s.contactEmail || "",
    footerText: s.footerText || "",
    activePaymentMethods: s.activePaymentMethods || ["cod"],
    bkashNumber: s.bkashNumber || "",
    nagadNumber: s.nagadNumber || "",
    rocketNumber: s.rocketNumber || "",
    paymentInstructions: s.paymentInstructions || "",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          Site Settings
        </h1>
        <p className="text-sm font-medium text-gray-500">
          Configure global platform identity and behavior.
        </p>
      </div>

      <SettingsManager initialValues={initialValues} />
    </div>
  );
}
