export const cryptoUtils = {
  async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    const derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    console.log("Derived key:", derivedKey);
    return derivedKey;
  },

  async encrypt(data: string, password: string): Promise<string> {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const key = await this.deriveKey(password, salt);
    const enc = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      enc.encode(data)
    );

    const encryptedData = new Uint8Array(encrypted);
    const result = new Uint8Array(
      salt.length + iv.length + encryptedData.length
    );
    result.set(salt, 0);
    result.set(iv, salt.length);
    result.set(encryptedData, salt.length + iv.length);

    console.log("Encryption details:", {
      saltLength: salt.length,
      ivLength: iv.length,
      encryptedDataLength: encryptedData.length,
      totalLength: result.length,
    });

    return btoa(String.fromCharCode.apply(null, Array.from(result)));
  },

  async decrypt(encryptedData: string, password: string): Promise<string> {
    try {
      const data = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));
      console.log("Decryption input length:", data.length);

      const salt = data.slice(0, 16);
      const iv = data.slice(16, 28);
      const content = data.slice(28);

      console.log("Decryption details:", {
        saltLength: salt.length,
        ivLength: iv.length,
        contentLength: content.length,
      });

      const key = await this.deriveKey(password, salt);

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        content
      );

      const dec = new TextDecoder();
      return dec.decode(decrypted);
    } catch (error: any) {
      console.error("Detailed decryption error:", error);
      throw new Error(`Failed to decrypt data: ${error.message}`);
    }
  },

  compareArrays(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  },
};
