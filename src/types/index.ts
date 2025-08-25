import { Request } from "express";
import mongoose from "mongoose";

export type AuthCookie = {
  accessToken: string;
};

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: string;
    id?: string;
    tenant: string;
  };
}

export interface PriceConfiguration {
  priceType: "base" | "aditional";
  availableOptions: {
    [key: string]: number;
  };
}
export interface ProductPricingCache {
  productId: string;
  priceConfiguration: PriceConfiguration;
}

export interface ProductMessage {
  event_type: ProductEvents;
  id: string;
  priceConfiguration: PriceConfiguration;
}

export enum ProductEvents {
  PRODUCT_CREATE = "PRODUCT_CREATE",
  PRODUCT_UPDATE = "PRODUCT_UPDATE",
  PRODUCT_DELETE = "PRODUCT_DELETE",
}

export interface ToppingMessage {
  event_type: ToppingEvents;
  id: string;
  price: number;
  tenantId: string;
}

export enum ToppingEvents {
  Topping_CREATE = "Topping_CREATE",
  Topping_UPDATE = "Topping_UPDATE",
  Topping_DELETE = "Topping_DELETE",
}

export interface ToppingPriceCache {
  _id: mongoose.Types.ObjectId;
  toppingId: string;
  price: number;
  tenantId: string;
}

export interface ProductPriceConfiguration {
  [key: string]: {
    priceType: "base" | "aditional";
    availableOptions: {
      [key: string]: number;
    };
  };
}

export type Product = {
  _id: string;
  name: string;
  image: string;
  description: string;
  priceConfiguration: ProductPriceConfiguration;
};

export type Topping = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export interface CartItem
  extends Pick<Product, "_id" | "name" | "image" | "priceConfiguration"> {
  chosenConfiguration: {
    priceConfiguration: {
      [key: string]: string;
    };
    selectedToppings: Topping[];
  };
  qty: number;
}

export enum ROLES {
  ADMIN = "admin",
  CUSTOMER = "customer",
  MANAGER = "manager",
}
