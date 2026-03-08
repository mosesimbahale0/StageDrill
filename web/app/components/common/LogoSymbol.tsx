import { Link } from "@remix-run/react";

export default function Logo() {
  return (
    <>
      <Link to="/" className="flex items-center gap-2  w-8">
        <section className="flex flex-row items-center gap-3 relative  w-full">
          <img src="/logo.png" alt="Logo" className="block h-8 w-auto" />
        </section>
      </Link>
    </>
  );
}
