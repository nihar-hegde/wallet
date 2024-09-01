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

interface AddAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (password: string) => Promise<void>;
}

export const AddAccountDialog: React.FC<AddAccountDialogProps> = ({
  isOpen,
  onClose,
  onAddAccount,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async () => {
    setIsAdding(true);
    setError(null);
    try {
      await onAddAccount(password);
      setPassword("");
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          <Button onClick={handleSubmit} disabled={isAdding}>
            {isAdding ? "Adding Account..." : "Add Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
