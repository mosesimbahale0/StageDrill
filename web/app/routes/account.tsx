import type {
  MetaFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";
import { getCustomer, sessionLogout } from "~/sessions.server";
import { admin } from "~/firebase.server";
import { useMemo, useState, useRef, useEffect } from "react"; // <-- Added useState, useRef, useEffect
import {
  DollarSign,
  Package,
  BadgePercent,
  Star,
  MapPin,
  Link as LinkIcon,
  Facebook,
  Instagram,
  Linkedin,
  MessageSquare,
  Edit2, // Added for Edit icon
  Trash2, // Added for Delete icon
} from "lucide-react";

// Import shared UI components.
// It's great you're doing this!
import Navbar from "~/components/common/Navbar";
import Footer from "~/components/common/Footer";

import {
  GET_MERCHANT_BY_PHONE,
  GET_PRODUCTS_BY_SELLER_QUERY,
} from "~/graphql/accountQueries";

// —————————————————————————————————————————————————————————————————————————————————
// --- TypeScript Types ---
// Defining types makes your code safer and much more intuitive.
// —————————————————————————————————————————————————————————————————————————————————

/**
 * Basic user data from Firebase Auth, passed to the client.
 */
type AuthUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  creationTime: string;
};

/**
 * Shape of the Merchant/Customer profile from your GraphQL API.
 */
type MerchantProfile = {
  _id: string;
  _kyc_id: string;
  _uid: string;
  user_name: string;
  average_rating: number;
  cover_photo: string | null;
  phone_number: string;
  pinterest: string | null;
  profile_picture: string | null;
  permanent_address: string | null;
  linkedin: string | null;
  likes: number; // Assuming this is a number
  kyc_verified: boolean;
  is_verified: boolean;
  is_moderated: boolean;
  is_blocked: boolean;
  is_active: boolean;
  instagram: string | null;
  facebook: string | null;
  createdAt: string; // Or Date?
  bio: string | null;
  review_count: number;
};

/**
 * Shape of a single Product listing from your GraphQL API.
 */
type ProductListing = {
  _id: string;
  product_name: string;
  product_cover: string | null;
  current_bid: number;
  auction_end: string; // ISO date string
  is_sold: boolean;
  category: string;
};

// Prop types for your helper components
type StatusBadgeProps = { product: ProductListing };
type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
};
type StarRatingProps = {
  rating: number;
  size?: "sm" | "md" | "lg";
};
type SocialLinkProps = {
  href: string | null | undefined;
  icon: React.ReactNode;
  label: string;
};
type MerchantProfileHeaderProps = { merchant: MerchantProfile };
type MerchantListingsProps = { products: ProductListing[] };

// —————————————————————————————————————————————————————————————————————————————————
// --- GraphQL Setup ---
// —————————————————————————————————————————————————————————————————————————————————

// Ensure this URL is correctly set in your environment variables
const GRAPHQL_URL = process.env.GRAPHQL_URL || "http://localhost:4000/graphql";

/**
 * A reusable, typed function to fetch data from your GraphQL API.
 * @param query The GraphQL query string
 * @param variables An object of variables for the query
 * @returns The `data` object from the GraphQL response
 */
