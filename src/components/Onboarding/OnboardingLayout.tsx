import { ReactNode } from "react";
import ProgressIndicator from "./ProgressIndicator";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
}: OnboardingLayoutProps) {
  return (
    <div className=" flex flex-col items-center justify-center min-h-screen ">
      <div>{children}</div>
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
    </div>
  );
}
