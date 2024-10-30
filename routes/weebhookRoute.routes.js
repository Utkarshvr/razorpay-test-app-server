import "dotenv/config.js";
import { Router } from "express";
import bodyParser from "body-parser";
import { Webhook } from "svix";
import Users from "../models/Users.js";

const webhookRouter = Router();

webhookRouter.post(
  "/clerk",
  bodyParser.raw({ type: "application/json" }),
  async function (req, res) {
    // Check if the 'Signing Secret' from the Clerk Dashboard was correctly provided
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error("You need a WEBHOOK_SECRET in your .env");
    }

    // Grab the headers and body
    const headers = req.headers;
    const payload = req.body;

    // Get the Svix headers for verification
    const svix_id = headers["svix-id"];
    const svix_timestamp = headers["svix-timestamp"];
    const svix_signature = headers["svix-signature"];

    // If there are missing Svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({
        success: false,
        message: "Error occurred -- no svix headers",
      });
    }

    console.log({ svix_id, svix_timestamp, svix_signature });

    // Initiate Svix
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    // Attempt to verify the incoming webhook
    // If successful, the payload will be available from 'evt'
    // If the verification fails, error out and return error code
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      // Console log and return error
      console.log("Webhook failed to verify. Error:", err.message);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // Grab the ID and TYPE of the Webhook
    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
    console.log("Webhook body:", evt.data);

    switch (eventType) {
      case "user.created":
        const {
          id: clerkID,
          created_at,
          email_addresses,
          username,
          image_url,
        } = evt.data;

        const user = await Users.findOne({ _id: clerkID });

        if (!user) {
          try {
            const newUser = await Users.create({
              _id: clerkID,
              createdAt: created_at,
              email: email_addresses[0]?.email_address,
              username,
              picture: image_url,
            });

            console.log({ newUser });

            return res.status(200).json({
              success: true,
              message: "User Created Successfully",
            });
          } catch (error) {
            console.log("Error while creating User:", error);
          }
        }

        break;

      case "user.deleted":
        try {
          const { id: clerkID } = evt.data;
          console.log("Object:", evt.data.object);
          await Users.findOneAndDelete({ _id: clerkID });
          console.log(`User with ID: ${clerkID} deleted successfully`);
        } catch (error) {
          console.log("Couldn't delete User", error);
        }
        break;

      case "user.updated":
        try {
          const {
            id: clerkID,
            username,
            email_addresses,
            image_url,
          } = evt.data;

          await Users.findOneAndUpdate(
            { _id: clerkID },
            {
              $set: {
                username,
                email: email_addresses[0]?.email_address,
                picture: image_url,
              },
            }
          );

          console.log(`User with ID: ${clerkID} updated successfully`);
        } catch (error) {
          console.log("Couldn't update User", error);
        }
        break;

      default:
        break;
    }

    return res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  }
);

export default webhookRouter;
