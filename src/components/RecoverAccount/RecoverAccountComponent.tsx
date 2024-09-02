"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { walletUtils } from "@/lib/solana-utils/solana-wallet-utils";
import { validateMnemonic } from "bip39"; // Make sure to install bip39 package

export const RecoverAccountPage = () => {
  const [mnemonicWords, setMnemonicWords] = useState(Array(12).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    const newMnemonicWords = [...mnemonicWords];
    newMnemonicWords[index] = value.toLowerCase().trim();
    setMnemonicWords(newMnemonicWords);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === " " && index < mnemonicWords.length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const words = pastedText.toLowerCase().trim().split(/\s+/);
    const newMnemonicWords = [...mnemonicWords];
    words.forEach((word, index) => {
      if (index < newMnemonicWords.length) {
        newMnemonicWords[index] = word;
      }
    });
    setMnemonicWords(newMnemonicWords);
    const nextEmptyIndex = newMnemonicWords.findIndex((word) => word === "");
    const focusIndex =
      nextEmptyIndex === -1 ? newMnemonicWords.length - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const validateAndProceed = () => {
    const mnemonic = mnemonicWords.join(" ").trim();
    if (mnemonic.split(" ").length !== 12) {
      setError("Please enter all 12 words of your recovery phrase.");
      return;
    }
    if (!validateMnemonic(mnemonic)) {
      setError("Invalid recovery phrase. Please check and try again.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const mnemonic = mnemonicWords.join(" ").trim();

    try {
      await walletUtils.recoverWallet(mnemonic, password);
      router.push("/dashboard");
    } catch (err) {
      setError(
        "Failed to recover wallet. Please check your recovery phrase and try again."
      );
      console.error(err);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="p-8 bg-neutral-900 rounded-xl max-w-xl flex flex-col gap-6">
        {step === 1 ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold text-center">
              Secret Recovery Phrase
            </h1>
            <p className="text-center text-sm text-gray-500">
              Import an existing wallet with your 12-word secret recovery
              phrase.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-6">
                {mnemonicWords.map((word, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500">{index + 1}.</span>
                    <Input
                      key={index}
                      ref={(el: HTMLInputElement | null) => {
                        inputRefs.current[index] = el;
                      }}
                      value={word}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button onClick={validateAndProceed} className="w-full">
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-4 w-full"
            style={{ minWidth: "400px" }}
          >
            <h1 className="text-2xl font-bold text-center">
              Create a password
            </h1>
            <p className="text-center text-sm text-gray-500">
              Create a new local password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <Input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Import Wallet
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
