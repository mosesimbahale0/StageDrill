import ThemeToggle from "~/components/theme/ThemeToggle";
import { Link } from "@remix-run/react";

import Logo from "./Logo";

export default function Footer() {
  return (
    <>
      <section className="bg-primary">
        <div className="bg-primary  border-t border-secondary text-center p-4 text-sm text-text  flex flex-row flex-wrap justify-between items-center gap-2 container mx-auto">
          <section className="flex flex-col justify-around h-48 ">


            <div className="flex flex-row flex-wrap lg:justify-center items-left gap-4">
              <a
                href="https://x.com"
                target="_blank"
                className="bg-secondary hover:bg-accent  hover:text-text  text-text2 w-12 h-12 rounded-full flex  flex-row items-center justify-center    text-sm "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="currentColor"
                    d="M9.294 6.928L14.357 1h-1.2L8.762 6.147L5.25 1H1.2l5.31 7.784L1.2 15h1.2l4.642-5.436L10.751 15h4.05zM7.651 8.852l-.538-.775L2.832 1.91h1.843l3.454 4.977l.538.775l4.491 6.47h-1.843z"
                  />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com"
                target="_blank"
                className="bg-secondary hover:bg-accent  hover:text-text  text-text2 w-12 h-12 rounded-full flex  flex-row items-center justify-center    text-sm "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 1536 1536"
                >
                  <path
                    fill="currentColor"
                    d="M237 1286h231V592H237zm246-908q-1-52-36-86t-93-34t-94.5 34t-36.5 86q0 51 35.5 85.5T351 498h1q59 0 95-34.5t36-85.5m585 908h231V888q0-154-73-233t-193-79q-136 0-209 117h2V592H595q3 66 0 694h231V898q0-38 7-56q15-35 45-59.5t74-24.5q116 0 116 157zm468-998v960q0 119-84.5 203.5T1248 1536H288q-119 0-203.5-84.5T0 1248V288Q0 169 84.5 84.5T288 0h960q119 0 203.5 84.5T1536 288"
                  />
                </svg>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                className="bg-secondary hover:bg-accent  hover:text-text  text-text2 w-12 h-12 rounded-full flex  flex-row items-center justify-center    text-sm "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73"
                  />
                </svg>
              </a>

              <div className=" flex flex-row flex-wrap gap-2  ">
                <ThemeToggle />
              </div>
            </div>

            <div className="flex items-center gap-2  ">
              <section className="flex flex-row items-center gap-2">
                <Logo />
              </section>
            </div>




          </section>

          <section className="flex flex-col justify-around h-48 items-start  text-text2">
            <Link
              to="/privacy-policy"
              className=" block  hover:text-complementary hover:underline"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms-of-service"
              className=" block  hover:text-complementary hover:underline"
            >
              Terms of Service
            </Link>

            <div className="flex flex-row  flex-wrap gap-2 font-light  text-sm">
              <span>&copy; {new Date().getUTCFullYear()} Copyright | </span>
              <p className="">RehearsalZone</p>
              <span className=""> | All Rights Reserved</span>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
