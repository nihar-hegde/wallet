"use client";
import { PasswordVerification } from "@/components/Onboarding/PasswordConfirm";
import { Dashboard } from "@/components/Shared/Dashboard";
import NoWalletFound from "@/components/Shared/NoWalletComponent";
import { walletUtils } from "@/lib/solana-utils/solana-wallet-utils";
import React, { useEffect, useState } from "react";

const DashboardPage = () => {
  const [walletExists, setWalletExists] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const checkWallet = async () => {
      const result = await walletUtils.walletExists();
      setWalletExists(result);
    };
    checkWallet();
  }, []);

  if (!walletExists) {
    return (
      <div className="h-screen flex justify-center items-center">
        <NoWalletFound />
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="bg-neutral-900 p-10 rounded-xl w-[400px]">
          <PasswordVerification onSuccess={() => setIsUnlocked(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
