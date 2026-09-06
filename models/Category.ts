import mongoose, { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

if (models.Category && !models.Category.schema.path("slug")) {
  delete models.Category;
}

const Category = models.Category || model("Category", CategorySchema);

export default Category;
