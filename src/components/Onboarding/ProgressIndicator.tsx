import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  return (
    <div className="flex justify-center space-x-6 mt-8">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={cn("w-3 h-3 rounded-full", {
            "bg-purple-500/20": index + 1 < currentStep,
            "bg-purple-500": index + 1 === currentStep,
            "bg-gray-400/20": index + 1 > currentStep,
          })}
        />
      ))}
    </div>
  );
}
