import { ProductMessage } from "../types";
import productCacheModel from "./productCache.model";

export const handleProductUpdate = async (value: string) => {
  try {
    const product: ProductMessage = JSON.parse(value);

    // Use product.id instead of product.data.id
    return await productCacheModel.updateOne(
      {
        productId: product.id,
      },
      {
        $set: {
          priceConfiguration: product.priceConfiguration,
        },
      },
      { upsert: true },
    );
  } catch (error) {
    console.error("Invalid JSON in product message:", error);
    throw error;
  }
};
