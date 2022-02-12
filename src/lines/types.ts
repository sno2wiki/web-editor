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
export type Commit = InsertCommit | UpdateCommit | DeleteCommit;
