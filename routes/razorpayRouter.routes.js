import "dotenv/config.js";
import { Router } from "express";
import Razorpay from "razorpay";

const razorpayRouter = Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

razorpayRouter.get("/plans", async (req, res) => {
  try {
    const plans = await razorpayInstance.plans.all();
    console.log(plans);

    return res.status(200).json({ plans });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

export default razorpayRouter;
