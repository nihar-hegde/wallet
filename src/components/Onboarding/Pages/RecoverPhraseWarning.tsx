import { CardWrapper } from "@/components/Shared/CardWrapper";
import { LockKeyhole, OctagonAlert } from "lucide-react";
import React from "react";

export const RecoveryPhraseWarning = () => {
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
      </div>
    </div>
  );
};
