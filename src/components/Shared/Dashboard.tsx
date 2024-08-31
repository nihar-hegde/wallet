import React, { useState, useEffect } from "react";
import { walletUtils } from "@/lib/solana-utils/solana-wallet-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Send, RefreshCw, DollarSign } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { CopyButton } from "./CopyToClipboard";

export const Dashboard = () => {
  const [accounts, setAccounts] = useState<
    Array<{ name: string; publicKey: string }>
  >([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isPrivateKeyDialogOpen, setIsPrivateKeyDialogOpen] = useState(false);
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const accountList = await walletUtils.getAccounts();
    setAccounts(accountList);
  };

  const handleSelectAccount = (publicKey: string) => {
    setSelectedAccount(publicKey);
    setPrivateKey("");
    setError("");
  };

  const handleAddAccount = async () => {
    setIsAddingAccount(true);
    setError("");
    try {
      const newPublicKey = await walletUtils.addAccount(password);
      await loadAccounts(); // Reload the accounts to include the new one
      setIsAddAccountDialogOpen(false);
      setPassword("");
      // Optionally, select the newly added account
      setSelectedAccount(newPublicKey);
    } catch (error) {
      setError(
        "Failed to add account. Please check your password and try again."
      );
    } finally {
      setIsAddingAccount(false);
    }
  };

  const handleShowPrivateKey = async () => {
    setIsDecrypting(true);
    try {
      const decryptedPrivateKey = await walletUtils.getPrivateKey(
        selectedAccount!,
        password
      );
      setPrivateKey(decryptedPrivateKey);
      setError("");
    } catch (error) {
      setError("Invalid password or failed to decrypt private key");
    } finally {
      setIsDecrypting(false);
    }
  };

  const resetPrivateKeyState = () => {
    setPrivateKey("");
    setPassword("");
    setError("");
  };

  const truncatePublicKey = (key: string) =>
    `${key.slice(0, 5)}...${key.slice(-5)}`;

  return (
    <div className="flex p-2 rounded-md bg-neutral-900 text-white h-[600px] w-[800px]">
      <Sidebar
        accounts={accounts}
        onSelectAccount={handleSelectAccount}
        onAddAccount={() => setIsAddAccountDialogOpen(true)}
        selectedAccountPublicKey={selectedAccount}
      />

      <div className="flex-1 p-8">
        {selectedAccount ? (
          <div>
            <h1 className="text-4xl font-bold mb-4">$0.00</h1>
            <p className="text-gray-400 mb-8">+$0.00 +0.00%</p>
            <div className="flex space-x-4 mb-8">
              <Button>
                <Send className="mr-2" /> Send
              </Button>
              <Button>
                <RefreshCw className="mr-2" /> Swap
              </Button>
              <Button>
                <DollarSign className="mr-2" /> Buy
              </Button>
            </div>
            <div className="bg-neutral-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span>Public Key:</span>
                <div className="flex items-center">
                  <span>{truncatePublicKey(selectedAccount)}</span>
                  <CopyButton text={selectedAccount} />
                </div>
              </div>
              <Button
                onClick={() => setIsPrivateKeyDialogOpen(true)}
                className="w-full"
              >
                Show Private Key
              </Button>
            </div>
          </div>
        ) : (
          <p>Select an account to view details</p>
        )}
      </div>

      {/* Private Key Dialog */}
      <Dialog
        open={isPrivateKeyDialogOpen}
        onOpenChange={(open) => {
          setIsPrivateKeyDialogOpen(open);
          if (!open) resetPrivateKeyState();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {privateKey ? "Private Key" : "Enter Password"}
            </DialogTitle>
          </DialogHeader>
          {!privateKey ? (
            <>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <DialogFooter>
                <Button onClick={handleShowPrivateKey} disabled={isDecrypting}>
                  {isDecrypting ? "Decrypting..." : "Decrypt Private Key"}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono break-all">
                  {truncatePublicKey(privateKey)}
                </span>
                <CopyButton text={privateKey} />
              </div>
              <DialogFooter>
                <Button onClick={resetPrivateKeyState}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Account Dialog */}
      <Dialog
        open={isAddAccountDialogOpen}
        onOpenChange={(open) => {
          setIsAddAccountDialogOpen(open);
          if (!open) {
            setPassword("");
            setError("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
          </DialogHeader>
          <Input
            type="password"
            placeholder="Enter wallet password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <DialogFooter>
            <Button onClick={handleAddAccount} disabled={isAddingAccount}>
              {isAddingAccount ? "Adding Account..." : "Add Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
