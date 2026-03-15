import { MetaFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "~/authContext";
import { fetchAllTemplates } from "~/fetchers/templateFetcher.server";
import { fetchProfileByAccountId } from "~/fetchers/funspotFetcher.server";
import type { TemplateSchema } from "~/types";

import Sidebar from "~/components/Sidebar";
import TemplateCard from "~/components/template/TemplateCard";

// --- Constants ---
const ITEMS_PER_PAGE = 120;

// --- SEO Meta Function ---
export const meta: MetaFunction = () => [
    { title: "RehearsalZone • Store" },
    {
        name: "description",
        content: "Discover and share creative templates on RehearsalZone.",
    },
];

// --- Server-Side Loader ---
export const loader: LoaderFunction = async ({ request, params }) => {
    // const { accountId } = params;
    // if (!accountId) {
    //     console.warn("Redirecting to / due to missing accountId in URL.");
    //     return redirect("/");
    // }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const skip = (page - 1) * ITEMS_PER_PAGE;

    try {
        // Fetch one more item than needed to check if there's a next page
        const templatesWithExtra = await fetchAllTemplates(
            skip,
            ITEMS_PER_PAGE + 1
        );

        const hasNextPage = templatesWithExtra.length > ITEMS_PER_PAGE;
        // Slice the array to only include the items for the current page
        const templates = templatesWithExtra.slice(0, ITEMS_PER_PAGE);

        // const profile = await fetchProfileByAccountId(accountId);

        return json({
            templates,
            // profile,
            currentPage: page,
            hasNextPage,
            // accountId,
        });
    } catch (error) {
        console.error("Loader Error:", error);
        return json(
            {
                templates: [],
                profile: null,
                currentPage: 1,
                hasNextPage: false,
                // accountId,
            },
            { status: 500 }
        );
    }
};

// --- Custom Hooks for Logic Encapsulation ---

/**
 * Handles authentication check and redirects to /auth if the user is not logged in.
 */
const useAuthRedirect = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            console.log("Redirecting to /auth: User not authenticated.");
            navigate("/auth");
        }
    }, [loading, user, navigate]);
};

// --- UI Components ---

const SearchIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
    </svg>
);

const SearchInput = () => {
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!keyword.trim()) return;
        navigate(`/search/${encodeURIComponent(keyword.trim())}`);
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-md ">
            <input
                type="text"
                placeholder="Search All Templates..."
                maxLength={50}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full text-sm h-14 pl-6 pr-16 text-text bg-secondary border-2 border-transparent focus:bg-primary focus:border-accent rounded-full outline-none transition-colors duration-300 placeholder-text3"
            />
            <button
                type="submit"
                title="Search"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-accent hover:bg-complementary text-buttontext rounded-full transition-transform duration-200 active:scale-95"
            >
                <SearchIcon />
            </button>
        </form>
    );
};

const TemplateGrid = ({ templates }: { templates: TemplateSchema[] }) => {
    if (templates.length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center h-64 text-center text-text2 bg-secondary rounded-2xl">
                <h3 className="text-xl font-semibold">No Templates Found</h3>
                <p>It looks like there are no templates to display right now.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            <AnimatePresence>
                {templates.map((template) => (
                    <motion.div
                        key={template._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <TemplateCard propsData={template} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

const Pagination = ({
    currentPage,
    hasNextPage,
}: {
    currentPage: number;
    hasNextPage: boolean;
}) => {
    const isFirstPage = currentPage === 1;

    if (isFirstPage && !hasNextPage) {
        return null; // Don't render pagination if there's only one page
    }

    return (
        <nav className="flex items-center justify-center space-x-4 mt-12 text-xs">
            <Link
                to={`?page=${currentPage - 1}`}
                prefetch="intent"
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isFirstPage
                    ? "bg-secondary text-text3 cursor-not-allowed pointer-events-none"
                    : "bg-secondary text-text hover:bg-accent hover:text-white"
                    }`}
                aria-disabled={isFirstPage}
            >
                &larr; Previous
            </Link>

            <span className="font-semibold text-text2 ">
                Page {currentPage} of 673
            </span>

            <Link
                to={`?page=${currentPage + 1}`}
                prefetch="intent"
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${!hasNextPage
                    ? "bg-secondary text-text3 cursor-not-allowed pointer-events-none"
                    : "bg-secondary text-text hover:bg-accent hover:text-white"
                    }`}
                aria-disabled={!hasNextPage}
            >
                Next &rarr;
            </Link>
        </nav>
    );
};

// --- Main Page Component ---
export default function StorePage() {
    const {
        templates = [],
        currentPage = 1,
        hasNextPage = false,
    } = useLoaderData<typeof loader>();

    useAuthRedirect();

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    return (
        <div className="flex bg-primary min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:pl-64">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-8">
                    <div className="flex flex-col items-center gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full flex justify-center"
                        >
                            <SearchInput />
                        </motion.div>
                        <TemplateGrid templates={templates} />
                        <Pagination currentPage={currentPage} hasNextPage={hasNextPage} />
                    </div>
                </div>
            </main>
        </div>
    );
}
