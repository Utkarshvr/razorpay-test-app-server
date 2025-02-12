import "dotenv/config.js";
import connectToMongo from "./database/db.js";
import express from "express";
import cors from "cors";
import payment from "./routes/payment.js";
import webhookRouter from "./routes/weebhookRoute.routes.js";
import razorpayRouter from "./routes/razorpayRouter.routes.js";
import bodyParser from "body-parser";

connectToMongo();
const app = express();
const port = 4000;

// middleware
// app.use(express.json()); // don't use for clerk webhook to work properly
app.use(
  cors({
    origin: [
      "https://razorpay-test-app-client.vercel.app",
      "http://localhost:5173",
    ],
  })
);

//* Available Route
app.get("/", (req, res) => {
  res.send("Razorpay Payment Gateway Using React And Node Js ");
});
app.use("/api/webhooks", webhookRouter);

app.use(bodyParser.json());
app.use("/api/payment", payment);
app.use("/api/razorpay", razorpayRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
