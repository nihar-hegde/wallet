import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  passwordHash,
  secretRecoveryPhrase,
} from "@/Recoil/atoms/onboardingAtoms";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import bcryptjs from "bcryptjs";

export const CreatePasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const setPasswordHash = useSetRecoilState(passwordHash);
  const setRecoveryPhrase = useSetRecoilState(secretRecoveryPhrase);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Password do not match!");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 charecters long!");
      return;
    }

    try {
      const hash = await bcryptjs.hash(password, 10);
      setPasswordHash(hash);
    } catch (error) {
      setError(
        "An error occurred while setting up your wallet. Please try again.",
      );
      console.log(error);
    }

    console.log(password);
  };

  return (
    <div className="w-full flex flex-col gap-12 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-semibold ">Create a new password!</h1>
        <p className="text-sm">
          The password must contain at least 8 charecters.
        </p>
      </div>
      <div>
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center flex-col gap-6 w-96"
        >
          <div className="w-96 flex flex-col gap-2">
            <Label htmlFor="password">Enter your password.</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="w-96 flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirm your password.</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-96">
            Create Password
          </Button>
        </form>
      </div>
    </div>
  );
};
