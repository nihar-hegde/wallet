import { useState, useEffect } from "react";
import { walletUtils } from "@/lib/solana-utils/solana-wallet-utils";

export const useWalletCheck = () => {
  const [walletExists, setWalletExists] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkWallet = async () => {
      try {
        const result = await walletUtils.walletExists();
        setWalletExists(result);
      } catch (err) {
        console.error("Failed to check wallet existence:", err);
        setError("Failed to check wallet status. Please try again.");
      }
    };
    checkWallet();
  }, []);

  return { walletExists, error };
};
