import { CardWrapper } from "@/components/Shared/CardWrapper";
import React from "react";

export const RecoveryPhraseWarning = () => {
  return (
    <div className="flex items-center justify-center flex-col ">
      <div className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-5xl font-extrabold">
          Secret Recovery Phrase Warning
        </h1>
        <h2 className="text-xl font-semibold text-gray-300/90">
          You will receive your secret recover phrase on the Next page.
        </h2>
      </div>
      <div></div>
    </div>
  );
};
