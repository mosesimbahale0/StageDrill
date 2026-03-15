/**
 * @file app/routes/account.tsx
 * @description User account and profile page, redesigned for a modern, visually appealing experience
 * following Google's Material Design 3 guidelines.
 */
import type {
  MetaFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { getCustomer, sessionLogout } from "~/sessions.server";
import { admin } from "~/firebase.server";
import { Fingerprint, Mail, Phone, LogOut } from "lucide-react";
import Sidebar from "~/components/Sidebar";

export const meta: MetaFunction = () => {
  return [
    { title: "WateRefil • My Account" },
    { name: "description", content: "View and manage your account details." },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const customer = await getCustomer(request);
    if (!customer?.userId) {
      return redirect("/auth");
    }

    const userRecord = await admin.auth().getUser(customer.userId);

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
    console.error("ACCOUNT_LOADER Error:", error);
    return sessionLogout(request);
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return sessionLogout(request, "/auth");
};

// --- UI Components ---

const InfoRow = ({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string | null | undefined;
  Icon: React.ElementType;
}) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4 border-t border-tertiary py-4">
      <Icon
        className="h-6 w-6 text-accent flex-shrink-0 mt-1"
        strokeWidth={1.5}
      />
      <div className="flex-1">
        <p className="text-sm text-text2">{label}</p>
        <p className="text-md font-semibold text-text1 break-words">{value}</p>
      </div>
    </div>
  );
};

const ProfileCard = ({ user }: { user: any }) => (
  <div className="bg-secondary rounded-2xl shadow-lg border border-tertiary p-6 sm:p-8 flex flex-col h-full w-full">
    <div className="flex flex-col items-center flex-grow text-center">
      {user.photoURL ? (
        <img
          src={user.photoURL}
          alt="Profile"
          className="w-32 h-32 rounded-full mb-4 border-4 border-accent/50"
        />
      ) : (
        <div className="w-32 h-32 rounded-full bg-tertiary mb-4 flex items-center justify-center border-4 border-accent/50">
          <span className="text-5xl text-text1 font-bold">
            {user.displayName?.charAt(0) || user.email?.charAt(0) || "A"}
          </span>
        </div>
      )}

      <h1 className="text-3xl font-bold text-text1 break-words">
        {user.displayName || "Valued Customer"}
      </h1>
      <p className="text-sm text-text2 mt-1">
        Member since {user.creationTime}
      </p>
    </div>

    <div className="w-full mt-8">
      <InfoRow label="User ID" value={user.uid} Icon={Fingerprint} />
      <InfoRow label="Email Address" value={user.email} Icon={Mail} />
      <InfoRow label="Phone Number" value={user.phoneNumber} Icon={Phone} />
    </div>

    <div className="mt-8 w-full">
      <Form method="post">
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-red-500/10 text-red-500 border-2 border-red-500 py-3 px-8 rounded-full font-bold transition-all duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </Form>
    </div>
  </div>
);

// --- Page Component ---

export default function AccountPage() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <Sidebar />
      <main className="min-h-screen bg-primary p-4 py-32 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 w-full flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold text-text1">My Account</h1>
            <p className="text-sm text-text2 mt-1">
              Manage your profile information and session.
            </p>
          </header>
          <div className="max-w-md mx-auto">
            <ProfileCard user={user} />
          </div>
        </div>
      </main>
    </>
  );
}
