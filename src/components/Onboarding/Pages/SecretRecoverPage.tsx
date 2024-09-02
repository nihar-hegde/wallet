import { Button } from "@/components/ui/button";
import {
  secretRecoveryPhrase,
  selectedBlockChain,
} from "@/Recoil/atoms/onboardingAtoms";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { generateRecoveryPhrase } from "@/lib/solana-utils/solana-utils";
import { MnemonicDisplay } from "@/components/Shared/MnemonicDisplay";

export const SecretRecoveryPage = () => {
  const [phrase, setPhrase] = useState("");
  const [recoilPhrase, setRecoilPhrase] = useRecoilState(secretRecoveryPhrase);
  const blockchain = useRecoilValue(selectedBlockChain);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    console.log("Secret Phrase: ", recoilPhrase);
    console.log("Blockchian: ", blockchain);
    router.push("/onboarding/5");
  };

  const handleCheckBoxClick = (checked: boolean) => {
    setChecked(checked);
  };

  const handleGeneratePhrase = () => {
    const newPhrase = generateRecoveryPhrase();
    setPhrase(newPhrase);
    setRecoilPhrase(newPhrase);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center flex-col gap-6">
        <h1 className="font-extrabold text-5xl">Secret Recovery Phrase!</h1>
        <p className="text-xl font-medium text-gray-200/90">
          Save these in a Safe Place.
        </p>
        <p className="text-sm text-gray-200/90">
          The order matters here so make sure you save it in the exact order it
          is displayed here.
        </p>
      </div>
      {!phrase ? (
        <Button
          onClick={handleGeneratePhrase}
          className="font-bold py-2 px-4 rounded"
        >
          Click here to Generate Recovery Phrase
        </Button>
      ) : (
        <div>
          <MnemonicDisplay phrase={phrase} />

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center space-x-2 max-w-xl mt-6">
              <Checkbox
                id="terms"
                checked={checked}
                onCheckedChange={handleCheckBoxClick}
              />
              <label
                htmlFor="terms"
                className="text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I have Saved the Phrase in a safe place.
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
      )}
    </div>
  );
};
