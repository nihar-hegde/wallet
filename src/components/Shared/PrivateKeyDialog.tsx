import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./CopyToClipboard";
import { walletUtils } from "@/lib/solana-utils/solana-wallet-utils";

interface PrivateKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  publicKey: string | null;
}

export const PrivateKeyDialog: React.FC<PrivateKeyDialogProps> = ({
  isOpen,
  onClose,
  publicKey,
}) => {
  const [password, setPassword] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handleShowPrivateKey = async () => {
    if (!publicKey) return;
    setIsDecrypting(true);
    setError(null);
    try {
      const decryptedPrivateKey = await walletUtils.getPrivateKey(
        publicKey,
        password
      );
      setPrivateKey(decryptedPrivateKey);
    } catch (err) {
      setError("Invalid password or failed to decrypt private key");
    } finally {
      setIsDecrypting(false);
    }
  };

  const resetState = () => {
    setPassword("");
    setPrivateKey("");
    setError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const truncateKey = (key: string) => `${key.slice(0, 5)}...${key.slice(-5)}`;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
                {truncateKey(privateKey)}
              </span>
              <CopyButton text={privateKey} />
            </div>
            <p className="text-sm text-gray-400">
              Warning: Never share your private key with anyone. It provides
              full control over your account.
            </p>
            <DialogFooter>
              <Button onClick={resetState} className="mr-2">
                Hide Private Key
              </Button>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
