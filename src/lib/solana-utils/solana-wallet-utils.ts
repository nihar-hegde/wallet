import { Keypair } from "@solana/web3.js";
import { cryptoUtils } from "./encrypt-decrypt-utils";
import { browserStorage } from "./storage-utils";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { passwordManager } from "./password-manager-utils";

export const walletUtils = {
  async createWallet(password: string, recoveryPhrase: string) {
    const encryptedPhrase = await cryptoUtils.encrypt(recoveryPhrase, password);
    await browserStorage.set("encryptedPhrase", encryptedPhrase);
    await passwordManager.setPassword(password);

    const firstAccount = await this.createAccount(recoveryPhrase, 0, password);
    await browserStorage.set("accounts", JSON.stringify([firstAccount]));
  },

  async walletExists(): Promise<boolean> {
    const encryptedPhrase = await browserStorage.get("encryptedPhrase");
    return !!encryptedPhrase;
  },

  async addAccount(password: string) {
    console.log("Starting addAccount process");
    try {
      const encryptedPhrase = await browserStorage.get("encryptedPhrase");
      console.log("Retrieved encryptedPhrase:", !!encryptedPhrase);

      if (!encryptedPhrase) {
        throw new Error("No wallet found!");
      }

      console.log("Decrypting recovery phrase");
      const recoveryPhrase = await cryptoUtils.decrypt(
        encryptedPhrase,
        password
      );
      console.log("Recovery phrase decrypted successfully");

      console.log("Retrieving existing accounts");
      const existingAccounts = JSON.parse(
        (await browserStorage.get("accounts")) || "[]"
      );
      console.log("Number of existing accounts:", existingAccounts.length);

      console.log("Creating new account");
      const newAccount = await this.createAccount(
        recoveryPhrase,
        existingAccounts.length,
        password
      );
      console.log("New account created:", newAccount.publicKey);

      existingAccounts.push(newAccount);
      console.log("Storing updated accounts");
      await browserStorage.set("accounts", JSON.stringify(existingAccounts));
      console.log("Accounts stored successfully");

      return newAccount.publicKey;
    } catch (error) {
      console.error("Error in addAccount:", error);
      throw error;
    }
  },

  async createAccount(mnemonic: string, index: number, password: string) {
    console.log("Starting createAccount process");
    try {
      const seed = await bip39.mnemonicToSeed(mnemonic);
      console.log("Seed generated");

      const derivationPath = `m/44'/501'/${index}'/0'`;
      console.log("Using derivation path:", derivationPath);

      const keypair = Keypair.fromSeed(
        derivePath(derivationPath, seed.toString("hex")).key
      );

      console.log("Keypair generated");

      const encryptedPrivateKey = await cryptoUtils.encrypt(
        Buffer.from(keypair.secretKey).toString("hex"),
        password
      );
      console.log("Private key encrypted");

      return {
        publicKey: keypair.publicKey.toBase58(),
        encryptedPrivateKey,
        index,
        name: `Account ${index + 1}`,
      };
    } catch (error) {
      console.error("Error in createAccount:", error);
      throw error;
    }
  },

  async getAccounts() {
    const accounts = JSON.parse((await browserStorage.get("accounts")) || "[]");
    return accounts;
  },

  async getPrivateKey(publicKey: string, password: string) {
    const accounts = await this.getAccounts();
    const account = accounts.find((acc: any) => acc.publicKey === publicKey);
    if (!account) throw new Error("Account not found");

    return cryptoUtils.decrypt(account.encryptedPrivateKey, password);
  },

  async verifyPassword(password: string) {
    const encryptedPhrase = await browserStorage.get("encryptedPhrase");
    console.log(
      "Verifying password, encrypted phrase exists:",
      !!encryptedPhrase
    );

    if (!encryptedPhrase) return false;

    try {
      await cryptoUtils.decrypt(encryptedPhrase, password);
      console.log("Password verification successful");
      return true;
    } catch (error) {
      console.error("Password verification failed:", error);
      return false;
    }
  },

  async verifyAndDecryptMnemonic(password: string): Promise<string> {
    const isValid = await this.verifyPassword(password);
    if (!isValid) throw new Error("Invalid password");

    const encryptedMnemonic = await browserStorage.get("encryptedPhrase");
    return cryptoUtils.decrypt(encryptedMnemonic, password);
  },
};
