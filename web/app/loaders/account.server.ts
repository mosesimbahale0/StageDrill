import { json, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getCustomer, sessionLogout } from "~/sessions.server";
import { admin } from "~/firebase.server";

/**
 * Fetches all necessary data for the user account page.
 * - Authenticates the user via the session cookie.
 * - Fetches the full user record from Firebase Admin.
 * - Formats the user data to be sent to the client.
 * - Handles errors by logging the user out and redirecting.
 * @param {LoaderFunctionArgs} args - The Remix loader arguments, including the request object.
 * @returns A Promise that resolves to a JSON response with user data or a redirect.
 */
export const getAccountPageData = async ({ request }: LoaderFunctionArgs) => {
  try {
    // 1. Get the customer data from the session
    const customer = await getCustomer(request);
    if (!customer?.userId) {
      // If no user is found in the session, they are not logged in.
      // Redirect them to the authentication page.
      return redirect("/auth");
    }

    // 2. Fetch the full, secure user record using the Firebase Admin SDK.
    const userRecord = await admin.auth().getUser(customer.userId);

    // 3. Sanitize and format the user data to send to the client.
    //    Only include the fields necessary for the UI.
    const user = {
      uid: userRecord.uid,
      displayName: userRecord.displayName || null,
      email: userRecord.email || null,
      phoneNumber: userRecord.phoneNumber || null,
      photoURL: userRecord.photoURL || null,
      creationTime: new Date(
        userRecord.metadata.creationTime
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    return json({ user });
  } catch (error: any) {
    // 4. Handle any errors during the process.
    //    If the user ID from the session is invalid or another Firebase error occurs,
    //    it's safest to log the user out to force a fresh login.
    console.error("ACCOUNT_LOADER Error:", error);
    return sessionLogout(request);
  }
};

 