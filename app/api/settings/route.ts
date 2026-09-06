export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Settings from "@/models/Settings";

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne({}, { 
      siteName: 1, 
      siteLogo: 1, 
      activePaymentMethods: 1,
      siteDescription: 1,
      contactEmail: 1,
      footerText: 1,
      bkashNumber: 1,
      nagadNumber: 1,
      rocketNumber: 1,
      paymentInstructions: 1,
      heroBadge: 1,
      heroHeadlinePrimary: 1,
      heroHeadlineSecondary: 1,
      heroDescription: 1,
      heroImage: 1,
      heroSlides: 1,
    });

    if (!settings) {
      settings = await Settings.create({});
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const allowedRoles = ["super-admin", "admin"];
    if (!session || !allowedRoles.includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updateData = await req.json();
    await connectDB();

    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create(updateData);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, updateData, {
        new: true,
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
