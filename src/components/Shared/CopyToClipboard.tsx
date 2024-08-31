import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "../ui/button";

interface CopyButtonProps {
  text: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  variant = "ghost",
  size = "icon",
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Revert after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button variant={variant} size={size} onClick={copyToClipboard}>
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
};
