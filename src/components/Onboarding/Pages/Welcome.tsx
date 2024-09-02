import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import Link from "next/link";
import React from "react";

export const Welcome = () => {
  return (
    <div className="flex items-center justify-center  w-[600px] h-[500px]">
      <Card className="w-full h-full flex flex-col items-center justify-center">
        <CardHeader className="items-center">
          <Wallet className="h-20 w-20 text-primary mb-4" />
          <CardTitle className="text-2xl font-semibold text-center">
            Welcome to CryptoVault
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Link
            href="/onboarding/2"
            className={buttonVariants({ size: "lg", className: "w-full" })}
          >
            Create a New Wallet
          </Link>
          <Link
            href="/recover-account"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full",
            })}
          >
            Recover Existing Wallet
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
