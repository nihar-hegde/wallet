import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export const SuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 bg-neutral-900 p-10 rounded-xl ">
      <h1 className="text-2xl font-bold">
        Your account creation was a success.
      </h1>
      <h2 className="text-xl font-semibold">
        Go to dashboard to view more info about your account.
      </h2>
      <Link href={"/dashboard"} className={buttonVariants()}>
        Dashboard
      </Link>
    </div>
  );
};
