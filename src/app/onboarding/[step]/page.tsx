import React from "react";

const steps = [
  { title: "Welcome", content: "Welcome to our app!" },
  { title: "Create Username", content: "Please choose a username." },
  { title: "Additional Info", content: "Tell us more about yourself." },
  { title: "Preferences", content: "Set your preferences." },
  { title: "Finish", content: "You're all set!" },
];

const OnboardingPage = ({ params }: { params: { step: string } }) => {
  const currentStep = Number(params.step);
  return (
    <div>
      <div></div>
    </div>
  );
};

export default OnboardingPage;
