import admin from "firebase-admin";

// 1. Validate that the core environment variables are set
if (
  !process.env.FIREBASE_PRIVATE_KEY ||
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL
) {
  throw new Error(
    "One or more required Firebase environment variables (FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL) are not set. Please check your .env file."
  );
}

// 2. Reconstruct the service account object from .env variables
const serviceAccount = {
  // This line has been changed per your request
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

// 3. Cast the object to the type Firebase Admin expects
const typedServiceAccount = serviceAccount as admin.ServiceAccount;

// Initialize the app if it hasn't been already.
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(typedServiceAccount),
  });
  console.log("Firebase Admin SDK initialized successfully.");
}

// Export the initialized admin instance for use in other server-side files.
export { admin };
