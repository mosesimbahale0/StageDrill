import { verifySignature } from "../middlewares/paypal.auth.js";
import { processWebhook } from "../resolvers/paypal.js";
export async function verifyWebhook(req) {
    const valid = await verifySignature(req);
    if (!valid) {
        throw { status: 400, message: "Invalid PayPal webhook signature" };
    }
}
export async function handleEvent(event) {
    await processWebhook(event);
}
