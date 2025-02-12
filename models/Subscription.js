import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const SubscriptionSchema = new Schema({
  // Must
  _id: String,
  plan: String,
  status: String,
  customer_id: String,
  user: { type: String, ref: "User" },
  notes: Object,
  addons: Object,
  notify_info: {
    notify_email: String,
    notify_phone: String,
  },

  // Dates
  charge_at: Number,
  start_at: Number,
  end_at: Number,
  created_at: Number,
  expire_by: Number,
  current_start: Number,
  current_end: Number,
  ended_at: Number,

  // Other  Info
  source: String,
  payment_method: String,
  offer_id: String,
  remaining_count: Number,
  quantity: Number,
  customer_notify: Boolean,

  // Payment Link
  short_url: String,

  // Additional
  auth_attempts: Number,
  total_count: Number,
  paid_count: Number,

  has_scheduled_changes: Boolean,
  change_scheduled_at: Number,
  schedule_change_at: Number,
});

const Subscriptions = model("Subscription", SubscriptionSchema);
export default Subscriptions;
