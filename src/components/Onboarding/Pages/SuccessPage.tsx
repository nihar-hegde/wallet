import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export const SuccessPage = () => {
  return (
    <div>
      <div>Success page go to dashboard</div>
      <Link href={"/dashboard"} className={buttonVariants()}>
        Dashboard
      </Link>
    </div>
  );
};
