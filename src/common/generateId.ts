import { customAlphabet } from "nanoid";
import { ulid } from "ulid";

export const createCommitId = () => ulid();
export const createLineId = () =>
  customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",
    16,
  )();
