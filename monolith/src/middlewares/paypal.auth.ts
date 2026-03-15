import fetch from "node-fetch";
import { Request } from "express";
import util from "util";

// Token cache object
let tokenCache = {
  token: "",
  expiresAt: 0,
};

async function getAccessToken(): Promise<string> {
  // Return cached token if valid
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  // Fetch new token
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID_SANDBOX}:${process.env.PAYPAL_CLIENT_SECRET_SANDBOX}`
  ).toString("base64");

  try {
    const response = await fetch(
      `${process.env.PAYPAL_API_URL_SANDBOX}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
        body: "grant_type=client_credentials",
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal token request failed: ${error}`);
    }

    const data = await response.json();
    tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 300) * 1000, // Expire 5 minutes early
    };

    console.log("[PayPal] New access token acquired");
    return tokenCache.token;

  } catch (error) {
    console.error("[PayPal] Failed to get access token:", error);
    throw error;
  }
}

export async function verifySignature(req: Request): Promise<boolean> {
  try {
    // Validate environment variables first
    if (!process.env.PAYPAL_WEBHOOK_ID_SANDBOX) {
      throw new Error("PAYPAL_WEBHOOK_ID_SANDBOX not configured");
    }

    // Get valid access token
    const accessToken = await getAccessToken();
    
    const headers = req.headers as Record<string, string>;
    const payload = {
      webhook_id: process.env.PAYPAL_WEBHOOK_ID_SANDBOX,
      webhook_event: req.body,
      transmission_id: headers["paypal-transmission-id"],
      transmission_time: headers["paypal-transmission-time"],
      cert_url: headers["paypal-cert-url"],
      transmission_sig: headers["paypal-transmission-sig"],
      auth_algo: headers["paypal-auth-algo"],
    };

    const verificationUrl = `${process.env.PAYPAL_API_URL_SANDBOX}/v1/notifications/verify-webhook-signature`;
    
    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "PayPal-Request-Id": headers["paypal-transmission-id"] || "none",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[PayPal] Verification failed:", error);
      return false;
    }

    const data = await response.json();
    return data.verification_status === "SUCCESS";

  } catch (error) {
    console.error("[PayPal] Webhook verification error:", error);
    return false;
  }
}