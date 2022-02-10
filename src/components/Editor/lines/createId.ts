import { customAlphabet } from "nanoid";
import { ulid as genCommitId } from "ulid";

export const createCommitId = () => genCommitId();

const genLineId = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz", 16);
export const createLineId = () => genLineId();
