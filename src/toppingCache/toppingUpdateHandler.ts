import { ToppingMessage } from "../types";
import toppingCacheModel from "./toppingCache.model";

export const handleToppingUpdate = async (value: string) => {
  try {
    const topping: ToppingMessage = JSON.parse(value);

    // Use topping.id instead of topping.data.id
    return await toppingCacheModel.updateOne(
      {
        toppingId: topping.id,
      },

      {
        $set: {
          price: topping.price,
          tenantId: topping.tenantId,
        },
      },

      { upsert: true },
    );
  } catch (error) {
    console.error("Invalid JSON in topping message:", error);
    throw error;
  }
};
