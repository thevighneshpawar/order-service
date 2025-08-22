import { PaymentGW } from "../../payment/paymentTypes";
import { StripeGW } from "../../payment/stripe";

let gateway: PaymentGW | null = null;
export const createGateway = () => {
  // singleton
  if (!gateway) {
    gateway = new StripeGW();
  }
  return gateway;
};
