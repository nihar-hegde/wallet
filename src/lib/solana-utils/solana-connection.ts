import { Connection } from "@solana/web3.js";

let connection: Connection | null = null;

export const getSolanaConnection = (): Connection => {
  if (!connection) {
    const rpcEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT!;
    connection = new Connection(rpcEndpoint);
  }

  return connection;
};
