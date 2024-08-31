"use client";
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
import { Copy, Send, RefreshCw, DollarSign } from "lucide-react";

export const Dashboard = () => {
  const [accounts, setAccounts] = useState<
    Array<{ name: string; publicKey: string }>
  >([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isPrivateKeyDialogOpen, setIsPrivateKeyDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const truncatePublicKey = (key: string) =>
    `${key.slice(0, 5)}...${key.slice(-5)}`;

  return (
    <div className="flex h-screen bg-neutral-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-neutral-800 p-4">
        <h2 className="text-xl font-bold mb-4">Accounts</h2>
        <ul className="space-y-2">
          {accounts.map((account) => (
            <li key={account.publicKey}>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => handleSelectAccount(account.publicKey)}
              >
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mr-2">
                  {account.name.charAt(0).toUpperCase()}
                </div>
                {account.name}
              </Button>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <Button variant="outline" className="w-full mt-4">
            <span className="mr-2">+</span> Add Account
          </Button>
        </div>
      </div>

      {/* Main content */}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(selectedAccount)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(privateKey)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <DialogFooter>
                <Button onClick={resetPrivateKeyState}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
