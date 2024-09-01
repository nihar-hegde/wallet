import { Connection } from "@solana/web3.js";

let connection: Connection | null = null;

const key = "tqoA0HsqL3luasjokw97vxQxbgVyU_D6";

export const getSolanaConnection = (): Connection => {
  if (!connection) {
    const rpcEndpoint = `https://solana-devnet.g.alchemy.com/v2/${key}`;
    connection = new Connection(rpcEndpoint);
  }

  return connection;
};
