"use client";
// components/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { walletUtils } from "@/lib/solana-utils/solana-wallet-utils";
import Sidebar from "./Sidebar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const Dashboard = () => {
  const [accounts, setAccounts] = useState<
    Array<{ name: string; publicKey: string }>
  >([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [password, setPassword] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const accountList = await walletUtils.getAccounts();
    setAccounts(accountList);
  };

  const handleSelectAccount = (publicKey: string) => {
    setSelectedAccount(publicKey);
    setShowPrivateKey(false);
    setPrivateKey("");
    setError("");
  };

  const handleShowPrivateKey = async () => {
    try {
      const decryptedPrivateKey = await walletUtils.getPrivateKey(
        selectedAccount!,
        password
      );
      setPrivateKey(decryptedPrivateKey);
      setShowPrivateKey(true);
      setError("");
    } catch (error) {
      setError("Invalid password or failed to decrypt private key");
    }
  };

  return (
    <div className="flex">
      <Sidebar accounts={accounts} onSelectAccount={handleSelectAccount} />
      <div className="flex-1 p-8">
        {selectedAccount ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Account Details</h2>
            <p>Public Key: {selectedAccount}</p>
            {!showPrivateKey ? (
              <div className="mt-4">
                <Input
                  type="password"
                  placeholder="Enter password to view private key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handleShowPrivateKey} className="mt-2">
                  Show Private Key
                </Button>
              </div>
            ) : (
              <div className="mt-4">
                <p>Private Key: {privateKey}</p>
              </div>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        ) : (
          <p>Select an account to view details</p>
        )}
      </div>
    </div>
  );
};
