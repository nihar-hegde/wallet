import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { passwordManager } from "@/lib/solana-utils/password-manager-utils";

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
      const isValid = await passwordManager.verifyPassword(password);
      if (isValid) {
        onSuccess(password);
      } else {
        setError("Invalid password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" flex flex-col items-center gap-8 w-full"
    >
      <div className="flex flex-col items-center gap-4 w-full">
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
      <Button type="submit" className="w-full">
        Unlock Wallet
      </Button>
    </form>
  );
};
