import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface MnemonicDisplayProps {
  phrase: string;
  showCopyOption?: boolean;
}

export const MnemonicDisplay: React.FC<MnemonicDisplayProps> = ({
  phrase,
  showCopyOption = true,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(phrase);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="bg-neutral-900 p-5 rounded-xl flex items-center gap-6 flex-col">
      <div className="grid grid-cols-3 gap-4 w-full">
        {phrase.split(" ").map((word, index) => (
          <div key={index} className="p-4 bg-neutral-950 rounded-xl">
            <p>
              {index + 1}. {word}
            </p>
          </div>
        ))}
      </div>
      {showCopyOption && (
        <>
          <Separator />
          <div>
            <Button onClick={handleCopyToClipboard} variant="ghost">
              {isCopied ? "Copied!" : "Click to copy phrase"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
