import mongoose from "mongoose";
import { ProductPricingCache } from "../types";

const priceSchema = new mongoose.Schema({
  priceType: {
    type: String,
    enum: ["base", "aditional"],
  },
  availableOptions: {
    type: Object,
    of: Number,
  },
});

const productCacheSchema = new mongoose.Schema<ProductPricingCache>(
  {
    productId: {
      type: String,
      required: true,
    },
    priceConfiguration: {
      type: Object,
      of: priceSchema,
    },
  },
  { timestamps: true },
);

export default mongoose.model(
  "ProductCache",
  productCacheSchema,
  "productCache",
);
