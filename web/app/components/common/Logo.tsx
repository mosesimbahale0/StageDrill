import { Link } from "@remix-run/react";

export default function Logo() {
  return (
    <>
      <Link to="/" className="flex items-center gap-2  w-56">
        <section className="flex flex-row items-center gap-3 relative  w-full">
          <img src="https://res.cloudinary.com/dlw9hjlzv/image/upload/v1772969165/StageDrill/Group_1_6_ussgpu.png" alt="Logo" className="block h-10 w-auto" />
        </section>
      </Link>
    </>
  );
}
