// models/Invoice.js
import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  _id: String, // Razorpay payment ID
  subscription: { type: String, ref: "Subscription" },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  amount: Number,
  currency: String,
  status: String,
  issuedAt: Date,
});

const invoices = mongoose.model("Invoice", invoiceSchema);

export default invoices;
