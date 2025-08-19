import { Request } from "express";

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
