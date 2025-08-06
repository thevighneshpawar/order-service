import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middleware/globalErrorHandler";
import cookieParser from "cookie-parser";
import customerRouter from "./customer/customerRouter";
import authenticate from "./common/middleware/authenticate";
import couponRouter from "./coupon/couponRouter";
const app = express();
app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from order service service!" });
});

app.use("/customer", authenticate, customerRouter);
app.use("/coupon", authenticate, couponRouter);

app.use(globalErrorHandler);

export default app;
