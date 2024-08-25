"use client";
import OnboardingLayout from "@/components/Onboarding/OnboardingLayout";
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
      <OnboardingLayout currentStep={currentStep} totalSteps={steps.length}>
        <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
        <p className="mb-6">{steps[currentStep].content}</p>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-500  rounded-lg hover:bg-blue-600 transition-colors"
        >
          {currentStep === steps.length - 1 ? "Finish" : "Continue"}
        </button>
      </OnboardingLayout>
    </div>
  );
};

export default OnboardingPage;
