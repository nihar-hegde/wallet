import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { walletUtils } from "@/lib/solana-utils/solana-wallet-utils";
import { PublicKey } from "@solana/web3.js";

interface SendSolDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fromPublicKey: string;
  balance: number;
  onSendComplete: (signature: string) => void;
}

export const SendSolDialog: React.FC<SendSolDialogProps> = ({
  isOpen,
  onClose,
  fromPublicKey,
  balance,
  onSendComplete,
}) => {
  const [toPublicKey, setToPublicKey] = useState("");
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >(null);

  const resetState = useCallback(() => {
    setToPublicKey("");
    setAmount("");
    setPassword("");
    setError(null);
    setIsSending(false);
    setTransactionSignature(null);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  const validateInputs = () => {
    if (!toPublicKey || !amount || !password) {
      setError("All fields are required");
      return false;
    }

    try {
      new PublicKey(toPublicKey);
    } catch (err) {
      setError("Invalid recipient public key");
      return false;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Invalid amount");
      return false;
    }

    if (amountNum > balance) {
      setError("Insufficient balance");
      return false;
    }

    return true;
  };

  const handleSendSol = async () => {
    if (!validateInputs()) return;

    setIsSending(true);
    setError(null);

    try {
      const signature = await walletUtils.sendSol(
        fromPublicKey,
        toPublicKey,
        parseFloat(amount),
        password
      );
      console.log("Transaction successful. Signature:", signature);
      setTransactionSignature(signature);
      onSendComplete(signature);
    } catch (err) {
      console.error("Error sending SOL:", err);
      if (err instanceof Error) {
        if (err.message.includes("password")) {
          setError("Incorrect password");
        } else {
          setError(`Failed to send SOL: ${err.message}`);
        }
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send SOL</DialogTitle>
        </DialogHeader>
        {!transactionSignature ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="toPublicKey">Recipient Public Key</Label>
              <Input
                id="toPublicKey"
                value={toPublicKey}
                onChange={(e) => setToPublicKey(e.target.value)}
                placeholder="Enter recipient's public key"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount (SOL)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to send"
                min="0"
                step="0.000000001"
              />
              <p className="text-sm text-gray-500 mt-1">
                Available balance: {balance} SOL
              </p>
            </div>
            <div>
              <Label htmlFor="password">Wallet Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your wallet password"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p>Transaction successful!</p>
            <p>Signature: {transactionSignature}</p>
          </div>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <DialogFooter>
          {!transactionSignature ? (
            <Button onClick={handleSendSol} disabled={isSending}>
              {isSending ? "Sending..." : "Send SOL"}
            </Button>
          ) : (
            <Button onClick={handleClose}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
