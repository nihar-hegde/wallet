"use client";

import React from "react";
import { useAccounts } from "@/hooks/useAccounts";
import { SettingsPage } from "@/components/Shared/SettingsComponent";

const SettingsPageRoute = () => {
  const { selectedAccount } = useAccounts();

  return (
    <div className="container mx-auto p-4">
      <SettingsPage selectedAccountPublicKey={selectedAccount} />
    </div>
  );
};

export default SettingsPageRoute;
