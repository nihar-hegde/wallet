"use client";

import React from "react";
import { useAccounts } from "@/hooks/useAccounts";
import { SettingsPage } from "@/components/Shared/SettingsComponent";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const SettingsPageRoute = () => {
  const { selectedAccount } = useAccounts();
  if (!selectedAccount) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="bg-neutral-900 p-10 rounded-xl flex flex-col items-center gap-8">
          <h1 className="text-xl font-bold">
            Looks like you have not logged in. Please login to continue.
          </h1>
          <Link href={"/dashboard"} className={buttonVariants()}>
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="bg-neutral-900 p-10 rounded-xl flex flex-col items-center gap-8">
        <SettingsPage selectedAccountPublicKey={selectedAccount} />
      </div>
    </div>
  );
};

export default SettingsPageRoute;
