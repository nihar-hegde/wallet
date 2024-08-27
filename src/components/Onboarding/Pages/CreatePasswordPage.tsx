import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

export const CreatePasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {};
  return (
    <div className="w-full flex items-center justify-center">
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
            type="confirmPassword"
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
  );
};
