import { Keypair } from "@solana/web3.js";
import { cryptoUtils } from "./encrypt-decrypt-utils";
import { browserStorage } from "./storage-utils";
import bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";

export const walletUtils = {
  async createWallet(password: string, recoveryPhrase: string) {
    const encryptedPhrase = await cryptoUtils.encrypt(recoveryPhrase, password);
    await browserStorage.set("encryptedPhrase", encryptedPhrase);

    const firstAccount = await this.createAccount(recoveryPhrase, 0, password);
    await browserStorage.set("accounts", JSON.stringify([firstAccount]));
  },

  async createAccount(mnemonic: string, index: number, password: string) {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const derivationPath = `m/44'/501'/${index}'/0'`;
    const keyPair = Keypair.fromSeed(
      derivePath(derivationPath, seed.toString("hex")).key
    );

    const encryptedPrivateKey = await cryptoUtils.encrypt(
      Buffer.from(keyPair.secretKey).toString("hex"),
      password
    );

    return {
      publicKey: keyPair.publicKey.toBase58(),
      encryptedPrivateKey,
    };
  },

  async addAccount(password: string) {
    const encryptedPhrase = await browserStorage.get("encryptedPhrase");
    if (!encryptedPhrase) throw new Error("No wallet found!");

    const recoveryPhrase = await cryptoUtils.decrypt(encryptedPhrase, password);

    const existingAccounts = (await browserStorage.get("accounts")) || "[]";

    const accounts = JSON.parse(existingAccounts);

    const newAccount = await this.createAccount(
      recoveryPhrase,
      accounts.length(),
      password
    );

    accounts.push(newAccount);

    await browserStorage.set("accounts", JSON.stringify(accounts));

    return newAccount.publicKey;
  },

  async getAccounts() {
    const accounts = JSON.parse((await browserStorage.get("accounts")) || "[]");
    return accounts.map((accounts: any) => accounts.publicKey);
  },

  async getPrivateKey(publicKey: string, password: string) {
    const accounts = JSON.parse((await browserStorage.get("accounts")) || "[]");
    const account = accounts.find((acc: any) => acc.publicKey === publicKey);

    if (!account) throw new Error("Account not found");

    const decryptedPrivateKey = await cryptoUtils.decrypt(
      account.encryptedPrivateKey,
      password
    );
    return decryptedPrivateKey;
  },

  async verifyPassword(password: string) {
    const encryptedPhrase = await browserStorage.get("encryptedPhrase");
    if (!encryptedPhrase) throw new Error("No wallet found");

    try {
      await cryptoUtils.decrypt(encryptedPhrase, password);
      return true;
    } catch {
      return false;
    }
  },
};
