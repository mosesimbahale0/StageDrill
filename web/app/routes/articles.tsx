import type { MetaFunction } from "@remix-run/node";
export const meta: MetaFunction = () => {
    return [
        { title: "RehearsalZone • AI-Powered Speech & Interview Coaching" },
        {
            name: "description",
            content:
                "Master your message with AI-powered feedback on interviews, speeches, and presentations.",
        },
    ];
};

import { Link } from "@remix-run/react";
import Navbar from "~/components/common/Navbar";
import Footer from "~/components/common/Footer";

import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import ArticleCard from "~/components/articles/ArticleCard";
import { useAuth } from "~/authContext";
import { GRAPHQL_API_URL } from "~/utils/siteConfig";

import { motion, Variants } from "framer-motion";
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const staggerChildren: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

interface User {
    uid: string;
    email: string;
    displayName: string;
    accessToken: string;
}

interface Article {
    _id: string;
    author: string;
    title: string;
    description: string;
    cover: string;
    tags: string[];
    markdown: string;
    createdAt: string;
    updatedAt: string;
    readsCount: number;
    likesCount: number;
    commentsCount: number;
}

const GET_ALL_ARTICLES = `
query PaginateArticles($page: Int!, $limit: Int!) {
  paginateArticles(page: $page, limit: $limit) {
    articles {
      _id
      author
      title
      description
      cover
      tags
      markdown
      createdAt
      updatedAt
      readsCount
      likesCount
      commentsCount
    }
    total
  }
}
`;

const CREATE_READ = `
mutation CreateRead($userId: String!, $articleId: ID!) {
  createRead(userId: $userId, articleId: $articleId) {
    _id
    userId
    articleId
    createdAt
    updatedAt
  }
}
`;

// Loader function to fetch articles
export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "12", 10);

    try {
        const response = await fetch(GRAPHQL_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: GET_ALL_ARTICLES,
                variables: { page, limit },
            }),
        });

        const text = await response.text(); // Capture the HTML response

        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status}, response: ${text}`
            );
        }

        const data = JSON.parse(text);

        if (!data.data || !data.data.paginateArticles) {
            throw new Error("Invalid data from GraphQL API");
        }

        return json({
            articles: data.data.paginateArticles.articles,
            total: data.data.paginateArticles.total,
        });
    } catch (error) {
        console.error("Error fetching articles:", error);
        return json({ articles: [], total: 0 }, { status: 500 });
    }
};

// Read Action function
export const action = async ({
    request,
    params,
}: {
    request: Request;
    params: { articleId: string };
}) => {
    // Read Action function
    // export const action = async ({ request, params }) => {
    const { user } = useAuth();
    const userId = user?.uid || "1" || null;

    const formData = await request.formData();
    const articleId = params.articleId; // Assuming you have articleId in params

    try {
        const userId = formData.get("userId"); // Assuming userId is sent in formData

        if (!userId || !articleId) {
            throw new Error("Missing userId or articleId");
        }

        await fetch(GRAPHQL_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: CREATE_READ,
                variables: { userId, articleId },
            }),
        });

        return null; // Or redirect to the article page
    } catch (error) {
        console.error("Error creating read:", error);
        return json({ error: "Failed to create read" }, { status: 500 });
    }
};

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <ul className="flex space-x-2">
            {pageNumbers.map((number) => (
                <li
                    key={number}
                    className={` rounded-xl ${currentPage === number
                            ? "bg-accent text-text  border-2 border-accent  "
                            : "bg-tertiary text-accent border-2 border-accent rounded-lg hover:bg-accent hover:text-text active:bg-complementary"
                        }`}
                >
                    <button onClick={() => onPageChange(number)} className="px-4 py-2">
                        {number}
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default function Blog() {
    const { articles: initialArticles, total: initialTotal } = useLoaderData<{
        articles: Article[];
        total: number;
    }>();
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(initialTotal);
    const [loading, setLoading] = useState(false);

    const fetchArticles = async (page: number) => {
        setLoading(true);
        try {
            const url = new URL(GRAPHQL_API_URL);
            const body = {
                query: GET_ALL_ARTICLES,
                variables: { page, limit: 12 },
            };

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`Error fetching page ${page}: ${response.statusText}`);
            }

            const data = await response.json();
            setArticles(data.data.paginateArticles.articles);
            setTotal(data.data.paginateArticles.total);
            setCurrentPage(page);
        } catch (error) {
            console.error("Failed to fetch articles:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRead = async (articleId: string) => {
        try {
            const response = await fetch(GRAPHQL_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: CREATE_READ,
                    variables: { userId: "1", articleId }, // Replace "1" with actual userId from context/auth
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to record read");
            }
            console.log("Read recorded for article:", articleId);
        } catch (error) {
            console.error("Error recording read:", error);
        }
    };

    const totalPages = Math.ceil(total / 12);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    // Consistent font style for headings
    const sulphurPoint = { fontFamily: "Sulphur Point, sans-serif" };

    return (
        <>
            <Navbar />
            <div className="bg-primary">
                <section className="bg-primary text-text container mx-auto px-4 lg:px-0">
                    <motion.section
                        className="flex flex-col min-h-screen items-start justify-left bg-primary pt-10  "
                        initial="hidden"
                        animate="visible"
                        variants={staggerChildren}
                    >
                        <motion.section className=" " variants={fadeInUp}>
                            <div className="   ">
                                <div className="w-full text-center pt-20  ">
                                    <div className="flex flex-col gap-6 text-left ">
                                        <div className="flex flex-col  gap-10 text-left  ">
                                            <motion.h1
                                                className="text-4xl lg:text-6xl font-extrabold text-text"
                                                style={sulphurPoint}
                                                variants={fadeInUp}
                                            >
                                                The Home Of{" "}
                                                <span className="text-accent">Rehearsals</span>
                                            </motion.h1>
                                        </div>

                                        <div className=" text-left pb-2">
                                            <h3 className="mb-1 text-sm text-text2 ">
                                                {" "}
                                                Get tips and insights on rehearsal techniques from our
                                                experts.
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        <motion.section
                            className="bg-primary text-text "
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <section className="flex flex-col min-h-screen items-center justify-center bg-primary py-24 pt-10 container mx-auto">
                                <div className="flex flex-col lg:flex-row w-full">
                                    <div className="container mx-auto">
                                        <div className="flex flex-col gap-4 justify-center items-left mb-10">
                                            {/* <p className="text-left text-text2 text-sm">
                        Get tips and insights on rehearsal techniques from our
                        experts.
                      </p> */}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {loading ? (
                                                <div>Loading...</div>
                                            ) : (
                                                <ArticleCard
                                                    articles={articles}
                                                    onArticleRead={handleRead}
                                                />
                                            )}
                                        </div>
                                        <div className="mt-4 flex justify-left ">
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChange={fetchArticles}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </motion.section>
                    </motion.section>
                </section>
            </div>

            <Footer />
        </>
    );
}