"use client";

import { CreatePasswordPage } from "@/components/Onboarding/Pages/CreatePasswordPage";
import { RecoveryPhraseWarning } from "@/components/Onboarding/Pages/RecoverPhraseWarning";
import { SecretRecoveryPage } from "@/components/Onboarding/Pages/SecretRecoverPage";
import { SelectBlockChainPage } from "@/components/Onboarding/Pages/SelectBlockChainPage";
import { SuccessPage } from "@/components/Onboarding/Pages/SuccessPage";
import { Welcome } from "@/components/Onboarding/Pages/Welcome";
import ProgressIndicator from "@/components/Onboarding/ProgressIndicator";
import { useRouter } from "next/navigation";
import React from "react";

const steps = [
  { title: "Welcome", content: "Welcome to our app!" },
  { title: "Choose Block chain", content: "Please choose a blockchain." },
  {
    title: "Recovery Warning page",
    content: "Warning message for the recovery page.",
  },
  {
    title: "Recovery Phrase",
    content: "Generate and save your recovery phrase.",
  },
  { title: "Create Password", content: "Generate a local password" },
  { title: "Success", content: "You're all set!" },
];

const OnboardingPage = ({ params }: { params: { step: string } }) => {
  const router = useRouter();
  const currentStep = Number(params.step);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Welcome />;
      case 2:
        return <SelectBlockChainPage />;
      case 3:
        return <RecoveryPhraseWarning />;
      case 4:
        return <SecretRecoveryPage />;
      case 5:
        return <CreatePasswordPage />;
      case 6:
        return <SuccessPage />;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      router.push(`/onboarding/${currentStep + 2}`);
    } else {
      router.push("/dashboard");
    }
  };
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <div className=" flex items-center justify-center w-full h-full pt-8 ">
        {renderStep()}
      </div>
      <div className=" w-full p-8">
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={steps.length}
        />
      </div>
    </div>
  );
};

export default OnboardingPage;
