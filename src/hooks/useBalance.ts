import { useState, useEffect, useCallback } from "react";
import { walletUtils } from "@/lib/solana-utils/solana-wallet-utils";

export const useBalance = (publicKey: string | null) => {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) return;
    setIsLoading(true);
    setError(null);
    try {
      const balance = await walletUtils.getBalance(publicKey);
      setBalance(balance);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError("Failed to fetch balance. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const requestAirdrop = async () => {
    if (!publicKey) return;
    try {
      await walletUtils.requestAirDrop(publicKey, 2);
      await fetchBalance();
    } catch (err) {
      console.error("Error requesting airdrop:", err);
      throw new Error("Failed to request airdrop. Please try again later.");
    }
  };

  return { balance, isLoading, error, refetch: fetchBalance, requestAirdrop };
};
