import express, { Request, Response } from "express";
import orderModel from "../order/orderModel";
import { PaymentGW } from "./paymentTypes";
import { OrderEvents, PaymentStatus } from "../order/orderTypes";
import { MessageBroker } from "../types/broker";
import customerModel from "../customer/customerModel";

export class PaymentController {
  constructor(
    private paymentGw: PaymentGW,
    private broker: MessageBroker,
  ) {}
  handleWebhook = async (req: Request, res: Response) => {
    const webhookBody = req.body;

    if (webhookBody.type === "checkout.session.completed") {
      const verifiedSession = await this.paymentGw.getSession(
        webhookBody.data.object.id,
      );

      const isPaymentSuccess = verifiedSession.paymentStatus === "paid";

      const updatedOrder = await orderModel.findOneAndUpdate(
        {
          _id: verifiedSession.metadata.orderId,
        },
        {
          paymentStatus: isPaymentSuccess
            ? PaymentStatus.PAID
            : PaymentStatus.FAILED,
        },
        { new: true },
      );

      const customer = await customerModel.findOne({
        _id: updatedOrder.customerId,
      });
      // todo: Think about broker message fail.
      const brokerMessage = {
        event_type: OrderEvents.PAYMENT_STATUS_UPDATE,
        data: updatedOrder,
        customerId: customer,
      };

      await this.broker.sendMessage(
        "order",
        JSON.stringify(brokerMessage),
        updatedOrder._id.toString(),
      );
    }

    return res.json({ success: true });
  };
}
