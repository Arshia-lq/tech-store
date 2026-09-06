
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const requiredCategories = [
  {
    name: "Smartphones",
    slug: "smartphones",
    icon: "Smartphone",
  },
  {
    name: "Laptops",
    slug: "laptops",
    icon: "Laptop",
  },
  {
    name: "Audio",
    slug: "audio",
    icon: "Headphones",
  },
  {
    name: "Tablets",
    slug: "tablets",
    icon: "Tablet",
  },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (
      !session ||
      (role !== "super-admin" && role !== "admin")
    ) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    await connectDB();

    const createdCategories = [];

    for (const categoryData of requiredCategories) {
      let category = await Category.findOne({
        name: categoryData.name,
      });

      if (!category) {
        category = await Category.create(categoryData);
      }

      createdCategories.push(category);
    }

    // Fix existing products that use category names instead of ObjectIds
    const products = await Product.find({});

    let productsReassigned = 0;

    for (const product of products) {
      const categoryValue = product.category as any;

      if (typeof categoryValue === "string") {
        const matchingCategory = createdCategories.find(
          (category) => category.name === categoryValue
        );

        if (matchingCategory) {
          await Product.updateOne(
            { _id: product._id },
            { $set: { category: matchingCategory._id } }
          );

          productsReassigned++;
        }
      }
    }

    return NextResponse.json({
      status: "Success",
      message: "Categories created successfully",
      categories: createdCategories.map((category) => ({
        id: category._id,
        name: category.name,
      })),
      productsReassigned,
    });
  } catch (error: any) {
    console.error("Seed categories error:", error);

    return NextResponse.json(
      {
        error: error.message || "An internal error occurred",
      },
      { status: 500 }
    );
  }
}
