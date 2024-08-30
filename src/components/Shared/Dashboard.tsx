"use client";
import { walletUtils } from "@/lib/solana-utils/solana-wallet-utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { PasswordVerification } from "../Onboarding/PasswordConfirm";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export const Dashboard = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const [showAddAccountPrompt, setShowAddAccountPrompt] = useState(false);
  const [addAccountPassword, setAddAccountPassword] = useState("");
  const [addAccountError, setAddAccountError] = useState("");
  const router = useRouter();

  useEffect(() => {
    checkWalletExists();
  }, []);

  const checkWalletExists = async () => {
    const exists = await walletUtils.walletExists();
    setHasWallet(exists);
  };

  const handleUnlock = async (password: string) => {
    const isValid = await walletUtils.verifyPassword(password);
    if (isValid) {
      setIsUnlocked(true);
      loadAccounts();
    } else {
      setAddAccountError("Invalid password");
    }
  };

  const handleAddAccountClick = () => {
    setShowAddAccountPrompt(true);
    setAddAccountError("");
  };

  const handleAddAccountSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    try {
      console.log("Verifying password");
      const isValid = await walletUtils.verifyPassword(addAccountPassword);
      console.log("Password verification result:", isValid);

      if (isValid) {
        console.log("Adding new account");
        const newPublicKey = await walletUtils.addAccount(addAccountPassword);
        console.log("New account added with public key:", newPublicKey);

        // Reload the accounts
        await loadAccounts();

        setShowAddAccountPrompt(false);
        setAddAccountPassword("");
        // Optionally, show a success message
        // setSuccessMessage("New account added successfully!");
      } else {
        console.log("Invalid password entered");
        setAddAccountError("Invalid password");
      }
    } catch (error: any) {
      console.error("Error in handleAddAccountSubmit:", error);
      setAddAccountError(`An error occurred: ${error.message}`);
    }
  };

  const loadAccounts = async () => {
    console.log("Loading accounts");
    try {
      const accountList = await walletUtils.getAccounts();
      console.log("Accounts loaded:", accountList);
      setAccounts(accountList);
    } catch (error) {
      console.error("Failed to load accounts:", error);
    }
  };

  if (hasWallet === null) {
    return <div>Loading...</div>;
  }

  if (!hasWallet) {
    return (
      <div>
        <p>You don&apos;t have any wallet in this browser or device.</p>
        <Button onClick={() => router.push("/onboarding/1")}>
          Create Wallet
        </Button>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="flex items-center justify-center p-14 w-full h-screen">
        <div className="max-w-96 bg-neutral-800 p-10 rounded-md">
          <PasswordVerification onSuccess={handleUnlock} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Wallet</h1>
      <h2>Accounts:</h2>
      <ul>
        {accounts.map((account, index) => (
          <li key={index}>
            {account.name}: {account.publicKey}
          </li>
        ))}
      </ul>
      {!showAddAccountPrompt ? (
        <Button onClick={handleAddAccountClick}>Add Account</Button>
      ) : (
        <form onSubmit={handleAddAccountSubmit} className="space-y-4">
          <div>
            <Label htmlFor="addAccountPassword">
              Enter your wallet password to add a new account
            </Label>
            <Input
              type="password"
              id="addAccountPassword"
              value={addAccountPassword}
              onChange={(e) => setAddAccountPassword(e.target.value)}
              required
            />
          </div>
          {addAccountError && (
            <p className="text-red-500 text-sm">{addAccountError}</p>
          )}
          <Button type="submit">Confirm Add Account</Button>
          <Button type="button" onClick={() => setShowAddAccountPrompt(false)}>
            Cancel
          </Button>
        </form>
      )}
    </div>
  );
};
