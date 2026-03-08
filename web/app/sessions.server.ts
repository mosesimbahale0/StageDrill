import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { admin } from "./firebase.server";

// --- Type definition for our Snackbar ---
export type SnackbarMessage = {
  message: string;
  type: "success" | "error" | "info" | "warning";
};

// --- Environment Variable Checks for Debugging ---
const sessionSecret = process.env.SESSION_SECRET;
const productionDomain = process.env.PRODUCTION_DOMAIN;

// Using a fallback for the secret in development is okay, but we should still check.
if (!sessionSecret) {
  console.error(
    "SESSION_SECRET is not set. Using a default, insecure key for development. Please set this environment variable for production."
  );
}

if (process.env.NODE_ENV === "production" && !productionDomain) {
  console.warn(
    "WARNING: PRODUCTION_DOMAIN is not set. The session cookie may not work correctly on your production domain."
  );
}

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "lax",
      secrets: [sessionSecret || "default-secret-key-for-development"],
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.PRODUCTION_DOMAIN
          : undefined,
      secure: process.env.NODE_ENV === "production",
    },
  });

/**
 * NEW: Gets a flashed snackbar message from the session and returns it,
 * along with the headers needed to clear it from the cookie.
 */
export async function getSnackbar(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  // The `get` method on a flashed value returns the value and removes it
  // from the session internally.
  const snackbar = session.get("snackbar") as SnackbarMessage | undefined;

  // We must commit the session to persist the removal of the flashed message.
  const headers = new Headers({
    "Set-Cookie": await commitSession(session),
  });

  return { snackbar, headers };
}

/**
 * Creates a session cookie from a Firebase ID token and stores user details.
 */
export async function sessionLogin(idToken: string, redirectTo: string) {
  console.log("SESSION_LOGIN: Function started.");
  const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 days

  try {
    console.log(
      "SESSION_LOGIN: Attempting to create session cookie with Firebase Admin..."
    );
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });
    console.log("SESSION_LOGIN: Firebase session cookie created successfully.");

    console.log(
      "SESSION_LOGIN: Verifying ID token with Firebase Admin to get claims..."
    );
    const decodedClaims = await admin.auth().verifyIdToken(idToken);
    const { uid, phone_number, email } = decodedClaims;
    console.log(`SESSION_LOGIN: Token verified for UID: ${uid}`);

    const customerId = phone_number || email || uid;
    console.log(`SESSION_LOGIN: Determined customerId: ${customerId}`);

    console.log("SESSION_LOGIN: Getting Remix session...");
    const session = await getSession();
    session.set("sessionCookie", sessionCookie);
    session.set("userId", uid);
    session.set("customerId", customerId);

    // ADDED: Flash a success message to the session for the snackbar.
    session.flash("snackbar", {
      message: "Successfully logged in.",
      type: "success",
    } as SnackbarMessage);

    console.log("SESSION_LOGIN: Remix session data set with snackbar message.");

    console.log(
      "SESSION_LOGIN: Committing Remix session to get Set-Cookie header..."
    );
    const cookie = await commitSession(session);
    console.log("SESSION_LOGIN: Session committed. Creating redirect.");

    return redirect(redirectTo, {
      headers: { "Set-Cookie": cookie },
    });
  } catch (error: any) {
    console.error(
      "SESSION_LOGIN: An error occurred in the sessionLogin process.",
      {
        errorMessage: error.message,
        errorCode: error.code,
        stack: error.stack,
      }
    );
    // Re-throw the error to be caught by the action function
    throw new Error(`Failed during session login: ${error.message}`);
  }
}

/**
 * TODO:
 * Gets the customer ID from the session.
 */
export async function getCustomerId(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionCookie = session.get("sessionCookie");

  if (!sessionCookie) {
    return null;
  }

  try {
    console.log("GET_CUSTOMER_ID: Verifying session cookie...");
    await admin.auth().verifySessionCookie(sessionCookie, true);
    const customerId = session.get("customerId") || null;
    console.log(
      `GET_CUSTOMER_ID: Verification successful. Customer ID is ${customerId}.`
    );
    return customerId;
  } catch (error) {
    console.warn(
      "GET_CUSTOMER_ID: Session cookie verification failed. It might be expired or invalid.",
      error
    );
    return null;
  }
}



/**
 * TODO:
 * Gets the customer Phone Number
 */




/**
 *  TODO:
 * Gets the customer Email Address
 */




/**
 * Gets all available customer information from the session.
 */
export async function getCustomer(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionCookie = session.get("sessionCookie");

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);
    const customerId = session.get("customerId");

    if (decodedClaims.uid !== session.get("userId") || !customerId) {
      console.warn(
        "GET_CUSTOMER: Data inconsistency between session cookie and Remix session."
      );
      return null;
    }

    return { userId: decodedClaims.uid, customerId };
  } catch (error) {
    console.warn("GET_CUSTOMER: Session cookie verification failed.", error);
    return null;
  }
}

/**
 * Logs the user out by revoking their session and destroying the cookie.
 */
export async function sessionLogout(
  request: Request,
  redirectTo: string = "/"
) {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionCookie = session.get("sessionCookie");
  console.log("LOGOUT: Starting logout process.");

  if (sessionCookie) {
    try {
      console.log(
        "LOGOUT: Verifying session cookie to get UID for token revocation."
      );
      const decodedClaims = await admin
        .auth()
        .verifySessionCookie(sessionCookie);
      console.log(
        `LOGOUT: Revoking refresh tokens for UID: ${decodedClaims.sub}`
      );
      await admin.auth().revokeRefreshTokens(decodedClaims.sub);
      console.log("LOGOUT: Refresh tokens revoked successfully.");
    } catch (error: any) {
      console.warn(
        "LOGOUT: Could not verify session cookie during logout. It may have already expired.",
        {
          errorMessage: error.message,
          errorCode: error.code,
        }
      );
    }
  } else {
    console.log("LOGOUT: No session cookie found to revoke.");
  }

  // ADDED: Flash a logout message to the session for the snackbar.
  session.flash("snackbar", {
    message: "You have been logged out.",
    type: "info",
  } as SnackbarMessage);

  console.log("LOGOUT: Committing session with snackbar and redirecting.");

  // MODIFIED: We use commitSession instead of destroySession here to ensure
  // the snackbar message is saved for the next request. The user is still
  // effectively logged out because their Firebase token was revoked.
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
