import connectDB from "@/lib/db";
import Settings from "@/models/Settings";
import BannerManager from "./BannerManager";

export default async function BannerPage() {
  await connectDB();

  let settings = await Settings.findOne({}).lean();
  if (!settings) {
    settings = (await Settings.create({})).toObject();
  }

  const s = settings as any;

  const initialSlides = (s.heroSlides || []).map((slide: any) => ({
    badge: slide.badge || "",
    headlinePrimary: slide.headlinePrimary || "",
    headlineSecondary: slide.headlineSecondary || "",
    description: slide.description || "",
    image: slide.image || "",
  }));

  return <BannerManager initialSlides={initialSlides} />;
}
