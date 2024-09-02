import { buttonVariants } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import Link from "next/link";
import React from "react";

export const Welcome = () => {
  return (
    <div className="flex item-center justify-center">
      <div className="flex flex-col gap-8 items-center justify-center">
        <Wallet size={150} />
        <h1 className="text-4xl font-bold ">Welcome to Wallet</h1>
        <div className="flex flex-col items-center gap-4">
          <Link
            href={"/onboarding/2"}
            className={`${buttonVariants()} rounded-xl`}
          >
            Create a New Wallet
          </Link>
          <Link
            href={"/recover-account"}
            className={`${buttonVariants({ variant: "outline" })} rounded-xl`}
          >
            Recover Existing Wallet
          </Link>
        </div>
      </div>
    </div>
  );
};
