"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LockKeyhole, OctagonAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export const RecoveryPhraseWarning = () => {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    router.push("/onboarding/4");
  };

  const handleCheckBoxClick = (checked: boolean) => {
    setChecked(checked);
  };

  return (
    <div className="flex items-center justify-center flex-col  gap-8">
      <div className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-5xl font-extrabold">
          Secret Recovery Phrase Warning
        </h1>
        <h2 className="text-xl font-semibold text-gray-300/90">
          You will receive your secret recover phrase on the Next page.
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-row items-center gap-4 bg-gray-800 p-10 rounded-xl max-w-xl">
          <div>
            <OctagonAlert />
          </div>
          <p>
            This is the <span className="font-bold">ONLY</span> way to recover
            your account if you lose access to your device or password
          </p>
        </div>
        <div className="flex flex-row items-center gap-4 bg-gray-800 p-10 rounded-xl max-w-xl">
          <div>
            <LockKeyhole />
          </div>
          <p>
            Write it down, store it in a safe place, and{" "}
            <span className="font-bold">NEVER</span> share it win anyone.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center space-x-2 max-w-xl mt-8">
            <Checkbox
              id="terms"
              checked={checked}
              onCheckedChange={handleCheckBoxClick}
            />
            <label
              htmlFor="terms"
              className="text-md font-bold    peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I understand that I am responsivle for saving my secret recovery
              phrase, and that it is the only way to recover my wallet.
            </label>
          </div>
          <Button
            onClick={handleClick}
            disabled={!checked}
            className="w-64 rounded-xl "
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
