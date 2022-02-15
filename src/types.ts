export type ComitId = string;
export type CommitIdGenerator = () => ComitId;

export type LineId = string;
export type LineIdGenerator = () => LineId;

export type InsertCommit = {
  id: string;
  type: "INSERT";
  payload: { prevLineId: string; newLineId: string; text: string; };
};
export type UpdateCommit = {
  id: string;
  type: "UPDATE";
  payload: { lineId: string; text: string; };
};
export type DeleteCommit = {
  id: string;
  type: "DELETE";
  payload: { lineId: string; };
};
export type CommitUnion = InsertCommit | UpdateCommit | DeleteCommit;

export type Line = { id: string; text: string; };
