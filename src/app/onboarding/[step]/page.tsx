"use client";

import ProgressIndicator from "@/components/Onboarding/ProgressIndicator";
import { useRouter } from "next/navigation";
import React from "react";

const steps = [
  { title: "Welcome", content: "Welcome to our app!" },
  { title: "Create Username", content: "Please choose a username." },
  { title: "Additional Info", content: "Tell us more about yourself." },
  { title: "Preferences", content: "Set your preferences." },
  { title: "Finish", content: "You're all set!" },
];

const OnboardingPage = ({ params }: { params: { step: string } }) => {
  const router = useRouter();
  const currentStep = Number(params.step) - 1;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <div>Welcome create wallet</div>;
      case 2:
        return <div>Select block chain</div>;
      case 3:
        return <div>Recovery phrase warning</div>;
      case 4:
        return <div>Dispaly the generated recover phrase</div>;
      case 5:
        return <div>Crate new password</div>;
      case 6:
        return <div>Finish button to dashboard</div>;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      router.push(`/onboarding/${currentStep + 2}`);
    } else {
      // Finish onboarding
      router.push("/dashboard");
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
      <p className="mb-6">{steps[currentStep].content}</p>
      <div>{renderStep()}</div>
      <button
        onClick={handleNext}
        className="px-6 py-3 bg-blue-500  rounded-lg hover:bg-blue-600 transition-colors"
      >
        {currentStep === steps.length - 1 ? "Finish" : "Continue"}
      </button>
      <div>
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={steps.length}
        />
      </div>
    </div>
  );
};

export default OnboardingPage;
