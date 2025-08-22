import express from "express";
import authenticate from "../common/middleware/authenticate";
import { asyncWrapper } from "../utils";
import { OrderController } from "./orderController";
import { StripeGW } from "../payment/stripe";
import { createGateway } from "../common/factories/gatewayFactory";
const router = express.Router();
const paymentGw = createGateway();
const orderController = new OrderController(paymentGw);

router.post("/", authenticate, asyncWrapper(orderController.create));

export default router;
