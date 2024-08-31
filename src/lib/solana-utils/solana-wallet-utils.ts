import { Keypair } from "@solana/web3.js";
import { cryptoUtils } from "./encrypt-decrypt-utils";
import { browserStorage } from "./storage-utils";
import { derivePath } from "ed25519-hd-key";
import { passwordManager } from "./password-manager-utils";
import { mnemonicToSeedSync } from "bip39";
import nacl from "tweetnacl";
import bs58 from "bs58";

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

      if (!encryptedPhrase) {
        throw new Error("No wallet found!");
      }

      const recoveryPhrase = await cryptoUtils.decrypt(
        encryptedPhrase,
        password
      );

      const existingAccounts = JSON.parse(
        (await browserStorage.get("accounts")) || "[]"
      );

      const newAccount = await this.createAccount(
        recoveryPhrase,
        existingAccounts.length,
        password
      );

      existingAccounts.push(newAccount);

      await browserStorage.set("accounts", JSON.stringify(existingAccounts));

      return newAccount.publicKey;
    } catch (error) {
      console.error("Error in addAccount:", error);
      throw error;
    }
  },

  async createAccount(mnemonic: string, index: number, password: string) {
    try {
      const seed = mnemonicToSeedSync(mnemonic);

      const derivationPath = `m/44'/501'/${index}'/0'`;

      const derivedSeed = derivePath(derivationPath, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const keypair = Keypair.fromSecretKey(secret);

      const base58PrivateKey = bs58.encode(secret);

      const encryptedPrivateKey = await cryptoUtils.encrypt(
        base58PrivateKey,
        password
      );

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
