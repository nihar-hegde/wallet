import { Button } from "@/components/ui/button";
import { selectedBlockChain } from "@/Recoil/atoms/onboardingAtoms";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useSetRecoilState } from "recoil";

export const SelectBlockChainPage = () => {
  const setSelectedBlockChain = useSetRecoilState(selectedBlockChain);
  const router = useRouter();
  const handleClick = () => {
    setSelectedBlockChain("solana");
    router.push("/onboarding/3");
  };
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-6xl font-bold">Select Network</h1>
        <p>Wallet Supports only Solana Network!</p>
      </div>
      <div className="flex items-center w-full">
        <Button
          onClick={handleClick}
          className="bg-gray-900 w-full h-16 rounded-xl flex flex-row gap-2 hover:bg-gray-800 "
        >
          <Image src={"/solana.svg"} alt="Sol Logo" width={18} height={18} />
          <p className="text-gray-200 font-semibold text-2xl ">Solana</p>
        </Button>
      </div>
    </div>
  );
};
