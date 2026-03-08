import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";

// 1. Import your session functions
import { getSession, commitSession, SnackbarMessage } from "~/sessions.server"; // Adjust path if needed

/**
 * The action function handles form submissions on the server.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  // Get the form data to see which button was clicked
  const formData = await request.formData();
  const actionType = formData.get("_action");

  // Get the current session from the user's cookie
  const session = await getSession(request.headers.get("Cookie"));

  // 2. Set a different snackbar message based on the action
  switch (actionType) {
    case "success":
      session.flash("snackbar", {
        message: "Great! The success action worked. ✅",
        type: "success",
      } as SnackbarMessage);
      break;

    case "error":
      session.flash("snackbar", {
        message: "Oops! Something went wrong. ❌",
        type: "error",
      } as SnackbarMessage);
      break;
      
    case "info":
      session.flash("snackbar", {
        message: "Just so you know, this is an info message. ℹ️",
        type: "info",
      } as SnackbarMessage);
      break;

    default:
      session.flash("snackbar", {
        message: "That was an unknown action. 🤔",
        type: "warning",
      } as SnackbarMessage);
      break;
  }

  // 3. Redirect back to the demo page.
  // We commit the session to save the flashed message in the user's cookie.
  return redirect("/demo", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};


/**
 * The component renders the UI with buttons to trigger the action.
 */
export default function SnackbarDemoRoute() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Snackbar Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Click a button to trigger a server action. The action will redirect you back here and flash a message, which is then displayed by the Snackbar in your root layout.
        </p>
        
        {/* The Form component submits to our action function */}
        <Form method="post" className="space-y-4">
          <button
            type="submit"
            name="_action"
            value="success"
            className="w-full px-4 py-3 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            Trigger Success Toast
          </button>
          
          <button
            type="submit"
            name="_action"
            value="info"
            className="w-full px-4 py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Trigger Info Toast
          </button>

          <button
            type="submit"
            name="_action"
            value="error"
            className="w-full px-4 py-3 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Trigger Error Toast
          </button>
        </Form>
      </div>
    </div>
  );
}