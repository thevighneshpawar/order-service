import express from "express";
import authenticate from "../common/middleware/authenticate";
import { asyncWrapper } from "../utils";
import { CouponController } from "./couponController";

const router = express.Router();
const couponController = new CouponController();
router.post("/", authenticate, asyncWrapper(couponController.create));
router.post("/verify", authenticate, asyncWrapper(couponController.verify));
router.get("/:tenantId", authenticate, asyncWrapper(couponController.getAll));
router.patch("/:id", authenticate, asyncWrapper(couponController.edit));
router.delete("/:id", authenticate, asyncWrapper(couponController.delete));
export default router;
