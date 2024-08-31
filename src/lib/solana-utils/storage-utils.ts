import { openDB } from "idb";

const dbPromise =
  typeof indexedDB !== "undefined"
    ? openDB("SolanaWallet", 1, {
        upgrade(db) {
          db.createObjectStore("walletData");
        },
      })
    : null;

export const browserStorage = {
  async get(key: string) {
    if (!dbPromise) return null;
    return (await dbPromise).get("walletData", key);
  },
  async set(key: string, val: any) {
    if (!dbPromise) return null;
    return (await dbPromise).put("walletData", val, key);
  },
  async delete(key: string) {
    if (!dbPromise) return null;
    return (await dbPromise).delete("walletData", key);
  },
  async clear() {
    if (!dbPromise) return null;
    return (await dbPromise).clear("walletData");
  },
};
