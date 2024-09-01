import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyButton } from "./CopyToClipboard";
import { Button } from "@/components/ui/button";
import { Account } from "@/hooks/useAccounts";

interface AccountDetailsProps {
  account: Account | undefined;
  balance: number;
  isLoadingBalance: boolean;
  balanceError: string | null;
  onShowPrivateKey: () => void;
}

export const AccountDetails: React.FC<AccountDetailsProps> = ({
  account,
  balance,
  isLoadingBalance,
  balanceError,
  onShowPrivateKey,
}) => {
  if (!account) return null;

  const truncatePublicKey = (key: string) =>
    `${key.slice(0, 5)}...${key.slice(-5)}`;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{account.name}</h1>
      <h2 className="text-4xl font-bold mb-4">
        {isLoadingBalance ? (
          <Skeleton className="h-10 w-[100px]" />
        ) : balanceError ? (
          <span className="text-red-500">Error loading balance</span>
        ) : (
          `${balance} SOL`
        )}
      </h2>
      <p className="text-gray-400 mb-8">+$0.00 +0.00%</p>
      <div className="bg-neutral-800 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <span>Public Key:</span>
          <div className="flex items-center">
            <span>{truncatePublicKey(account.publicKey)}</span>
            <CopyButton text={account.publicKey} />
          </div>
        </div>
        <Button onClick={onShowPrivateKey} className="w-full">
          Show Private Key
        </Button>
      </div>
    </div>
  );
};
