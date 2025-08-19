import { Request, Response } from "express";
import {
  CartItem,
  ProductPricingCache,
  Topping,
  ToppingPriceCache,
} from "../types";
import productCacheModel from "../productcache/productCache.model";
import toppingCacheModel from "../toppingCache/toppingCache.model";
import couponModel from "../coupon/couponModel";

export class OrderController {
  create = async (req: Request, res: Response) => {
    // todo: validate request data.
    console.log(req.body.cart);
    const totalPrice = await this.calculateTotal(req.body.cart);

    let discountPercentage = 0;

    const couponCode = req.body.couponCode;
    const tenantId = req.body.tenantId;

    if (couponCode) {
      discountPercentage = await this.getDiscountPercentage(
        couponCode,
        tenantId,
      );
    }

    const discountAmount = Math.round((totalPrice * discountPercentage) / 100);

    return res.json({ discountAmount: discountAmount });
  };

  private calculateTotal = async (cart: CartItem[]) => {
    const productIds = cart.map((item) => item._id);

    // todo: proper error handling..
    const productPricings = await productCacheModel.find({
      productId: {
        $in: productIds,
      },
    });

    console.log("productPricings", productPricings);

    // todo: What will happen if product does not exists in the cache
    // 1. call catalog service.
    // 2. Use price from cart <- BAD

    const cartToppingIds = cart.reduce((acc, item) => {
      return [
        ...acc,
        ...item.chosenConfiguration.selectedToppings.map(
          (topping) => topping.id,
        ),
      ];
    }, []);

    // todo: What will happen if topping does not exists in the cache
    const toppingPricings = await toppingCacheModel.find({
      toppingId: {
        $in: cartToppingIds,
      },
    });

    console.log("toppingPricings:", toppingPricings);

    const totalPrice = cart.reduce((acc, curr) => {
      const cachedProductPrice = productPricings.find(
        (product) => product.productId === curr._id,
      );

      return (
        acc +
        curr.qty * this.getItemTotal(curr, cachedProductPrice, toppingPricings)
      );
    }, 0);

    return totalPrice;
  };

  private getItemTotal = (
    item: CartItem,
    cachedProductPrice: ProductPricingCache | undefined,
    toppingsPricings: ToppingPriceCache[],
  ) => {
    const toppingsTotal = item.chosenConfiguration.selectedToppings.reduce(
      (acc, curr) => {
        return acc + this.getCurrentToppingPrice(curr, toppingsPricings);
      },
      0,
    );

    const productTotal = Object.entries(
      item.chosenConfiguration.priceConfiguration,
    ).reduce((acc, [key, value]) => {
      let price = 0;

      // Use cached price if available, otherwise fallback to client value
      if (
        cachedProductPrice &&
        cachedProductPrice.priceConfiguration[key] &&
        cachedProductPrice.priceConfiguration[key].availableOptions[value]
      ) {
        price =
          cachedProductPrice.priceConfiguration[key].availableOptions[value];
        console.log(
          `Using cached price for product ${item._id}, config ${key}: ${price}`,
        );
      } else {
        // Fallback to client-side price configuration
        if (
          item.priceConfiguration[key] &&
          item.priceConfiguration[key].availableOptions[value]
        ) {
          price = item.priceConfiguration[key].availableOptions[value];
          console.log(
            `Using client price for product ${item._id}, config ${key}: ${price} (cache not available)`,
          );
        } else {
          console.warn(
            `No price found for product ${item._id}, config ${key}: ${value}`,
          );
        }
      }

      return acc + price;
    }, 0);

    return productTotal + toppingsTotal;
  };

  private getCurrentToppingPrice = (
    topping: Topping,
    toppingPricings: ToppingPriceCache[],
  ) => {
    const currentTopping = toppingPricings.find(
      (current) => topping.id === current.toppingId,
    );

    if (!currentTopping) {
      // todo: Make sure the item is in the cache else, maybe call catalog service.
      console.log(
        `Using client price for topping ${topping.id}: ${topping.price} (cache not available)`,
      );
      return topping.price;
    }

    console.log(
      `Using cached price for topping ${topping.id}: ${currentTopping.price}`,
    );
    return currentTopping.price;
  };

  private getDiscountPercentage = async (
    couponCode: string,
    tenantId: string,
  ) => {
    const code = await couponModel.findOne({ code: couponCode, tenantId });

    if (!code) {
      return 0;
    }

    const currentDate = new Date();
    const couponDate = new Date(code.validUpto);

    if (currentDate <= couponDate) {
      return code.discount;
    }

    return 0;
  };
}
