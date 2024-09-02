import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
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
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    <div className="">
      <div className="w-full max-w-md bg-neutral-900 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
          </div>
          <div className="space-y-4">
            <Button
              onClick={() => setIsShowMnemonicModalOpen(true)}
              className="w-full "
            >
              Show Secret Recovery Phrase
            </Button>
            <Button
              onClick={() => setIsShowKeysModalOpen(true)}
              className="w-full"
            >
              Show Account Keys
            </Button>
            <Button
              onClick={() => setIsDeleteWalletModalOpen(true)}
              variant="destructive"
              className="w-full"
            >
              Delete Wallet
            </Button>
          </div>
        </div>
      </div>
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
