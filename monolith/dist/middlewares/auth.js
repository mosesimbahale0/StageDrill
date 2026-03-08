// ---------------------------------------------------------------------------------------
import admin from "../utils/firebaseAdmin.js";
export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    // Read the custom header (headers are lowercased by Express/Node)
    const authType = req.headers["x-auth-type"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("Authorization header missing or badly formatted.");
        return res.status(401).json({ message: "Authentication required." });
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    // Check the custom header to decide verification logic
    if (authType === "Session") {
        // This is a request from the Remix web app
        try {
            console.log("Attempting session cookie verification (via X-Auth-Type)...");
            decodedToken = await admin.auth().verifySessionCookie(token, true);
            req.user = decodedToken;
            console.log("✅ User authenticated via session cookie.");
            return next();
        }
        catch (cookieError) {
            // If it fails, it's a hard fail. No retry.
            console.error("❌ Session cookie verification failed:", cookieError);
            return res.status(401).json({ message: "Invalid or expired session." });
        }
    }
    else if (authType === "Token") {
        // This is a request from the Android app (or any ID token client)
        try {
            console.log("Attempting ID token verification (via X-Auth-Type)...");
            decodedToken = await admin.auth().verifyIdToken(token);
            req.user = decodedToken;
            console.log("✅ User authenticated via ID token.");
            return next();
        }
        catch (idTokenError) {
            // If it fails, it's a hard fail.
            console.error("❌ ID token verification failed:", idTokenError);
            return res.status(401).json({ message: "Invalid or expired token." });
        }
    }
    else {
        // Unknown or missing auth type
        console.error(`❌ Authentication failed: Missing or invalid X-Auth-Type header. Received: ${authType}`);
        return res.status(400).json({
            message: `Invalid request: Missing or unknown X-Auth-Type header. Expected 'Session' or 'Token'.`,
        });
    }
};
