import { cryptoUtils } from "./encrypt-decrypt-utils";
import { browserStorage } from "./storage-utils";

export const passwordManager = {
  async setPassword(password: string): Promise<void> {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const key = await cryptoUtils.deriveKey(password, salt);
    const verifier = await window.crypto.subtle.exportKey("raw", key);
    await browserStorage.set("passwordSalt", Array.from(salt));
    await browserStorage.set(
      "passwordVerifier",
      Array.from(new Uint8Array(verifier))
    );
  },

  async verifyPassword(password: string): Promise<boolean> {
    const salt = new Uint8Array(await browserStorage.get("passwordSalt"));
    const storedVerifier = new Uint8Array(
      await browserStorage.get("passwordVerifier")
    );
    const key = await cryptoUtils.deriveKey(password, salt);
    const verifier = await window.crypto.subtle.exportKey("raw", key);
    return cryptoUtils.compareArrays(new Uint8Array(verifier), storedVerifier);
  },
};
