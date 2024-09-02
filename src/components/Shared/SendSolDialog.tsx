import React, { useState, useCallback, useEffect } from "react";
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
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );

  const resetState = useCallback(() => {
    setToPublicKey("");
    setAmount("");
    setPassword("");
    setError(null);
    setIsSending(false);
    setTransactionSignature(null);
    setTransactionStatus(null);
  }, []);

  const handleClose = useCallback(() => {
    if (!isSending) {
      resetState();
      onClose();
    }
  }, [isSending, onClose, resetState]);

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
    setTransactionStatus("Initiating transaction...");

    try {
      const { signature, status } = await walletUtils.sendSol(
        fromPublicKey,
        toPublicKey,
        parseFloat(amount),
        password
      );

      setTransactionSignature(signature);
      setTransactionStatus(status);

      if (status === "confirmed" || status === "finalized") {
        onSendComplete(signature);
      }
    } catch (err) {
      console.error("Error sending SOL:", err);
      if (err instanceof Error) {
        setError(`Failed to send SOL: ${err.message}`);
      } else {
        setError("An unknown error occurred. Please try again.");
      }
      setTransactionStatus("failed");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (transactionSignature && transactionStatus === "processing") {
      intervalId = setInterval(async () => {
        try {
          const status = await walletUtils.checkTransactionStatus(
            transactionSignature
          );
          setTransactionStatus(status);
          if (status === "confirmed" || status === "finalized") {
            onSendComplete(transactionSignature);
            clearInterval(intervalId);
          } else if (status === "failed") {
            setError("Transaction failed. Please try again.");
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error("Error checking transaction status:", error);
        }
      }, 5000); // Check every 5 seconds
    }
    return () => clearInterval(intervalId);
  }, [transactionSignature, transactionStatus, onSendComplete]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send SOL</DialogTitle>
        </DialogHeader>
        {!transactionSignature ? (
          <div className="space-y-4">
            {/* ... (keep your existing input fields) */}
          </div>
        ) : (
          <div className="space-y-4">
            <p>Transaction {transactionStatus}</p>
            <p>Signature: {transactionSignature}</p>
            {transactionStatus === "processing" && (
              <p>
                This may take a while. You can close this dialog and check the
                status later.
              </p>
            )}
          </div>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <DialogFooter>
          {!transactionSignature ? (
            <Button onClick={handleSendSol} disabled={isSending}>
              {isSending ? "Sending..." : "Send SOL"}
            </Button>
          ) : (
            <Button onClick={handleClose} disabled={isSending}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
