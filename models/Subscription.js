import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const SubscriptionSchema = new Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Subscriptions = model("payment", SubscriptionSchema);
export default Subscriptions;
