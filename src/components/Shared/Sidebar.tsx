// components/Sidebar.tsx
import React from "react";

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
    <div className="w-64  h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Accounts</h2>
      <ul>
        {accounts.map((account) => (
          <li
            key={account.publicKey}
            className="cursor-pointer  p-2 rounded"
            onClick={() => onSelectAccount(account.publicKey)}
          >
            {account.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
