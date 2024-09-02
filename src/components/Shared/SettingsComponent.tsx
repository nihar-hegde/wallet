import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { walletUtils } from "@/lib/solana-utils/solana-wallet-utils";
import { browserStorage } from "@/lib/solana-utils/storage-utils";
import { CopyButton } from "./CopyToClipboard";

interface SettingsPageProps {
  selectedAccountPublicKey: string | null;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  selectedAccountPublicKey,
}) => {
  const [isShowMnemonicModalOpen, setIsShowMnemonicModalOpen] = useState(false);
  const [isShowKeysModalOpen, setIsShowKeysModalOpen] = useState(false);
  const [isDeleteWalletModalOpen, setIsDeleteWalletModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleShowMnemonic = async () => {
    try {
      const decryptedMnemonic = await walletUtils.verifyAndDecryptMnemonic(
        password
      );
      setMnemonic(decryptedMnemonic);
      setError("");
    } catch (err) {
      setError("Invalid password or failed to decrypt mnemonic");
    }
  };

  const handleShowKeys = async () => {
    if (!selectedAccountPublicKey) {
      setError("No account selected");
      return;
    }
    try {
      const decryptedPrivateKey = await walletUtils.getPrivateKey(
        selectedAccountPublicKey,
        password
      );
      setPublicKey(selectedAccountPublicKey);
      setPrivateKey(decryptedPrivateKey);
      setError("");
    } catch (err) {
      setError("Invalid password or failed to decrypt keys");
    }
  };

  const handleDeleteWallet = async () => {
    try {
      await browserStorage.clear();
      router.push("/");
    } catch (err) {
      setError("Failed to delete wallet data");
    }
  };

  const renderMnemonicWords = (phrase: string) => {
    return phrase.split(" ").map((word, index) => (
      <div key={index} className="p-2 bg-neutral-800 rounded-md">
        <p>
          {index + 1}. {word}
        </p>
      </div>
    ));
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <Button onClick={() => setIsShowMnemonicModalOpen(true)}>
        Show Secret Recovery Phrase
      </Button>
      <Button onClick={() => setIsShowKeysModalOpen(true)}>
        Show Account Keys
      </Button>
      <Button
        onClick={() => setIsDeleteWalletModalOpen(true)}
        variant="destructive"
      >
        Delete Wallet
      </Button>

      <Dialog
        open={isShowMnemonicModalOpen}
        onOpenChange={setIsShowMnemonicModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Show Secret Recovery Phrase</DialogTitle>
          </DialogHeader>
          {!mnemonic ? (
            <>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-500">{error}</p>}
              <DialogFooter>
                <Button onClick={handleShowMnemonic}>Show Phrase</Button>
              </DialogFooter>
            </>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {renderMnemonicWords(mnemonic)}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isShowKeysModalOpen} onOpenChange={setIsShowKeysModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Show Account Keys</DialogTitle>
          </DialogHeader>
          {!privateKey ? (
            <>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-500">{error}</p>}
              <DialogFooter>
                <Button onClick={handleShowKeys}>Show Keys</Button>
              </DialogFooter>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Public Key:</h3>
                <div className="flex items-center space-x-2">
                  <Input value={publicKey} readOnly />
                  <CopyButton text={publicKey} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Private Key:</h3>
                <div className="flex items-center space-x-2">
                  <Input value={privateKey} type="password" readOnly />
                  <CopyButton text={privateKey} />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteWalletModalOpen}
        onOpenChange={setIsDeleteWalletModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Wallet</DialogTitle>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This action will permanently delete all your wallet data. This
              cannot be undone.
            </AlertDescription>
          </Alert>
          {error && <p className="text-red-500">{error}</p>}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteWalletModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteWallet}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
