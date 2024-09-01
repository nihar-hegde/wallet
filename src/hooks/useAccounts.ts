import { useState, useEffect, useCallback } from "react";
import { walletUtils } from "@/lib/solana-utils/solana-wallet-utils";

export interface Account {
  name: string;
  publicKey: string;
}

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accountList = await walletUtils.getAccounts();
      setAccounts(accountList);
      if (accountList.length > 0 && !selectedAccount) {
        setSelectedAccount(accountList[0].publicKey);
      }
    } catch (err) {
      console.error("Failed to load accounts:", err);
      setError("Failed to load accounts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedAccount]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const addAccount = async (password: string) => {
    try {
      const newPublicKey = await walletUtils.addAccount(password);
      await loadAccounts();
      return newPublicKey;
    } catch (err) {
      console.error("Failed to add account:", err);
      throw new Error(
        "Failed to add account. Please check your password and try again."
      );
    }
  };

  return {
    accounts,
    selectedAccount,
    setSelectedAccount,
    loadAccounts,
    addAccount,
    isLoading,
    error,
  };
};
