import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import ProfileManager from "./ProfileManager";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  await connectDB();
  const user = await User.findById(session?.user.id).select("-password").lean();

  const u = user as any;

  const initialValues = {
    name: u?.name || "",
    email: u?.email || "",
    image: u?.image || "",
    role: u?.role || "user",
    isVerified: u?.isVerified ?? true,
  };

  return <ProfileManager initialValues={initialValues} />;
}
