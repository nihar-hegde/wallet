import { walletUtils } from "@/lib/solana-utils/solana-wallet-utils";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface PasswordVerificationProps {
  onSuccess: (password: string) => void;
}

export const PasswordVerification: React.FC<PasswordVerificationProps> = ({
  onSuccess,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const isValid = await walletUtils.verifyPassword(password);
      if (isValid) {
        onSuccess(password); // Pass the password to onSuccess
      } else {
        setError("Invalid password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="password">Enter your wallet password</Label>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit">Unlock Wallet</Button>
    </form>
  );
};
