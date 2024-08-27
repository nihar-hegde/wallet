import { generateMnemonic } from "bip39";

export const generateRecoveryPhrase = (): string => {
  const phrase = generateMnemonic();
  return phrase;
};
