import "dotenv/config.js";
import { Router } from "express";
import Razorpay from "razorpay";
import Users from "../models/Users.js";
import Subscriptions from "../models/Subscription.js";

const razorpayRouter = Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

razorpayRouter.get("/plans", async (req, res) => {
  try {
    const plans = await razorpayInstance.plans.all();
    // console.log(plans);

    return res.status(200).json(plans);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

razorpayRouter.get("/customers", async (req, res) => {
  try {
    const customers = await razorpayInstance.customers.all();
    return res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customer details:", error);
    return res.status(400).json({ error });
  }
});

razorpayRouter.get("/subscriptions", async (req, res) => {
  try {
    const subs = await razorpayInstance.subscriptions.all();
    return res.status(200).json(subs);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

razorpayRouter.get("/subscriptions/:id", async (req, res) => {
  const subId = req.params.id;
  try {
    const sub = await razorpayInstance.subscriptions.fetch(subId);
    return res.status(200).json(sub);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

razorpayRouter.post("/subscriptions", async (req, res) => {
  const { plan_id, userId } = req.body;

  try {
    const user = await Users.findById(userId);

    const razorpay_subscription = await razorpayInstance.subscriptions.create({
      plan_id,
      customer_notify: 1,
      total_count: 12,
      notes: { userId },
      notify_info: {
        notify_email: user.email,
        notify_phone: user.phone,
      },
      // customer_id: "cust_PsjSk793HATWqD",
    });

    if (razorpay_subscription.id) {
      const {
        id,
        auth_attempts,
        charge_at,
        created_at,
        end_at,
        has_scheduled_changes,
        paid_count,
        payment_method,
        plan_id,
        remaining_count,
        short_url,
        source,
        start_at,
        status,
        total_count,
        addons,
        change_scheduled_at,
        current_end,
        current_start,
        customer_notify,
        ended_at,
        expire_by,
        notes,
        offer_id,
        quantity,
        schedule_change_at,
      } = razorpay_subscription;

      await Subscriptions.create({
        // Must
        _id: id,
        plan: plan_id,
        status,
        user: userId,
        notes,
        addons,
        notify_info: {
          notify_email: user.email,
          notify_phone: user.phone,
        },

        // Dates
        charge_at,
        start_at,
        end_at,
        created_at,
        expire_by,
        current_start,
        current_end,
        ended_at,

        // Other  Info
        source,
        payment_method,
        offer_id,
        remaining_count,
        quantity,
        customer_notify,

        // Payment Link
        short_url,

        // Additional
        auth_attempts,
        total_count,
        paid_count,

        has_scheduled_changes,
        change_scheduled_at,
        schedule_change_at,
      });
    }

    return res.status(201).json(razorpay_subscription);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
});

export default razorpayRouter;
