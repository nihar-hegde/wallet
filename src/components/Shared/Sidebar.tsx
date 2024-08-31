import React from "react";
import { Button } from "@/components/ui/button";

interface Iaccounts {
  name: string;
  publicKey: string;
}

interface SidebarProps {
  accounts: Iaccounts[];
  onSelectAccount: (publicKey: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ accounts, onSelectAccount }) => {
  return (
    <div className=" p-4 border-r">
      <h2 className="text-xl font-bold mb-4">Accounts</h2>
      <ul className="space-y-2">
        {accounts.map((account) => (
          <li key={account.publicKey} className="bg-neutral-950 p-1 rounded-lg">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onSelectAccount(account.publicKey)}
            >
              {account.name}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
