import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

const categoryNames = [
  "Smartphones",
  "Laptops",
  "Accessories",
  "Tablets",
  "Audio Systems",
  "Gaming Gear",
];

const dummyProducts = [
  {
    name: "iPhone 17 Pro Max",
    description: "Apple's flagship smartphone with a large LTPO Super Retina XDR display.",
    price: 230000,
    regularPrice: 249999,
    images: ["https://i.ibb.co/fY3hzFv5/image-removebg-preview-18.webp"],
    categoryName: "Smartphones",
    brand: "Apple",
    sku: "842468",
    keyFeatures: [
      { label: "Display & Visuals", value: "Verified Tech" },
      { label: "Size", value: "6.9-inch LTPO Super Retina XDR OLED" },
      { label: "Resolution", value: "2868 x 1320 pixels (~460 ppi)" },
      { label: "Refresh Rate", value: "120Hz ProMotion (Always-On Display)" },
      { label: "Brightness", value: "3000 nits Peak Brightness" },
    ],
    stock: 20,
  },
  {
    name: "MX Brio",
    description: "A high-end 4K webcam built for streaming and professional video calls.",
    price: 21000,
    regularPrice: 22000,
    images: ["https://i.ibb.co/HLfGTw04/image-removebg-preview-5.webp"],
    categoryName: "Accessories",
    brand: "Logitech",
    sku: "ACA380",
    keyFeatures: [
      { label: "Video & Optical Performance", value: "Verified Tech" },
      { label: "Max Video Resolution", value: "4K Ultra HD (3840 x 2160 pixels) @ 30fps" },
      { label: "High-Frame Rate Video", value: "Full HD 1080p @ 60fps (For smooth streaming)" },
      { label: "Focus Technology", value: "Advanced Autofocus (Keeps subject sharp in all conditions)" },
    ],
    stock: 40,
  },
  {
    name: "ROG Azoth Extreme",
    description: "A premium mechanical gaming keyboard built for pro-level responsiveness.",
    price: 63999,
    regularPrice: 66000,
    images: ["https://i.ibb.co/V0WtDRcR/image-removebg-preview-5-3.webp"],
    categoryName: "Gaming Gear",
    brand: "Asus",
    sku: "06EB87",
    keyFeatures: [
      { label: "Key Features & Performance", value: "Verified Tech" },
      { label: "Keyboard Type", value: "Mechanical Gaming Keyboard" },
      { label: "Switches", value: "ROG NX Mechanical Switches (Pre-lubed)" },
      { label: "Polling Rate", value: "8000 Hz (Ultra-fast response for pro gaming)" },
      { label: "Special Mode", value: "Speed Tap Mode (Rapid trigger functionality)" },
    ],
    stock: 15,
  },
  {
    name: "PlayStation 5 Ghost of Yotei Gold Edition",
    description: "A limited edition PS5 console inspired by Ghost of Yotei, featuring gold-plated finishes.",
    price: 87000,
    regularPrice: 95700,
    images: ["https://i.ibb.co/C37TBQhY/image-removebg-preview.webp"],
    categoryName: "Gaming Gear",
    brand: "Sony",
    sku: "F2CFB5",
    keyFeatures: [
      { label: "Design & Aesthetics", value: "Verified Tech" },
      { label: "Edition", value: "Ghost of Yotei Gold Limited Edition (Inspired by Atsu's Journey)" },
      { label: "Finish", value: "Laser-etched Metallic Gold Plates with Traditional Japanese Floral Motifs" },
      { label: "Console Type", value: "Slim Design (Removable Disc Drive support)" },
      { label: "Controller", value: "Custom DualSense Wireless Controller (Gold & Obsidian Black with Ghost emblem)" },
    ],
    stock: 10,
  },
  {
    name: "ROG Rapture GT-AX11000 Pro",
    description: "A high-performance gaming router built for low-latency, high-throughput networking.",
    price: 60000,
    regularPrice: 61000,
    images: ["https://i.ibb.co/93sLDgP9/image-removebg-preview-21.webp"],
    categoryName: "Accessories",
    brand: "Asus",
    sku: "515A52",
    keyFeatures: [
      { label: "Processor & Memory", value: "Verified Tech" },
      { label: "CPU", value: "2.0GHz Quad-core Processor" },
      { label: "RAM", value: "1GB DDR4" },
      { label: "Flash Memory", value: "256MB NAND Flash" },
      { label: "Wireless & Data Rates", value: "Verified Tech" },
    ],
    stock: 18,
  },
  {
    name: "GeForce RTX 5090 32G Lightning Z",
    description: "A flagship graphics card built for extreme 8K gaming and creative workloads.",
    price: 990000,
    regularPrice: 995000,
    images: ["https://i.ibb.co/fV6JdsQm/image-removebg-preview-13.webp"],
    categoryName: "Accessories",
    brand: "MSI",
    sku: "515A3C",
    keyFeatures: [
      { label: "Performance & GPU Core", value: "Verified Tech" },
      { label: "CUDA Cores", value: "21760 (Extreme Processing Power)" },
      { label: "Core Clock (Extreme)", value: "2775 MHz (via MSI Center)" },
      { label: "Boost Clock", value: "2730 MHz" },
      { label: "Max Resolution", value: "Up to 7680 x 4320p (8K Support)" },
    ],
    stock: 5,
  },
  {
    name: "Odyssey Neo G9",
    description: "An ultra-wide curved gaming monitor with Quantum Mini LED technology.",
    price: 320000,
    regularPrice: 340000,
    images: ["https://i.ibb.co/hxFFsZ8V/image-removebg-preview-8.png"],
    categoryName: "Accessories",
    brand: "Samsung",
    sku: "515A35",
    keyFeatures: [
      { label: "Display & Visuals", value: "Verified Tech" },
      { label: "Size", value: "57-inch Ultra-Wide (32:9 Aspect Ratio)" },
      { label: "Resolution", value: "Dual UHD (7680 x 2160 pixels)" },
      { label: "Panel Type", value: "VA with Quantum Mini LED Technology" },
      { label: "Curvature", value: "1000R (Human eye-like curve)" },
    ],
    stock: 8,
  },
  {
    name: "Starlink Flat High Performance",
    description: "A high-performance flat satellite internet dish for reliable connectivity anywhere.",
    price: 185000,
    regularPrice: 185000,
    images: ["https://i.ibb.co/YTXW6HRF/image-removebg-preview-5-1.webp"],
    categoryName: "Accessories",
    brand: "Starlink",
    sku: "6F2DA6",
    keyFeatures: [
      { label: "Satellite & Antenna Specs", value: "Verified Tech" },
      { label: "Antenna Type", value: "Electronic Phased Array" },
      { label: "Field of View", value: "140 degrees" },
      { label: "Orientation", value: "Fixed" },
      { label: "Snow Melt Capability", value: "Up to 75 mm / hour (3 in / hour)" },
    ],
    stock: 12,
  },
  {
    name: "Lifestyle 650",
    description: "A premium home theater speaker system with immersive surround sound.",
    price: 660000,
    regularPrice: 665000,
    images: ["https://i.ibb.co/XfZqtpqr/image-removebg-preview-1.webp"],
    categoryName: "Audio Systems",
    brand: "Bose",
    sku: "4DE06D",
    keyFeatures: [
      { label: "Audio & Speaker System", value: "Verified Tech" },
      { label: "Center Speaker", value: "OmniJewel centre speaker (High-fidelity output)" },
      { label: "Satellite Speakers", value: "4 x OmniJewel speakers (Compact & powerful)" },
      { label: "Bass Module", value: "Acoustimass wireless bass module (Deep, rich bass)" },
      { label: "Rear Connectivity", value: "Wireless receivers for rear speakers (Cable-free setup)" },
    ],
    stock: 6,
  },
  {
    name: "HERO11 Black Creator Edition",
    description: "A rugged action camera bundle built for professional content creation.",
    price: 45000,
    regularPrice: 48400,
    images: ["https://i.ibb.co/w5FW5gP/image-removebg-preview-11.webp"],
    categoryName: "Accessories",
    brand: "GoPro",
    sku: "528102",
    keyFeatures: [
      { label: "Camera & Image Sensor", value: "Verified Tech" },
      { label: "Sensor Type", value: "1/1.9 inch CMOS" },
      { label: "Sensor Resolution", value: "27.6 MP (Active Pixels)" },
      { label: "Still Image Resolution", value: "27.13 MP (5568 x 4872)" },
      { label: "HDR Mode", value: "Supported" },
    ],
    stock: 22,
  },
  {
    name: "Mini 5 Pro Fly More Combo Plus",
    description: "A compact, high-performance drone bundle with extended flight accessories.",
    price: 97000,
    regularPrice: 120000,
    images: ["https://i.ibb.co/Ps9TmvBB/image-removebg-preview-2.webp"],
    categoryName: "Accessories",
    brand: "DJI",
    sku: "20A51A",
    keyFeatures: [
      { label: "Camera & Imaging", value: "Verified Tech" },
      { label: "Sensor", value: "1-inch CMOS Sensor" },
      { label: "Effective Pixels", value: "50MP" },
      { label: "Lens", value: "24mm (Format Equivalent)" },
      { label: "Aperture", value: "f/1.8" },
    ],
    stock: 14,
  },
  {
    name: "ROG Strix SCAR 18 (2025)",
    description: "A top-tier gaming laptop combining flagship desktop-class performance in a portable chassis.",
    price: 649000,
    regularPrice: 649900,
    images: ["https://i.ibb.co/V0WtDRcR/image-removebg-preview-5-3.webp"],
    categoryName: "Laptops",
    brand: "Asus",
    sku: "D1040E",
    keyFeatures: [
      { label: "Processor & Performance", value: "Verified Tech" },
      { label: "CPU", value: "Intel Core Ultra 9 275HX (14th Gen)" },
      { label: "Cores/Threads", value: "24 Cores / 24 Threads" },
    ],
    stock: 7,
  },
  {
    name: "MacBook Air 15",
    description: "Apple's thin and light 15-inch laptop with a Liquid Retina display.",
    price: 98000,
    regularPrice: 107800,
    images: ["https://i.ibb.co/604HdTbD/mackbook-4-removebg-preview.webp"],
    categoryName: "Laptops",
    brand: "Apple",
    sku: "EE9481",
    keyFeatures: [
      { label: "Display", value: "Verified Tech" },
      { label: "Size", value: "15.3-inch Liquid Retina Display" },
      { label: "Resolution", value: "2880 x 1864 pixels" },
      { label: "Brightness", value: "500 nits" },
      { label: "Technology", value: "True Tone, Wide Color (P3), 1 Billion Colors" },
    ],
    stock: 25,
  },
];

async function seed() {
  await connectDB();

  console.log("Seeding categories...");
  const categoryMap: Record<string, string> = {};

  for (const name of categoryNames) {
    const slug = slugify(name);
    const category = await Category.findOneAndUpdate(
      { name },
      { name, slug },
      { upsert: true, new: true }
    );
    categoryMap[name] = category._id.toString();
  }

  console.log("Seeding products...");
  await Product.deleteMany({}); // wipes old dummy products — remove this line if you don't want that

  const productsToInsert = dummyProducts.map(({ categoryName, ...rest }) => ({
    ...rest,
    category: categoryMap[categoryName],
  }));

  await Product.insertMany(productsToInsert);

  console.log(`Seeded ${productsToInsert.length} products.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
