import { connect } from "mongoose";

const connectToMongo = async () => {
  try {
    await connect(process.env.MONGO_URI, {
      dbName: "Razorpay_SaaS_Test",
    });
    console.log("---***Database Connected Successfully***---");
  } catch (error) {
    console.log(error);
  }
};

export default connectToMongo;
