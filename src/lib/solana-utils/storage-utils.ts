import { openDB } from "idb";

const dbPromise = openDB("SolanaWallet", 1, {
  upgrade(db) {
    db.createObjectStore("walletData");
  },
});

export const browserStorage = {
  async get(key: string) {
    return (await dbPromise).get("walletData", key);
  },
  async set(key: string, val: any) {
    return (await dbPromise).put("walletData", val, key);
  },
  async delete(key: string) {
    return (await dbPromise).delete("walletData", key);
  },
  async clear() {
    return (await dbPromise).clear("walletData");
  },
};
