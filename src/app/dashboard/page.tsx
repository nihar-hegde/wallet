"use client";
import { PasswordVerification } from "@/components/Onboarding/PasswordConfirm";
import { Dashboard } from "@/components/Shared/Dashboard";
import React, { useState } from "react";

const DashboardPage = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!isUnlocked) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="bg-neutral-900 p-10 rounded-xl w-[400px]">
          <PasswordVerification onSuccess={() => setIsUnlocked(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
