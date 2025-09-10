import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middleware/globalErrorHandler";
import cookieParser from "cookie-parser";
import customerRouter from "./customer/customerRouter";
import authenticate from "./common/middleware/authenticate";
import couponRouter from "./coupon/couponRouter";
import orderRouter from "./order/orderRouter";
import paymentRouter from "./payment/paymentRouter";
import cors from "cors";
import config from "config";

const app = express();

const ALLOWED_DOMAINS = [
  config.get("frontend.clientUI"),
  config.get("frontend.adminUI"),
];

app.use(
  cors({
    origin: ALLOWED_DOMAINS as string[],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from order service service!" });
});

app.use("/customer", authenticate, customerRouter);
app.use("/coupon", authenticate, couponRouter);
app.use("/orders", orderRouter);
app.use("/payments", paymentRouter);
app.use(globalErrorHandler);

export default app;
