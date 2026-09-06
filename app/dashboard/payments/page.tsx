import connectDB from "@/lib/db";
import Settings from "@/models/Settings";
import PaymentGatewaysManager from "./PaymentGatewaysManager";

export default async function PaymentsPage() {
  await connectDB();

  let settings = await Settings.findOne({}).lean();
  if (!settings) {
    settings = (await Settings.create({})).toObject();
  }

  const s = settings as any;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Payment Gateways
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Toggle and configure secure payment options for your store.
          </p>
        </div>

        <span className="flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-green-600">
          🔒 Secure 256-Bit SSL
        </span>
      </div>

      <PaymentGatewaysManager initialActiveMethods={s.activePaymentMethods || ["cod"]} />
    </div>
  );
}
