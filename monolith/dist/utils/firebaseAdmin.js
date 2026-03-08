// import admin from "firebase-admin";
// import dotenv from 'dotenv';
// import colors from "colors";
// colors.enable();
// dotenv.config();
// // console.log("Firebase Private Key:", process.env.FIREBASE_PRIVATE_KEY) fron.env
// console.log("Firebase Project ID:", process.env.FIREBASE_PROJECT_ID);
// const serviceAccount = {
//   type: "service_account",
//   project_id: "christianity-resources",
//   private_key_id: "37a438880c730e61443a3f31c54e60b9b2112f2f",
//   private_key:
//     "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQClK4ea6vvnc2sG\nuhSaE5B8EZzTeTZ+1OC0hLnnxGK4Fga/wVjcrSs5fmllgv58t01HrXi7ZKy23OYi\nWUqjRVD8NtGQ38htZYnKVn7HclBZGErAeE21CPjUVjwoXSmHL0bs0S4uKUpXxjmi\nXPfOJwExFqxR5qqoiNLy34MRl4IIao4gE5tPaZNEJRGHAj0Po++gvx3rd/h1JxB3\nx9xB6y0x9FGMUL0v2V371VlxBI4wVISKBOu0Z1X4bv/wXz3NP83rj/VG1TwoHBGv\ng0k54NkuGSG6aqJOeWHpWyNxlXb8K+c3El5vZRpqodjY3ITWB6yBmsN7eB9rXnzj\n0HeSUAldAgMBAAECggEAHv4rjGjCivwv3YvGOOEp7/X4GQB6NtNoNMdhAPnrUkKj\n0pCLxaDi5v9u9ILfkPRuVmBZMsSh2hBaSKC7riZgG2uH6GjteYWflO2lDXTIWeeC\ng1ovrqQ32NQzpplQpRK8esyHn1bVIeJKx0otn6vW/+iSvi2L4WMHPlath/wHhN94\nWMuvMWO056uLKdmb+U8NC3ku/+lgZ1t2+uVmIersShO3C1pDRmCcx9SPbdOK3mvk\n/Iu6PhxT5AvcD8FC6QVQCOnxgEeA9AazbWqdF2Sa00uOAfFGlcn38/AqQm29TWrI\noa7vuIMH6jIQUwc8KSGEkZzpkZQsWnNJXg1bMrCVCwKBgQDddEokFiFGUPReyPQL\nh+AuFsttzC/NyVNzHARvrjdBe2qxatASbWKs5QTfNvJxbMs6VQu0Ophdd7+C2yaG\n41+Y05tk+5aU91yHnCKiymwvcC0vbT7z1a3e8qu2OhM7eycf9n4lk5XcVULtrGlK\n7IxodaY0eCbPOtYQvrSZ0cfJCwKBgQC+74vjeMxD7aIShlUZxOeF6Ep3F2UN8EQa\noQuwydjonyY7J8seAuffLf9njl7p2yM25nJIpJt1W1A3XRNwE7lnJNd2gdPTF+ZN\nUXF7EAEsxIXyNTQ/S8l3aXgUcz5qXD5DnXl5VKimHOg1OqLE1Ak5jVW4JePY4icw\nXHe3koKINwKBgDmq0Ku4/406A4izN6nRBjW6RdsfsssZxBtTjmwup8DrjIsKz4gc\n5/cx5CTkQBn9RKa6AsQ6BfdA+aPvwYaaqwg3Al43jazZBUVjCTnvEGECCyIwhpYk\nbJSECOb5FI0GsteF7q+GUR4BLd6KaRjTpHSHPnKnXyPTpG7T2l+72xSlAoGBAJY0\nFDQqf2agtnMkQiY3hHsPNiVhvhms/aaFMpEs+Ppm2MiIkX1Wg9pKcTWiBoCp55X0\ny8rh03oLD5u+GOB+Y8gEb4vGrkDN+FqyyzcobAQvxb+4oxV4JVFPIyvTTTKWxlSi\nuUD9nH6xFuto6Us2Etu3l8t54zhnELU2yOcc1psZAoGAMAJZ077NyccG+C/w60t1\nZAHcDaig2bFzhTgsSAMx5FYPWBzQ0xVKEm9ezTvijtwEHKxL1gHjIjz482OSmVk6\nVKHCBT9ArSQMKl07yusdeg4c2TNTBdYFnc9fy/8JXMCZS7BTBcgj3N+RsmQkeoQy\nRDKK5/rWfEmK8eQ9kOsMp+4=\n-----END PRIVATE KEY-----\n",
//   client_email:
//     "firebase-adminsdk-j8xz2@christianity-resources.iam.gserviceaccount.com",
//   client_id: "105034794490023869880",
//   auth_uri: "https://accounts.google.com/o/oauth2/auth",
//   token_uri: "https://oauth2.googleapis.com/token",
//   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//   client_x509_cert_url:
//     "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-j8xz2%40christianity-resources.iam.gserviceaccount.com",
//   universe_domain: "googleapis.com",
// };
// let isInitialized = false;
// export const initFirebaseAdmin = () => {
//   if (!isInitialized) {
//     try {
//       admin.initializeApp({
//         credential: admin.credential.cert(
//           serviceAccount as unknown as admin.ServiceAccount
//         ),
//         databaseURL: "https://christianity-resources.firebaseio.com", // Replace with your actual URL
//       });
//       console.log(
//         colors.bgMagenta("✅ Firebase Admin initialized successfully")
//       );
//       isInitialized = true;
//     } catch (error) {
//       console.error("❌ Error initializing Firebase Admin:", error);
//     }
//   }
// };
// export default admin;
import admin from "firebase-admin";
import dotenv from "dotenv";
import colors from "colors";
// 1. Load environment variables FIRST
dotenv.config();
colors.enable();
// 2. Validate that the core environment variables are set
if (!process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_PRIVATE_KEY ||
    !process.env.FIREBASE_CLIENT_EMAIL) {
    console.error(colors.bgRed("❌ FATAL ERROR: Firebase environment variables (FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL) are not set."));
    throw new Error("One or more required Firebase environment variables are not set. Please check your .env file.");
}
// 3. Reconstruct the service account object from .env variables
//    (This is the block you were missing)
const serviceAccount = {
    type: process.env.FIREBASE_TYPE || "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID, // <-- Fixed typo from last time
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || "googleapis.com",
};
let isInitialized = false;
export const initFirebaseAdmin = () => {
    if (!isInitialized) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                // Make sure this database URL matches your project_id
                databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
            });
            console.log(colors.bgMagenta(`✅ Firebase Admin for [${process.env.FIREBASE_PROJECT_ID}] initialized successfully`));
            isInitialized = true;
        }
        catch (error) {
            console.error(colors.bgRed("❌ Error initializing Firebase Admin:"), error);
        }
    }
};
export default admin;
