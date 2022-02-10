import { createCommitId, createLineId } from "~/common/generateId";

import { calcCursorIndex } from "./calcCursorIndex";

type InsertCommit = { id: string; type: "INSERT"; payload: { prevLineId: string; newLineId: string; text: string; }; };
type UpdateCommit = { id: string; type: "UPDATE"; payload: { lineId: string; text: string; }; };
type DeleteCommit = { id: string; type: "DELETE"; payload: { lineId: string; }; };
type Commit = InsertCommit | UpdateCommit | DeleteCommit;

export const calcNextLines = (
  prevLines: { id: string; text: string; }[],
  tempLines: { id: string; text: string; }[],
): {
  commits: Commit[];
  nextLines: { id: string; text: string; }[];
  nextCursor: { lineId: string; index: number; } | undefined;
} => {
  const commits: Commit[] = [];
  const nextLines: { id: string; text: string; }[] = [];
  const deletedLines: { id: string; text: string; }[] = [];
  let nextCursor: { lineId: string; index: number; } | undefined = undefined;
  tempLines.forEach((tempLine, i) => {
    if (nextLines.map(({ id }) => id).includes(tempLine.id)) {
      const newLineId = createLineId();
      const commit: InsertCommit = {
        id: createCommitId(),
        type: "INSERT",
        payload: { prevLineId: tempLine.id, newLineId, text: tempLine.text },
      };
      commits.push(commit);
      nextLines.push({ id: newLineId, text: tempLine.text });
      nextCursor = { lineId: newLineId, index: 0 };
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const prevLine = prevLines.find(({ id }) => id === tempLine.id)!;
      if (prevLine.text !== tempLine.text) {
        const commit: UpdateCommit = {
          id: createCommitId(),
          type: "UPDATE",
          payload: { lineId: tempLine.id, text: tempLine.text },
        };
        commits.push(commit);
        const index = calcCursorIndex(prevLine.text, tempLine.text);
        if (index !== -1) nextCursor = { lineId: tempLine.id, index };
      }
      nextLines.push(tempLine);
    }
  });
  console.log(nextLines, commits, nextCursor);
  return { nextLines, nextCursor, commits };
};
