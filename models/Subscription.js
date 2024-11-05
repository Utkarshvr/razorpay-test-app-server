import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const SubscriptionSchema = new Schema({
  _id: String,
  plan: {
    type: String,
  },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  customer_id: String,

  createdAt: Date,
  nextDueAt: Date,

  status: String,
});

const Subscriptions = model("Subscription", SubscriptionSchema);
export default Subscriptions;
