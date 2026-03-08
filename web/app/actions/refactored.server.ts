import type { ActionFunctionArgs } from "@remix-run/node";

export async function updateNameAction({ request }: ActionFunctionArgs) {
  console.log("    [action-helper] updateNameAction: Processing...");
  const formData = await request.formData();
  const name = formData.get("name");
  console.log(`    [action-helper] updateNameAction: Validating name: '${name}'`);

  if (typeof name !== "string" || name.trim().length === 0) {
    console.warn("    [action-helper] updateNameAction: Validation FAILED.");
    return { formId: "updateName", error: "Name cannot be empty." };
  }

  console.log("    [action-helper] updateNameAction: Validation PASSED.");
  return { formId: "updateName", message: "Name updated successfully!" };
}

export async function changePasswordAction({ request }: ActionFunctionArgs) {
  console.log("    [action-helper] changePasswordAction: Processing...");
  const formData = await request.formData();
  const newPassword = formData.get("newPassword");

  if (typeof newPassword !== "string" || newPassword.length < 8) {
    console.warn("    [action-helper] changePasswordAction: Validation FAILED.");
    return {
      formId: "changePassword",
      error: "New password must be at least 8 characters.",
    };
  }

  console.log("    [action-helper] changePasswordAction: Validation PASSED.");
  return { formId: "changePassword", message: "Password changed successfully!" };
}