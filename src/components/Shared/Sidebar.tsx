import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusCircle, Settings } from "lucide-react";

interface Account {
  name: string;
  publicKey: string;
}

interface SidebarProps {
  accounts: Account[];
  onSelectAccount: (publicKey: string) => void;
  onAddAccount: () => void;
  selectedAccountPublicKey: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  accounts,
  onSelectAccount,
  onAddAccount,
  selectedAccountPublicKey,
}) => {
  return (
    <div className="w-64 bg-background p-4 rounded-lg border border-border flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-4 text-foreground">Accounts</h2>
        <ul className="space-y-2">
          {accounts.map((account) => (
            <li
              key={account.publicKey}
              className={cn(
                "rounded-md transition-colors duration-200",
                selectedAccountPublicKey === account.publicKey
                  ? "bg-primary"
                  : "bg-secondary hover:bg-secondary/80"
              )}
            >
              <Button
                variant="ghost"
                onClick={() => onSelectAccount(account.publicKey)}
                className={cn(
                  "w-full flex justify-start items-center py-2 px-3",
                  selectedAccountPublicKey === account.publicKey
                    ? "text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    : "text-secondary-foreground hover:text-secondary-foreground/80"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                    selectedAccountPublicKey === account.publicKey
                      ? "bg-primary-foreground text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {account.name.charAt(0).toUpperCase()}
                </div>
                {account.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground border-border"
          onClick={onAddAccount}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Account
        </Button>
        <Button
          variant="outline"
          className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground border-border"
          onClick={onAddAccount}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};
