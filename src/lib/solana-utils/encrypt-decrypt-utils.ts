export const cryptoUtils = {
  async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"],
    );
    console.log("DerieKey: ", keyMaterial);

    console.log(
      "RETURN VALUE:  ",
      window.crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 100000,
          hash: "SHA-256",
        },

        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"],
      ),
    );

    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },

      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    );
  },
  async encrypt(data: string, password: string): Promise<string> {
    const salt = window.crypto.getRandomValues(new Uint8Array(10));
    const key = await this.deriveKey(password, salt);
    const enc = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    console.log("ENCRYPT FUNCTION CONSTS", {
      salt,
      key,
      iv,
    });

    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      enc.encode(data),
    );
    console.log("ENCRYPTED: ", encrypted);

    const encryptedData = new Uint8Array(encrypted);

    console.log("ENCRYPTED Data: ", encryptedData);

    const result = new Uint8Array(
      salt.length + iv.length + encryptedData.length,
    );

    console.log("ENCRYPTED RESULT: ", result);

    result.set(salt, 0);
    result.set(iv, salt.length);
    result.set(encryptedData, salt.length + iv.length);

    console.log(
      "ENCRYPTED RESULT after adding : ",
      btoa(String.fromCharCode.apply(null, Array.from(result))),
    );

    return btoa(String.fromCharCode.apply(null, Array.from(result)));
  },

  async decrypt(encryptedData: string, password: string): Promise<string> {
    const data = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));
    const salt = data.slice(0.16);
    const iv = data.slice(16, 16 + 12);
    const content = data.slice(16 + 12);

    const key = await this.deriveKey(password, salt);

    console.log("DECRYPT CONSTS: ", {
      data,
      salt,
      iv,
      content,
      key,
    });

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      content,
    );
    console.log("DECRYPTED: ", decrypted);
    const dec = new TextDecoder();
    console.log("RETURN VASLUE FOR DECRYPT: ", dec.decode(decrypted));

    return dec.decode(decrypted);
  },
};
