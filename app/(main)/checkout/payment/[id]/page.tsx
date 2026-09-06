import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Settings from "@/models/Settings";
import PaymentProof from "./PaymentProof";

export default async function PaymentProofPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();
  const order = await Order.findById(id).lean();
  if (!order) {
    redirect("/");
  }

  const o = order as any;

  if (o.paymentMethod !== "bkash") {
    redirect(`/checkout/success/${id}`);
  }

  let settings = await Settings.findOne({}).lean();
  if (!settings) settings = (await Settings.create({})).toObject();
  const s = settings as any;

  return (
    <PaymentProof
      order={JSON.parse(JSON.stringify(o))}
      bkashNumber={s.bkashNumber || "01700000000"}
      paymentInstructions={
        s.paymentInstructions ||
        "Please make manual payment and provide your transaction ID."
      }
    />
  );
}
