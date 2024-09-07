import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";

export const Navbar = () => {
  return (
    <nav className="bg-transparent p-6 z-50 fixed flex items-center justify-end w-full">
      <Link
        href={"/dashboard"}
        className={buttonVariants({ variant: "outline" })}
      >
        Login
      </Link>
    </nav>
  );
};
