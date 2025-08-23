import express from "express";
import { PaymentController } from "./PaymentController";
import { asyncWrapper } from "../utils";
import { StripeGW } from "./stripe";
import { createGateway } from "../common/factories/gatewayFactory";
import { createMessageBroker } from "../common/factories/brokerFactory";

const router = express.Router();
const paymentGW = createGateway();
const broker = createMessageBroker();

const paymentController = new PaymentController(paymentGW, broker);

router.post("/webhook", asyncWrapper(paymentController.handleWebhook));

export default router;
