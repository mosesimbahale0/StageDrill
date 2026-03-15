import admin from "../utils/firebaseAdmin.js";
export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("Authorization header missing or badly formatted.");
        return res.status(401).json({ message: "Authentication required." });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        console.log("✅ User authenticated.");
        next();
    }
    catch (error) {
        console.error("❌ Token verification failed:", error);
        res.status(401).json({ message: "Invalid token." });
    }
};
