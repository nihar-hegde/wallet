import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, RefreshCw, DollarSign } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useAccounts } from "@/hooks/useAccounts";
import { useBalance } from "@/hooks/useBalance";
import { AddAccountDialog } from "./AddAccountDialog";
import { PrivateKeyDialog } from "./PrivateKeyDialog";
import { AccountDetails } from "./AccountDetails";
import { SendSolDialog } from "./SendSolDialog";

export const Dashboard = () => {
  const {
    accounts,
    selectedAccount,
    setSelectedAccount,
    addAccount,
    isLoading: isLoadingAccounts,
    error: accountsError,
  } = useAccounts();
  const {
    balance,
    isLoading: isLoadingBalance,
    error: balanceError,
    requestAirdrop,
    refetchBalance,
  } = useBalance(selectedAccount);

  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [isPrivateKeyDialogOpen, setIsPrivateKeyDialogOpen] = useState(false);
  const [isSendSolDialogOpen, setIsSendSolDialogOpen] = useState(false);

  const handleAddAccount = async (password: string) => {
    try {
      await addAccount(password);
      setIsAddAccountDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAirDrop = async () => {
    try {
      await requestAirdrop();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendComplete = () => {
    refetchBalance();
  };

  if (isLoadingAccounts) {
    return <div>Loading accounts...</div>;
  }

  if (accountsError) {
    return <div>Error: {accountsError}</div>;
  }

  return (
    <div className="flex p-2 rounded-md bg-neutral-900 text-white h-[600px] w-[800px]">
      <Sidebar
        accounts={accounts}
        onSelectAccount={setSelectedAccount}
        onAddAccount={() => setIsAddAccountDialogOpen(true)}
        selectedAccountPublicKey={selectedAccount}
      />

      <div className="flex-1 p-8">
        {selectedAccount ? (
          <div className="flex flex-col gap-4">
            <AccountDetails
              account={accounts.find(
                (acc) => acc.publicKey === selectedAccount
              )}
              balance={balance}
              isLoadingBalance={isLoadingBalance}
              balanceError={balanceError}
              onShowPrivateKey={() => setIsPrivateKeyDialogOpen(true)}
            />
            <div className="flex space-x-4 mb-8">
              <Button onClick={handleAirDrop}>Request air drop</Button>
              <Button>
                <Send className="mr-2" /> Send
              </Button>
              <Button disabled>
                <RefreshCw className="mr-2" /> Swap
              </Button>
              <Button disabled>
                <DollarSign className="mr-2" /> Buy
              </Button>
            </div>
          </div>
        ) : (
          <p>Select an account to view details</p>
        )}
      </div>

      <AddAccountDialog
        isOpen={isAddAccountDialogOpen}
        onClose={() => setIsAddAccountDialogOpen(false)}
        onAddAccount={handleAddAccount}
      />

      <PrivateKeyDialog
        isOpen={isPrivateKeyDialogOpen}
        onClose={() => setIsPrivateKeyDialogOpen(false)}
        publicKey={selectedAccount}
      />
      {selectedAccount && (
        <SendSolDialog
          isOpen={isSendSolDialogOpen}
          onClose={() => setIsSendSolDialogOpen(false)}
          fromPublicKey={selectedAccount}
          balance={balance}
          onSendComplete={handleSendComplete}
        />
      )}
    </div>
  );
};
