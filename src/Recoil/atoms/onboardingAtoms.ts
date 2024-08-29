import { atom } from "recoil";

export const selectedBlockChain = atom({
  key: "SelectedBlockChain",
  default: "",
});

export const secretRecoveryPhrase = atom({
  key: "SecretRecoveryPhrase",
  default: "",
});

export const rawPassword = atom({
  key: "RawPassword",
  default: "",
});
