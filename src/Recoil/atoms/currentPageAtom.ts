import { atom } from "recoil";

export const currentPageState = atom({
  key: "CurrentPageState",
  default: 1,
});