async function fetchGraphQL(query: string, variables: Record<string, any>) {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL Network Error: ${response.statusText}`);
  }

  const result = await response.json();
  if (result.errors) {
    console.error("GraphQL Errors:", result.errors);
    // Don't throw an error for "not found"
    if (result.errors[0].message.includes("not found")) {
      return { data: null };
    }
    throw new Error(`GraphQL Query Error: ${result.errors[0].message}`);
  }
  return result.data;
}

// —————————————————————————————————————————————————————————————————————————————————
// --- Route Functions (meta, loader, action) ---
// —————————————————————————————————————————————————————————————————————————————————

export const meta: MetaFunction = () => {
  return [
    { title: "WateRefil • My Account" },
    { name: "description", content: "View and manage your account details." },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // 1. Get customer session
  let customer;
  try {
    customer = await getCustomer(request);
    if (!customer?.userId) {
      return redirect("/auth");
    }

    // 2. Get Firebase Auth User
    const userRecord = await admin.auth().getUser(customer.userId);
    const user: AuthUser = {
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

    // 3. Get Merchant Profile & Products from GraphQL (if phone number exists)
    if (!user.phoneNumber) {
      // User has no phone number, so they can't be a merchant.
      return json({
        user,
        merchant: null,
        products: [],
        error: "User has no phone number.",
      });
    }

    const [profileData, productsData] = await Promise.all([
      fetchGraphQL(GET_MERCHANT_BY_PHONE, { phoneNumber: user.phoneNumber }),
      fetchGraphQL(GET_PRODUCTS_BY_SELLER_QUERY, {
        seller: user.phoneNumber,
      }),
    ]);

    const merchant: MerchantProfile | null =
      profileData?.customerByPhoneNumber || null;
    const products: ProductListing[] = productsData?.productsBySeller || [];

    return json({ user, merchant, products, error: null });
  } catch (error: any) {
    console.error("ACCOUNT_LOADER Error:", error.message);
    // If getting Firebase user fails, log out.
    if (customer?.userId) {
      // Error happened after getting UID, probably GraphQL or Firebase Admin
      return json({
        user: null,
        merchant: null,
        products: [],
        error: error.message,
      });
    }
    // Error was likely getting the customer session
    return sessionLogout(request);
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return sessionLogout(request, "/auth");
};

// —————————————————————————————————————————————————————————————————————————————————
// --- UI Helper Components ---
// These are well-defined and can be easily moved to /components/ui or /components/account
// —————————————————————————————————————————————————————————————————————————————————

const currencyFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  minimumFractionDigits: 0,
});

const StatusBadge: React.FC<StatusBadgeProps> = ({ product }) => {
  const getAuctionStatus = () => {
    if (product.is_sold) {
      return { text: "Sold", className: "bg-purple-500/20 text-purple-300" };
    }
    const now = new Date();
    const auctionEnd = new Date(product.auction_end);
    if (now > auctionEnd) {
      return { text: "Ended", className: "bg-red-500/20 text-red-300" };
    }
    return { text: "Live", className: "bg-green-500/20 text-green-300" };
  };
  const status = getAuctionStatus();
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${status.className}`}
    >
      {status.text}
    </span>
  );
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  className,
}) => (
  <div className="bg-secondary p-6 rounded-2xl shadow-lg flex items-center space-x-4">
    <div className={`p-3 rounded-full ${className}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-text2">{title}</p>
      <p className="text-2xl font-bold text-text1">{value}</p>
    </div>
  </div>
);

const StarRating: React.FC<StarRatingProps> = ({ rating, size = "md" }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5; // You could add logic for half-stars here
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const starSize =
    size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className={`${starSize} text-yellow-400 fill-yellow-400`}
        />
      ))}
      {/* Add half-star logic here if needed */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={`${starSize} text-gray-600`} />
      ))}
    </div>
  );
};

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, label }) => {
  if (!href) return null;
  const url = href.startsWith("http") ? href : `https://${href}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 text-text2 hover:text-accent transition-colors"
      aria-label={`Visit ${label} profile`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </a>
  );
};

const MerchantProfileHeader: React.FC<MerchantProfileHeaderProps> = ({
  merchant,
}) => {
  // --- State for Logout Popover ---
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // --- Effect to close popover on outside click ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowLogoutConfirm(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverRef]);

  return (
    <div className="bg-secondary rounded-2xl shadow-lg p-6 md:p-8 mb-8 overflow-hidden">
      {/* Cover Photo */}
      <div className="h-40 md:h-56 bg-gradient-to-t from-primary to-transparent -mx-6 -mt-6 md:-mx-8 md:-mt-8 rounded-t-2xl ">
        {merchant.cover_photo && (
          <img
            src={merchant.cover_photo}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 md:-mt-28    ">
        {/* Profile Picture */}
        <div className="relative border-4 border-secondary rounded-full w-36 h-36 md:w-48 md:h-48 overflow-hidden flex-shrink-0 bg-tertiary">
          <img
            src={
              merchant.profile_picture ||
              `https://placehold.co/200x200/333/FFF?text=${
                merchant.user_name ? merchant.user_name.charAt(0) : "A"
              }`
            }
            alt={`${merchant.user_name || "Merchant"}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name, Rating, Bio */}
        <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left w-full bg-secondary">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text1">
                {merchant.user_name || "My Profile"}
                {merchant.kyc_verified && (
                  <span className="ml-2 text-xs bg-blue-500/20 text-blue-300 py-1 px-2 rounded-full align-middle">
                    Verified
                  </span>
                )}
              </h1>
              <p className="text-accent font-semibold">
                {merchant.phone_number}
              </p>
            </div>

            {/* --- ACTION BUTTONS (Aligned and Rounded) --- */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4 md:mt-0">
              {/* View as Merchant */}
              <Link
                to={`/merchant/${merchant.phone_number}`}
                className="bg-accent text-buttontext px-6 py-2 rounded-full font-semibold hover:bg-complementary transition-colors text-center"
              >
                View Public Profile
              </Link>

              <Link
                to="/account/edit"
                className="bg-tertiary text-text1 px-6 py-2 rounded-full font-semibold hover:bg-tertiary/80 transition-colors text-center"
              >
                Edit Profile
              </Link>

              {/* --- Logout Button with Popover --- */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm((prev) => !prev)}
                  className="w-full sm:w-auto bg-danger hover:bg-danger2 text-text py-2 px-6 rounded-full font-bold transition duration-200"
                >
                  Logout
                </button>

                {/* Popover */}
                {showLogoutConfirm && (
                  <div
                    ref={popoverRef}
                    className="absolute top-full right-0 mt-2 w-64 bg-tertiary rounded-xl shadow-2xl z-20 p-4 border border-gray-700"
                  >
                    <p className="text-text1 text-sm mb-4">
                      Are you sure you want to log out?
                    </p>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowLogoutConfirm(false)}
                        className="px-4 py-2 rounded-full text-sm font-medium text-text2 hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <Form method="post" className="inline-block">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-full text-sm font-medium bg-danger hover:bg-danger2 text-text transition-colors"
                        >
                          Logout
                        </button>
                      </Form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-2 mt-2">
            <StarRating rating={merchant.average_rating} />
            <span className="text-text2 text-sm">
              ({merchant.review_count || 0} reviews)
            </span>
          </div>

          <p className="text-text2 mt-3 max-w-2xl">
            {merchant.bio ||
              "You haven't written a bio yet. Click 'Edit Profile' to add one."}
          </p>

          {merchant.permanent_address && (
            <div className="flex items-center justify-center md:justify-start space-x-2 mt-2 text-sm text-text2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>{merchant.permanent_address}</span>
            </div>
          )}

          {/* Social Links */}
          <div className="flex items-center justify-center md:justify-start space-x-4 mt-4">
            <SocialLink
              href={merchant.facebook}
              icon={<Facebook className="h-5 w-5" />}
              label="Facebook"
            />
            <SocialLink
              href={merchant.instagram}
              icon={<Instagram className="h-5 w-5" />}
              label="Instagram"
            />
            <SocialLink
              href={merchant.linkedin}
              icon={<Linkedin className="h-5 w-5" />}
              label="LinkedIn"
            />
            <SocialLink
              href={merchant.pinterest}
              icon={<LinkIcon className="h-5 w-5" />}
              label="Website"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const MerchantListings: React.FC<MerchantListingsProps> = ({ products }) => {
  const stats = useMemo(() => {
    const liveAuctions = products.filter(
      (p) => !p.is_sold && new Date() < new Date(p.auction_end)
    ).length;
    const totalValue = products.reduce(
      (acc, p) => acc + (p.current_bid || 0),
      0
    );
    return {
      totalListings: products.length,
      liveAuctions,
      totalValue,
    };
  }, [products]);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-text1">My Listings & Stats</h2>
        {/* Add Listing link to /product/create */}
        <Link
          to="/product/create"
          className="bg-accent text-buttontext px-6 py-2 rounded-lg font-semibold hover:bg-complementary transition-colors flex items-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span>Add New Listing</span>
        </Link>
      </div>

      {/* --- Stats Section --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Listings"
          value={stats.totalListings.toLocaleString()}
          icon={<Package className="text-blue-400" />}
          className="bg-blue-500/20"
        />
        <StatCard
          title="Live Auctions"
          value={stats.liveAuctions.toLocaleString()}
          icon={<BadgePercent className="text-green-400" />}
          className="bg-green-500/20"
        />
        <StatCard
          title="Value of Current Bids"
          value={currencyFormatter.format(stats.totalValue)}
          icon={<DollarSign className="text-yellow-400" />}
          className="bg-yellow-500/20"
        />
      </div>

      {/* --- Products Table / Cards --- */}
      <div className="bg-secondary rounded-2xl shadow-lg">
        {products.length > 0 ? (
          <>
            {/* Mobile: Card list */}
            <div className="divide-y divide-tertiary md:hidden">
              {products.map((product) => (
                <div key={product._id} className="p-4">
                  <Link
                    to={`/product/${product._id}`}
                    className="block hover:bg-tertiary/30 transition-colors -m-4 p-4"
                  >
                    <div className="flex space-x-4">
                      <img
                        src={
                          product.product_cover ||
                          "https://placehold.co/100x100/333/FFF?text=Image"
                        }
                        alt={product.product_name}
                        className="h-16 w-16 rounded-lg object-cover flex-shrink-0 bg-tertiary"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://placehold.co/100x100/333/FFF?text=Error")
                        }
                      />
                      <div className="flex-1 min-w-0">
                        {" "}
                        {/* Added min-w-0 for truncation */}
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-text1 pr-2 truncate">
                            {" "}
                            {/* Added truncate */}
                            {product.product_name}
                          </span>
                          <span className="font-bold text-accent text-lg flex-shrink-0">
                            {currencyFormatter.format(product.current_bid)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <StatusBadge product={product} />
                          <span className="text-text2 truncate">
                            {" "}
                            {/* Added truncate */}
                            {product.category || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {/* --- Mobile Action Links --- */}
                  <div className="flex items-center justify-end space-x-4 mt-3 pt-3 border-t border-tertiary">
                    <Link
                      to={`/product/edit/${product._id}`}
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Edit</span>
                    </Link>
                    <Link
                      to={`/product/delete/${product._id}`}
                      className="flex items-center space-x-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Delete</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table */}
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-tertiary/50 text-text2 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 w-24">Image</th>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Current Bid</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">View</th>
                    <th className="px-6 py-3">Actions</th>{" "}
                    {/* New Actions column */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-tertiary">
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-tertiary/30 transition-colors w-full"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={
                            product.product_cover ||
                            "https://placehold.co/100x100/333/FFF?text=Image"
                          }
                          alt={product.product_name}
                          className="h-12 w-12 rounded-lg object-cover bg-tertiary"
                          onError={(e) =>
                            (e.currentTarget.src =
                              "https://placehold.co/100x100/333/FFF?text=Error")
                          }
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-text1 whitespace-nowrap max-w-xs truncate">
                        {" "}
                        {/* Added max-w-xs and truncate */}
                        {product.product_name}
                      </td>
                      <td className="px-6 py-4 text-text2">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-text1 font-semibold">
                        {currencyFormatter.format(product.current_bid)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge product={product} />
                      </td>
                      <td className="px-6 py-4 text-left">
                        <Link
                          to={`/product/${product._id}`}
                          className="text-accent hover:underline font-medium"
                        >
                          View
                        </Link>
                      </td>
                      {/* --- Desktop Action Links --- */}
                      <td className="px-6 py-4 text-left whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <Link
                            to={`/product/edit/${product._id}`}
                            title="Edit Product"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/product/delete/${product._id}`}
                            title="Delete Product"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center p-12">
            <MessageSquare className="h-12 w-12 text-text2 mx-auto mb-4" />
            <p className="text-text2 text-lg">
              You have not listed any products yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// —————————————————————————————————————————————————————————————————————————————————
// --- Main Page Component ---
// —————————————————————————————————————————————————————————————————————————————————

export default function AccountPage() {
  const { user, merchant, products, error } = useLoaderData<typeof loader>();

  if (!user) {
    // This case should be handled by the redirect in loader, but as a fallback:
    return (
      <section className="w-full bg-primary">
        <main className="bg-primary text-text min-h-screen py-16 container mx-auto">
          <Navbar />
          <div className="text-center py-24">
            <h1 className="text-2xl font-bold text-red-400">
              An Error Occurred
            </h1>
            <p className="text-text2 mt-2">
              {error || "Could not load user data."}
            </p>
            <Link
              to="/auth"
              className="mt-6 inline-block bg-accent text-white px-6 py-2 rounded-lg"
            >
              Go to Login
            </Link>
          </div>
          <Footer />
        </main>
      </section>
    );
  }

  return (
    <section className="w-full bg-primary">
      <main className="bg-primary text-text min-h-screen py-24 container mx-auto p-4">
        <Navbar />
        <div className="max-w-6xl mx-auto">
          {merchant ? (
            // --- Merchant View ---
            // User has a merchant profile, show the full dashboard
            <>
              <MerchantProfileHeader merchant={merchant} />
              <MerchantListings products={products} />
            </>
          ) : (
            // --- Non-Merchant View ---
            // User is logged in but has no merchant profile yet.
            <div className="bg-secondary rounded-2xl shadow-lg p-8 text-center">
              <h1 className="text-3xl font-bold text-text1">
                Welcome, {user.displayName || user.email}
              </h1>
              <p className="text-text2 mt-4 max-w-lg mx-auto">
                It looks like you haven't set up your public merchant profile
                yet. You can edit your profile to add a bio, social links, and
                more.
              </p>
              <Link
                to="/account/edit"
                className="mt-8 inline-block bg-accent text-buttontext px-8 py-3 rounded-lg font-semibold hover:bg-complementary"
              >
                Set Up My Profile
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </section>
  );
}
