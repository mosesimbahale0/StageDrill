import { Router } from "express";
import { verifyWebhook, handleEvent } from "../controllers/paypal.controllers.js";
const router = Router();
router.post("/", async (req, res) => {
    try {
        await verifyWebhook(req);
        await handleEvent(req.body);
        return res.sendStatus(200);
    }
    catch (err) {
        console.error("PayPal webhook error:", err);
        return res
            .status(err.status ?? 500)
            .send(err.message ?? "Internal Server Error");
    }
});
export default router;
