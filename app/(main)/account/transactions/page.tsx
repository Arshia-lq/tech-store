import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import TransactionsView from "./TransactionsView";

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  Paid: "Completed",
  Pending: "Pending",
  Failed: "Failed",
};

export default async function TransactionsPage() {
  const session = await getServerSession(authOptions);

  await connectDB();
  const orders = await Order.find({ user: session?.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const transactions = (orders as any[]).map((o) => ({
    id: o.transactionId || o._id.toString().slice(-8).toUpperCase(),
    orderId: o._id.toString(),
    type: "Order Payment",
    method: o.paymentMethod,
    amount: o.totalPrice,
    status: PAYMENT_STATUS_LABEL[o.paymentStatus] || o.paymentStatus,
    date: o.createdAt,
  }));

  const totalSpent = transactions
    .filter((t) => t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);
  const processing = transactions
    .filter((t) => t.status === "Pending")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <TransactionsView
      transactions={transactions}
      totalSpent={totalSpent}
      processing={processing}
    />
  );
}
