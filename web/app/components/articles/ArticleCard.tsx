import React from "react";
import { Link } from "@remix-run/react";

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

interface ArticleProps {
    articles: Article[];
    onArticleRead: (articleId: string) => void; // New prop
}

// Helper function to split each tag string by space and return all tags as a flat array
const splitTags = (tags: string[]): string[] => tags.flatMap((tag) => tag.split(" "));

const ArticleCard: React.FC<ArticleProps> = ({ articles, onArticleRead }) => {
    return (
        <>
            {articles.map((article) => (
                <Link
                    to={`/article/${article._id}`}
                    key={article._id}
                    className="bg-secondary rounded-3xl hover:shadow-md hover:bg-quaternary border-2 border-secondary hover:border-quaternary overflow-hidden"
                    onClick={() => onArticleRead(article._id)} // Trigger read logic on click
                >
                    <img
                        src={article.cover}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-2xl"
                    />
                    <div className="p-6 flex flex-col gap-4">
                        <h2 className="text-xl font-medium text-text max-h-8 overflow-hidden">{article.title}</h2>
                        <p className="text-sm text-text2 max-h-10 overflow-hidden">{article.description}</p>
                        <div className="flex flex-wrap mt-2 gap-2 text-text2 max-h-10 overflow-hidden">
                            {splitTags(article.tags).map((tag, index) => (
                                <span key={`${tag}-${index}`} className="bg-tertiary px-4 py-2.5 rounded-2xl text-xs">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex flex-row justify-left items-center gap-6">
                            <div className="flex flex-row gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M19.285 12.645a3.8 3.8 0 0 0-5.416-5.332q-.288.288-.732.707l-.823.775l-.823-.775q-.445-.42-.733-.707a3.8 3.8 0 0 0-5.374 0c-1.468 1.469-1.485 3.844-.054 5.32l6.984 6.984l6.97-6.972z"
                                    />
                                </svg>
                                <span className="text-text2">{article.likesCount}</span>
                            </div>
                            <div className="flex flex-row gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 1 0-9-9c0 1.488.36 2.89 1 4.127L3 21l4.873-1c1.236.639 2.64 1 4.127 1" />
                                </svg>
                                <span className="text-text2">{article.commentsCount}</span>
                            </div>

                            <div className="flex flex-row gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M11.602 18.636a.75.75 0 0 0 .398.11a.75.75 0 0 0 .398-.11l1.135-.681a8.3 8.3 0 0 1 7.36-.59c.89.356 1.857-.3 1.857-1.257V4.45c0-.578-.352-1.097-.889-1.312a10.7 10.7 0 0 0-9.48.76L12 4.124l-.382-.229a10.7 10.7 0 0 0-9.48-.76A1.41 1.41 0 0 0 1.25 4.45v11.66c0 .957.967 1.612 1.857 1.256a8.3 8.3 0 0 1 7.36.59zM2.75 4.508v11.387a9.8 9.8 0 0 1 8.489.774l.011.006V5.425l-.403-.242a9.2 9.2 0 0 0-8.097-.675m10.011 12.16l-.011.007V5.425l.403-.242a9.2 9.2 0 0 1 8.097-.675v11.387a9.8 9.8 0 0 0-8.489.774" clip-rule="evenodd" /><path fill="currentColor" d="M9.275 19.042a6.5 6.5 0 0 0-6.55 0l-.103.06a.75.75 0 1 0 .756 1.296l.103-.06a5 5 0 0 1 5.038 0l1.088.634a4.75 4.75 0 0 0 4.786 0l1.088-.634a5 5 0 0 1 5.038 0l.103.06a.75.75 0 0 0 .756-1.296l-.103-.06a6.5 6.5 0 0 0-6.55 0l-1.087.634a3.25 3.25 0 0 1-3.276 0z" /></svg>
                                <span className="text-text2">{article.readsCount}</span>
                            </div>


                        </div>
                    </div>
                </Link>
            ))}
        </>
    );
};

export default ArticleCard;
