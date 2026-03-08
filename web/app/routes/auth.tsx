import Logo from "~/components/common/Logo";
import { useState, useEffect, useRef } from "react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher, Link } from "@remix-run/react";
import { sessionLogin, getCustomerId } from "~/sessions.server";

// --- Firebase Client Imports ---
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
} from "~/firebaseConfig.client";
import type { ConfirmationResult } from "firebase/auth";




export interface Country {
  name: string;
  code: string;
  flag: string;
}

export const countries: Country[] = [
  { name: "Afghanistan", code: "+93", flag: "🇦🇫" },
  { name: "Albania", code: "+355", flag: "🇦🇱" },
  { name: "Algeria", code: "+213", flag: "🇩🇿" },
  { name: "American Samoa", code: "+1-684", flag: "🇦🇸" },
  { name: "Andorra", code: "+376", flag: "🇦🇩" },
  { name: "Angola", code: "+244", flag: "🇦🇴" },
  { name: "Anguilla", code: "+1-264", flag: "🇦🇮" },
  { name: "Antarctica", code: "+672", flag: "🇦🇶" },
  { name: "Antigua and Barbuda", code: "+1-268", flag: "🇦🇬" },
  { name: "Argentina", code: "+54", flag: "🇦🇷" },
  { name: "Armenia", code: "+374", flag: "🇦🇲" },
  { name: "Aruba", code: "+297", flag: "🇦🇼" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "Austria", code: "+43", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "+994", flag: "🇦🇿" },
  { name: "Bahamas", code: "+1-242", flag: "🇧🇸" },
  { name: "Bahrain", code: "+973", flag: "🇧🇭" },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩" },
  { name: "Barbados", code: "+1-246", flag: "🇧🇧" },
  { name: "Belarus", code: "+375", flag: "🇧🇾" },
  { name: "Belgium", code: "+32", flag: "🇧🇪" },
  { name: "Belize", code: "+501", flag: "🇧🇿" },
  { name: "Benin", code: "+229", flag: "🇧🇯" },
  { name: "Bermuda", code: "+1-441", flag: "🇧🇲" },
  { name: "Bhutan", code: "+975", flag: "🇧🇹" },
  { name: "Bolivia", code: "+591", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", code: "+387", flag: "🇧🇦" },
  { name: "Botswana", code: "+267", flag: "🇧🇼" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "British Indian Ocean Territory", code: "+246", flag: "🇮🇴" },
  { name: "British Virgin Islands", code: "+1-284", flag: "🇻🇬" },
  { name: "Brunei", code: "+673", flag: "🇧🇳" },
  { name: "Bulgaria", code: "+359", flag: "🇧🇬" },
  { name: "Burkina Faso", code: "+226", flag: "🇧🇫" },
  { name: "Burundi", code: "+257", flag: "🇧🇮" },
  { name: "Cambodia", code: "+855", flag: "🇰🇭" },
  { name: "Cameroon", code: "+237", flag: "🇨🇲" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Cape Verde", code: "+238", flag: "🇨🇻" },
  { name: "Cayman Islands", code: "+1-345", flag: "🇰🇾" },
  { name: "Central African Republic", code: "+236", flag: "🇨🇫" },
  { name: "Chad", code: "+235", flag: "🇹🇩" },
  { name: "Chile", code: "+56", flag: "🇨🇱" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "Christmas Island", code: "+61", flag: "🇨🇽" },
  { name: "Cocos (Keeling) Islands", code: "+61", flag: "🇨🇨" },
  { name: "Colombia", code: "+57", flag: "🇨🇴" },
  { name: "Comoros", code: "+269", flag: "🇰🇲" },
  { name: "Congo", code: "+242", flag: "🇨🇬" },
  { name: "Cook Islands", code: "+682", flag: "🇨🇰" },
  { name: "Costa Rica", code: "+506", flag: "🇨🇷" },
  { name: "Croatia", code: "+385", flag: "🇭🇷" },
  { name: "Cuba", code: "+53", flag: "🇨🇺" },
  { name: "Curaçao", code: "+599", flag: "🇨🇼" },
  { name: "Cyprus", code: "+357", flag: "🇨🇾" },
  { name: "Czech Republic", code: "+420", flag: "🇨🇿" },
  { name: "Democratic Republic of the Congo", code: "+243", flag: "🇨🇩" },
  { name: "Denmark", code: "+45", flag: "🇩🇰" },
  { name: "Djibouti", code: "+253", flag: "🇩🇯" },
  { name: "Dominica", code: "+1-767", flag: "🇩🇲" },
  { name: "Dominican Republic", code: "+1-809", flag: "🇩🇴" },
  { name: "East Timor", code: "+670", flag: "🇹🇱" },
  { name: "Ecuador", code: "+593", flag: "🇪🇨" },
  { name: "Egypt", code: "+20", flag: "🇪🇬" },
  { name: "El Salvador", code: "+503", flag: "🇸🇻" },
  { name: "Equatorial Guinea", code: "+240", flag: "🇬🇶" },
  { name: "Eritrea", code: "+291", flag: "🇪🇷" },
  { name: "Estonia", code: "+372", flag: "🇪🇪" },
  { name: "Ethiopia", code: "+251", flag: "🇪🇹" },
  { name: "Falkland Islands", code: "+500", flag: "🇫🇰" },
  { name: "Faroe Islands", code: "+298", flag: "🇫🇴" },
  { name: "Fiji", code: "+679", flag: "🇫🇯" },
  { name: "Finland", code: "+358", flag: "🇫🇮" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "French Polynesia", code: "+689", flag: "🇵🇫" },
  { name: "Gabon", code: "+241", flag: "🇬🇦" },
  { name: "Gambia", code: "+220", flag: "🇬🇲" },
  { name: "Georgia", code: "+995", flag: "🇬🇪" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "Ghana", code: "+233", flag: "🇬🇭" },
  { name: "Gibraltar", code: "+350", flag: "🇬🇮" },
  { name: "Greece", code: "+30", flag: "🇬🇷" },
  { name: "Greenland", code: "+299", flag: "🇬🇱" },
  { name: "Grenada", code: "+1-473", flag: "🇬🇩" },
  { name: "Guam", code: "+1-671", flag: "🇬🇺" },
  { name: "Guatemala", code: "+502", flag: "🇬🇹" },
  { name: "Guernsey", code: "+44-1481", flag: "🇬🇬" },
  { name: "Guinea", code: "+224", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "+245", flag: "🇬🇼" },
  { name: "Guyana", code: "+592", flag: "🇬🇾" },
  { name: "Haiti", code: "+509", flag: "🇭🇹" },
  { name: "Honduras", code: "+504", flag: "🇭🇳" },
  { name: "Hong Kong", code: "+852", flag: "🇭🇰" },
  { name: "Hungary", code: "+36", flag: "🇭🇺" },
  { name: "Iceland", code: "+354", flag: "🇮🇸" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "Indonesia", code: "+62", flag: "🇮🇩" },
  { name: "Iran", code: "+98", flag: "🇮🇷" },
  { name: "Iraq", code: "+964", flag: "🇮🇶" },
  { name: "Ireland", code: "+353", flag: "🇮🇪" },
  { name: "Isle of Man", code: "+44-1624", flag: "🇮🇲" },
  { name: "Israel", code: "+972", flag: "🇮🇱" },
  { name: "Italy", code: "+39", flag: "🇮🇹" },
  { name: "Ivory Coast", code: "+225", flag: "🇨🇮" },
  { name: "Jamaica", code: "+1-876", flag: "🇯🇲" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "Jersey", code: "+44-1534", flag: "🇯🇪" },
  { name: "Jordan", code: "+962", flag: "🇯🇴" },
  { name: "Kazakhstan", code: "+7", flag: "🇰🇿" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "Kiribati", code: "+686", flag: "🇰🇮" },
  { name: "Kosovo", code: "+383", flag: "🇽🇰" },
  { name: "Kuwait", code: "+965", flag: "🇰🇼" },
  { name: "Kyrgyzstan", code: "+996", flag: "🇰🇬" },
  { name: "Laos", code: "+856", flag: "🇱🇦" },
  { name: "Latvia", code: "+371", flag: "🇱🇻" },
  { name: "Lebanon", code: "+961", flag: "🇱🇧" },
  { name: "Lesotho", code: "+266", flag: "🇱🇸" },
  { name: "Liberia", code: "+231", flag: "🇱🇷" },
  { name: "Libya", code: "+218", flag: "🇱🇾" },
  { name: "Liechtenstein", code: "+423", flag: "🇱🇮" },
  { name: "Lithuania", code: "+370", flag: "🇱🇹" },
  { name: "Luxembourg", code: "+352", flag: "🇱🇺" },
  { name: "Macau", code: "+853", flag: "🇲🇴" },
  { name: "Macedonia", code: "+389", flag: "🇲🇰" },
  { name: "Madagascar", code: "+261", flag: "🇲🇬" },
  { name: "Malawi", code: "+265", flag: "🇲🇼" },
  { name: "Malaysia", code: "+60", flag: "🇲🇾" },
  { name: "Maldives", code: "+960", flag: "🇲🇻" },
  { name: "Mali", code: "+223", flag: "🇲🇱" },
  { name: "Malta", code: "+356", flag: "🇲🇹" },
  { name: "Marshall Islands", code: "+692", flag: "🇲🇭" },
  { name: "Mauritania", code: "+222", flag: "🇲🇷" },
  { name: "Mauritius", code: "+230", flag: "🇲🇺" },
  { name: "Mayotte", code: "+262", flag: "YT" },
  { name: "Mexico", code: "+52", flag: "🇲🇽" },
  { name: "Micronesia", code: "+691", flag: "🇫🇲" },
  { name: "Moldova", code: "+373", flag: "🇲🇩" },
  { name: "Monaco", code: "+377", flag: "🇲🇨" },
  { name: "Mongolia", code: "+976", flag: "🇲🇳" },
  { name: "Montenegro", code: "+382", flag: "🇲🇪" },
  { name: "Montserrat", code: "+1-664", flag: "🇲🇸" },
  { name: "Morocco", code: "+212", flag: "🇲🇦" },
  { name: "Mozambique", code: "+258", flag: "🇲🇿" },
  { name: "Myanmar", code: "+95", flag: "🇲🇲" },
  { name: "Namibia", code: "+264", flag: "🇳🇦" },
  { name: "Nauru", code: "+674", flag: "🇳🇷" },
  { name: "Nepal", code: "+977", flag: "🇳🇵" },
  { name: "Netherlands", code: "+31", flag: "🇳🇱" },
  { name: "Netherlands Antilles", code: "+599", flag: "🇦🇳" },
  { name: "New Caledonia", code: "+687", flag: "🇳🇨" },
  { name: "New Zealand", code: "+64", flag: "🇳🇿" },
  { name: "Nicaragua", code: "+505", flag: "🇳🇮" },
  { name: "Niger", code: "+227", flag: "🇳🇪" },
  { name: "Nigeria", code: "+234", flag: "🇳🇳" },
  { name: "Niue", code: "+683", flag: "🇳🇺" },
  { name: "North Korea", code: "+850", flag: "🇰🇵" },
  { name: "Northern Mariana Islands", code: "+1-670", flag: "🇲🇵" },
  { name: "Norway", code: "+47", flag: "🇳🇴" },
  { name: "Oman", code: "+968", flag: "🇴🇲" },
  { name: "Pakistan", code: "+92", flag: "🇵🇰" },
  { name: "Palau", code: "+680", flag: "🇵🇼" },
  { name: "Palestine", code: "+970", flag: "🇵🇸" },
  { name: "Panama", code: "+507", flag: "🇵🇦" },
  { name: "Papua New Guinea", code: "+675", flag: "🇵🇬" },
  { name: "Paraguay", code: "+595", flag: "🇵🇾" },
  { name: "Peru", code: "+51", flag: "🇵🇪" },
  { name: "Philippines", code: "+63", flag: "🇵🇭" },
  { name: "Pitcairn", code: "+64", flag: "🇵🇳" },
  { name: "Poland", code: "+48", flag: "🇵🇱" },
  { name: "Portugal", code: "+351", flag: "🇵🇹" },
  { name: "Puerto Rico", code: "+1-787", flag: "🇵🇷" },
  { name: "Qatar", code: "+974", flag: "🇶🇦" },
  { name: "Republic of the Congo", code: "+242", flag: "🇨🇬" },
  { name: "Reunion", code: "+262", flag: "🇷🇪" },
  { name: "Romania", code: "+40", flag: "🇷🇴" },
  { name: "Russia", code: "+7", flag: "🇷🇺" },
  { name: "Rwanda", code: "+250", flag: "🇷🇼" },
  { name: "Saint Barthelemy", code: "+590", flag: "🇧🇱" },
  { name: "Saint Helena", code: "+290", flag: "🇸🇭" },
  { name: "Saint Kitts and Nevis", code: "+1-869", flag: "🇰🇳" },
  { name: "Saint Lucia", code: "+1-758", flag: "🇱🇨" },
  { name: "Saint Martin", code: "+590", flag: "🇲🇫" },
  { name: "Saint Pierre and Miquelon", code: "+508", flag: "🇵🇲" },
  { name: "Saint Vincent and the Grenadines", code: "+1-784", flag: "🇻🇨" },
  { name: "Samoa", code: "+685", flag: "🇼🇸" },
  { name: "San Marino", code: "+378", flag: "🇸🇲" },
  { name: "Sao Tome and Principe", code: "+239", flag: "🇸🇹" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { name: "Senegal", code: "+221", flag: "🇸🇳" },
  { name: "Serbia", code: "+381", flag: "🇷🇸" },
  { name: "Seychelles", code: "+248", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "+232", flag: "🇸🇱" },
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "Sint Maarten", code: "+1-721", flag: "🇸🇽" },
  { name: "Slovakia", code: "+421", flag: "🇸🇰" },
  { name: "Slovenia", code: "+386", flag: "🇸🇮" },
  { name: "Solomon Islands", code: "+677", flag: "🇸🇧" },
  { name: "Somalia", code: "+252", flag: "🇸🇴" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "South Korea", code: "+82", flag: "🇰🇷" },
  { name: "South Sudan", code: "+211", flag: "🇸🇸" },
  { name: "Spain", code: "+34", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "+94", flag: "🇱🇰" },
  { name: "Sudan", code: "+249", flag: "🇸🇩" },
  { name: "Suriname", code: "+597", flag: "🇸🇷" },
  { name: "Svalbard and Jan Mayen", code: "+47", flag: "🇸🇯" },
  { name: "Swaziland", code: "+268", flag: "🇸🇿" },
  { name: "Sweden", code: "+46", flag: "🇸🇪" },
  { name: "Switzerland", code: "+41", flag: "🇨🇭" },
  { name: "Syria", code: "+963", flag: "🇸🇾" },
  { name: "Taiwan", code: "+886", flag: "🇹🇼" },
  { name: "Tajikistan", code: "+992", flag: "🇹🇯" },
  { name: "Tanzania", code: "+255", flag: "🇹🇿" },
  { name: "Thailand", code: "+66", flag: "🇹🇭" },
  { name: "Togo", code: "+228", flag: "🇹🇬" },
  { name: "Tokelau", code: "+690", flag: "🇹🇰" },
  { name: "Tonga", code: "+676", flag: "🇹🇴" },
  { name: "Trinidad and Tobago", code: "+1-868", flag: "🇹🇹" },
  { name: "Tunisia", code: "+216", flag: "🇹🇳" },
  { name: "Turkey", code: "+90", flag: "🇹🇷" },
  { name: "Turkmenistan", code: "+993", flag: "🇹🇲" },
  { name: "Turks and Caicos Islands", code: "+1-649", flag: "🇹🇨" },
  { name: "Tuvalu", code: "+688", flag: "🇹🇻" },
  { name: "U.S. Virgin Islands", code: "+1-340", flag: "🇻🇮" },
  { name: "Uganda", code: "+256", flag: "🇺🇬" },
  { name: "Ukraine", code: "+380", flag: "🇺🇦" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "Uruguay", code: "+598", flag: "🇺🇾" },
  { name: "Uzbekistan", code: "+998", flag: "🇺🇿" },
  { name: "Vanuatu", code: "+678", flag: "🇻🇺" },
  { name: "Vatican", code: "+379", flag: "🇻🇦" },
  { name: "Venezuela", code: "+58", flag: "🇻🇪" },
  { name: "Vietnam", code: "+84", flag: "🇻🇳" },
  { name: "Wallis and Futuna", code: "+681", flag: "🇼🇫" },
  { name: "Western Sahara", code: "+212", flag: "🇪🇭" },
  { name: "Yemen", code: "+967", flag: "🇾🇪" },
  { name: "Zambia", code: "+260", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "+263", flag: "🇿🇼" },
];



// --- Metdata, Loader, Action ---

export const meta: MetaFunction = () => [
  { title: "WateRefil • Sign In or Sign Up" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const customerId = await getCustomerId(request);
  if (customerId) {
    // If user is already logged in, redirect them to their account page.
    return redirect("/account");
  }
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const idToken = formData.get("idToken") as string;

  if (!idToken) {
    return json({ error: "An ID token must be provided." }, { status: 400 });
  }

  // The sessionLogin function handles creating the secure cookie
  // regardless of the sign-in method.
  return await sessionLogin(idToken, "/account");
};

// --- Main Auth Page Component ---

export default function AuthRoute() {
  const fetcher = useFetcher();
  // Find Kenya or default to the first country
  const kenyaDefault =
    countries.find((c) => c.name === "Kenya") || countries[0];

  // State for phone auth
  const [localPhoneNumber, setLocalPhoneNumber] = useState("");
  const [confirmPhoneNumber, setConfirmPhoneNumber] = useState(""); // New state for confirmation
  const [selectedCountry, setSelectedCountry] = useState<Country>(kenyaDefault);
  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // General state
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const isSubmitting = fetcher.state !== "idle";

  // Refs for reCAPTCHA and dropdown logic
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize reCAPTCHA
  useEffect(() => {
    if (
      isMounted &&
      recaptchaContainerRef.current &&
      !recaptchaVerifierRef.current
    ) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        recaptchaContainerRef.current,
        { size: "invisible" }
      );
      recaptchaVerifierRef.current.render().catch((err) => {
        console.error("reCAPTCHA render error:", err);
        setError("Could not initialize security verification.");
      });
    }
  }, [isMounted]);

  // Effect to handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Phone Sign-In Handlers ---
  const handleSendCode = async () => {
    setError(null);
    setInfo("Sending code...");
    if (!recaptchaVerifierRef.current) {
      return setError("Security check not ready. Please wait and try again.");
    }

    // Validate matching numbers
    if (localPhoneNumber !== confirmPhoneNumber) {
      setInfo(null);
      return setError("Phone numbers do not match. Please check and try again.");
    }

    // Validate local phone number (simple digit check)
    if (!localPhoneNumber || !/^\d{7,15}$/.test(localPhoneNumber)) {
      setInfo(null);
      return setError("Please enter a valid phone number (7-15 digits).");
    }

    const fullPhoneNumber = selectedCountry.code + localPhoneNumber;

    try {
      const result = await signInWithPhoneNumber(
        auth,
        fullPhoneNumber,
        recaptchaVerifierRef.current
      );
      setConfirmationResult(result);
      setInfo(`A verification code has been sent to ${fullPhoneNumber}.`);
    } catch (err: any) {
      setError(`Failed to send code: ${err.message}`);
      setInfo(null);
    }
  };

  const handleVerifyCode = async () => {
    setError(null);
    if (!confirmationResult) return setError("Please request a code first.");
    if (!verificationCode || verificationCode.length !== 6) {
      return setError("Please enter the 6-digit code you received.");
    }
    try {
      const userCredential = await confirmationResult.confirm(verificationCode);
      const idToken = await userCredential.user.getIdToken();
      fetcher.submit({ idToken }, { method: "POST" });
    } catch (err: any) {
      setError(`Verification failed: ${err.message}`);
    }
  };

  // --- Google Sign-In Handler ---
  const handleGoogleSignIn = async () => {
    setError(null);
    setInfo(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();
      fetcher.submit({ idToken }, { method: "POST" });
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(`Google sign-in failed: ${err.message}`);
      }
    }
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return <div className="bg-primary min-h-screen"></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary text-text font-sans p-4">
      <div id="recaptcha-container" ref={recaptchaContainerRef}></div>

      <div className="bg-secondary rounded-2xl shadow-lg p-8 sm:p-10 w-full max-w-md flex flex-col items-center gap-6 border border-tertiary">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <Logo />
          <p className="text-text2 text-sm sm:text-base">
            Sign In or Create an Account
          </p>
        </div>

        {/* Info/Error Messages */}
        {error && (
          <p className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-lg w-full border border-red-200">
            {error}
          </p>
        )}
        {info && !error && (
          <p className="text-sm text-center text-blue-600 bg-blue-100 p-3 rounded-lg w-full border border-blue-200">
            {info}
          </p>
        )}

        {/* Phone Auth Forms */}
        <div className="w-full">
          {!confirmationResult ? (
            <div className="w-full flex flex-col gap-4">

              {/* --- Country Selector (Row 1) --- */}
              <div className="flex flex-col gap-2 relative z-20">
                <label className="text-sm font-medium text-text2">
                  Country
                </label>
                <div className="relative">
                  <button
                    ref={dropdownButtonRef}
                    type="button"
                    onClick={() => setIsDropdownExpanded(!isDropdownExpanded)}
                    className="w-full px-5 py-3 text-left bg-primary border border-tertiary rounded-full focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{selectedCountry.flag}</span>
                      <span className="text-text1">{selectedCountry.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text2">
                      <span>{selectedCountry.code}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isDropdownExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* --- Dropdown Menu --- */}
                  {isDropdownExpanded && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-30 w-full max-h-60 overflow-y-auto bg-secondary rounded-lg shadow-xl border border-tertiary mt-2"
                    >
                      {countries.map((country) => (
                        <div
                          key={country.name}
                          onClick={() => {
                            setSelectedCountry(country);
                            setIsDropdownExpanded(false);
                          }}
                          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-tertiary transition-colors"
                        >
                          <span className="text-xl">{country.flag}</span>
                          <span className="text-sm text-text1 flex-1">
                            {country.name}
                          </span>
                          <span className="text-sm text-text2">
                            {country.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* --- Phone Number (Row 2) --- */}
              <div className="flex flex-col gap-2 relative z-10">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-text2"
                >
                  Phone number
                </label>

                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-text2 text-sm pointer-events-none">
                    {selectedCountry.code}
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    value={localPhoneNumber}
                    onChange={(e) =>
                      setLocalPhoneNumber(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="712 345 678"
                    className="w-full pl-16 pr-5 py-3 text-text bg-primary border border-tertiary rounded-full focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
                    aria-label="Phone number"
                  />
                </div>
              </div>

              {/* --- Confirm Phone Number (Row 3) --- */}
              <div className="flex flex-col gap-2 relative z-0">
                <label
                  htmlFor="confirm-phone"
                  className="text-sm font-medium text-text2"
                >
                  Confirm Phone number
                </label>

                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-text2 text-sm pointer-events-none">
                    {selectedCountry.code}
                  </span>
                  <input
                    id="confirm-phone"
                    type="tel"
                    value={confirmPhoneNumber}
                    onChange={(e) =>
                      setConfirmPhoneNumber(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="712 345 678"
                    className="w-full pl-16 pr-5 py-3 text-text bg-primary border border-tertiary rounded-full focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
                    aria-label="Confirm phone number"
                  />
                </div>
              </div>

              <button
                onClick={handleSendCode}
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-complementary h-12 px-8 flex justify-center items-center rounded-full text-sm font-bold text-buttontext transition-colors duration-300 disabled:opacity-50 shadow-lg mt-2"
              >
                {isSubmitting ? "Sending..." : "Send Verification Code"}
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="code"
                  className="text-sm font-medium text-text2"
                >
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-5 py-3 text-text bg-primary border border-tertiary rounded-full focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
                />
              </div>
              <button
                onClick={handleVerifyCode}
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-complementary h-12 px-8 flex justify-center items-center rounded-full text-sm font-bold text-buttontext transition-colors duration-300 disabled:opacity-50 shadow-lg"
              >
                {isSubmitting ? "Verifying..." : "Verify & Sign In"}
              </button>

              <button
                onClick={() => {
                  setConfirmationResult(null);
                  setInfo(null);
                  setError(null);
                }}
                className="text-xs text-text2 hover:text-accent underline text-center"
              >
                Change Phone Number
              </button>
            </div>
          )}
        </div>

        <div className=" text-xs">
          <div className=" flex flex-wrap lg:flex-row gap-2 px-2 py-2 text-text2  text-center ">
            By tapping "Send Verification Code", you consent to receive an SMS for verification. Standard message and data rates may apply. You also agree to our
            <Link
              to="/terms-and-conditions"
              className="block   hover:underline text-complementary"
            >
              Terms of Service
            </Link>
            and acknowledge the
            <Link
              to="/privacy-policy"
              className="block   hover:underline  text-complementary"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
