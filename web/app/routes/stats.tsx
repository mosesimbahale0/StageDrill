import { MetaFunction } from "@remix-run/node";

// Meta function for SEO
export const meta: MetaFunction = () => [
    { title: "RehersalZone • Stats" },
    { name: "description", content: "The Home Of Rehearsals" },
];

import Sidebar from "~/components/Sidebar";

export default function notifications() {
    return (
        <>
            <>
                <Sidebar />

                <div
                    className="lg:pl-72 py-20 p-2 lg:p-2  flex flex-wrap lg:flex-row 
      bg-primary h-screen  overflow-y-scroll scrollbar
 scrollbar-thumb-accent scrollbar-track-tertiary shadow-md scrollbar-rounded-full
 scrollbar-thumb-rounded-full 
 scrollbar-track-rounded-full"
                >
                    <div className="container mx-auto">
                        <div className="flex flex-col items-center gap-2 py-4">
                            <div className="flex justify-center items-center mb-8">
                                <div className="h-24 w-24 rounded-full bg-secondary flex flex-col justify-center items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="1.5"
                                            d="M3 15.5v1.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218H21m-18-5v-12m0 12l3.857-3.213c1.634-1.362 2.708-1.222 4.119.189l.006.006c1.538 1.538 2.64 1.474 4.172.133L21 7.5"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className=" text-center ">
                                <h3 className="mb-1 text-2xl text-text">No Stats Yet</h3>

                                <p className="text-sm text-text2">

                                    Your stats will appear here once you have made some interactions with the FunSpots...

                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </>
        </>
    );
}
