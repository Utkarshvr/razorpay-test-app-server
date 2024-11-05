import Subscriptions from "../models/Subscription";

// Handle Subscription Activation
export async function handleSubscriptionActivation(subscription) {
  console.log({ subscription });

  const {
    id,
    customer_email,
    plan_id,
    created_at,
    customer_id,
    nextDueAt,
    notes,
  } = subscription;

  const userID = notes.user_id;

  try {
    await Subscriptions.findByIdAndUpdate(
      id,
      {
        plan: plan_id,
        createdAt: new Date(created_at * 1000),
        user: userID,
        customer_id: customer_id,
        nextDueAt: nextDueAt,
        status: "active",
      },
      { upsert: true, new: true }
    );
    console.log("Subscription activated for:", id);
  } catch (error) {
    console.log(error);
  }
}

// Handle Subscription Completion
export async function handleSubscriptionCompletion(subscription) {
  console.log({ subscription });

  const { id } = subscription;
  await Subscriptions.findByIdAndUpdate(id, { status: "completed" });
  console.log("Subscription completed for:", id);
}

// Handle Payment Capture and Save Invoice
export async function handlePaymentCaptured(payment) {
  console.log({ payment });

  const { id, entity, amount, currency, created_at, status, notes } = payment;
  const subscription_id = notes.subscription_id; // Assuming subscription ID is stored in notes
  const user_id = notes.user_id; // Assuming subscription ID is stored in notes

  const newInvoice = new Invoice({
    _id: id,
    subscription: subscription_id,
    user: user_id,
    amount: amount / 100, // Convert from paise to rupees
    currency,
    status,
    issuedAt: new Date(created_at * 1000),
  });

  await newInvoice.save();
  console.log("Invoice created for payment:", id);
}
