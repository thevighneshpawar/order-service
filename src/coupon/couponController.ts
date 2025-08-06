import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import couponModel from "./couponModel";
import createHttpError from "http-errors";

export class CouponController {
  create = async (req: Request, res: Response) => {
    const { title, code, validUpto, discount, tenantId } = req.body;

    // todo: add request validation.
    if (!title || !code || !validUpto || !discount || !tenantId) {
      const error = createHttpError(400, "All fields are required");
      return res.status(error.statusCode).json({ message: error.message });
    }
    // Check if the creator is an admin or a manager of the same tenant.

    console.log(req?.auth.role, req?.auth.tenantId, tenantId);

    if (
      req?.auth.role !== "admin" &&
      (req?.auth.role !== "MANAGER" || req?.auth.tenantId !== tenantId)
    ) {
      const error = createHttpError(
        403,
        "You are not allowed to create coupons for this tenant",
      );
      return res.status(error.statusCode).json({ message: error.message });
    }

    // todo: add logging
    const coupon = await couponModel.create({
      title,
      code,
      discount,
      validUpto,
      tenantId,
    });

    return res.json(coupon);
  };

  // todo: Complete CRUD assignment. This will be used in dashboard.

  verify = async (req: Request, res: Response, next: NextFunction) => {
    const { code, tenantId } = req.body;

    // todo: request validation
    if (!code || !tenantId) {
      const error = createHttpError(400, "All fields are required");
      return res.status(error.statusCode).json({ message: error.message });
    }

    // todo: add service layer with dependency injection.
    const coupon = await couponModel.findOne({ code, tenantId });

    if (!coupon) {
      const error = createHttpError(400, "Coupon does not exists");
      return next(error);
    }

    // validate expiry
    const currentDate = new Date();
    const couponDate = new Date(coupon.validUpto);

    if (currentDate <= couponDate) {
      return res.json({ valid: true, discount: coupon.discount });
    }

    return res.json({ valid: false, discount: 0 });
  };

  getAll = async (req: Request, res: Response) => {
    const { tenantId } = req.params;

    if (
      req?.auth.role !== "admin" &&
      (req?.auth.role !== "MANAGER" || req?.auth.tenantId !== tenantId)
    ) {
      const error = createHttpError(
        403,
        "You are not allowed to create coupons for this tenant",
      );
      return res.status(error.statusCode).json({ message: error.message });
    }

    const coupons = await couponModel.find({ tenantId });

    return res.json({ coupons: coupons });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    const coupon = await couponModel.findById(id);
    if (
      req?.auth.role !== "admin" &&
      (req?.auth.role !== "MANAGER" || req?.auth.tenantId !== coupon?.tenantId)
    ) {
      const error = createHttpError(
        403,
        "You are not allowed to create coupons for this tenant",
      );
      return res.status(error.statusCode).json({ message: error.message });
    }

    const deletedCoupon = await couponModel.findByIdAndDelete(id);

    if (!deletedCoupon) {
      const error = createHttpError(404, "Coupon not found");
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.json({ message: "Coupon deleted successfully" });
  };

  edit = async (req: Request, res: Response) => {
    const { id } = req.params;

    const coupon = await couponModel.findById(id);
    if (
      req?.auth.role !== "admin" &&
      (req?.auth.role !== "MANAGER" || req?.auth.tenantId !== coupon?.tenantId)
    ) {
      const error = createHttpError(
        403,
        "You are not allowed to create coupons for this tenant",
      );
      return res.status(error.statusCode).json({ message: error.message });
    }

    const updatedCoupon = await couponModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCoupon) {
      const error = createHttpError(404, "Coupon not found");
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.json(updatedCoupon);
  };
}
