import express from "express";
import { PaymentController } from "./PaymentController";
import { asyncWrapper } from "../utils";
import { StripeGW } from "./stripe";
import { createGateway } from "../common/factories/gatewayFactory";

const router = express.Router();
const paymentGW = createGateway();

const paymentController = new PaymentController(paymentGW);

router.post("/webhook", asyncWrapper(paymentController.handleWebhook));

export default router;
