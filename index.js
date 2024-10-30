import "dotenv/config.js";
import connectToMongo from "./database/db.js";
import express from "express";
import cors from "cors";
import payment from "./routes/payment.js";
import webhookRouter from "./routes/weebhookRoute.routes.js";
import razorpayRouter from "./routes/razorpayRouter.routes.js";

connectToMongo();
const app = express();
const port = 4000;

// middleware
// app.use(express.json()); // don't use for clerk webhook to work properly
app.use(cors({ origin: "https://razorpay-test-app-client.vercel.app" }));

//* Available Route
app.get("/", (req, res) => {
  res.send("Razorpay Payment Gateway Using React And Node Js ");
});
app.use("/api/payment", payment);

app.use("/api/razorpay", razorpayRouter);
app.use("/api/webhooks", webhookRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
