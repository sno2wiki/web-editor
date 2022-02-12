import { calcCursorIndex } from "./calcCursorIndex";
import { Commit } from "./types";

export const calcNextLines = (
  prevLines: { id: string; text: string; }[],
  tempLines: { id: string; text: string; }[],
  { generateCommitId, generateLineId }: {
    generateCommitId: () => string;
    generateLineId: () => string;
  },
): {
  commits: Commit[];
  nextLines: { id: string; text: string; }[];
  nextCursor: { lineId: string; index: number; } | undefined;
} => {
  const commits: Commit[] = [];
  const nextLines: { id: string; text: string; }[] = [];
  let nextCursor: { lineId: string; index: number; } | undefined = undefined;

  tempLines.forEach((tempLine) => {
    if (nextLines.map(({ id }) => id).includes(tempLine.id)) {
      const newLineId = generateLineId();
      commits.push({
        type: "INSERT",
        id: generateCommitId(),
        payload: { prevLineId: tempLine.id, newLineId, text: tempLine.text },
      });
      nextLines.push({ id: newLineId, text: tempLine.text });
      nextCursor = { lineId: newLineId, index: 0 };
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const prevLine = prevLines.find(({ id }) => id === tempLine.id)!;
      if (prevLine.text !== tempLine.text) {
        commits.push({
          type: "UPDATE",
          id: generateCommitId(),
          payload: { lineId: tempLine.id, text: tempLine.text },
        });
        const index = calcCursorIndex(prevLine.text, tempLine.text);
        if (index !== -1) nextCursor = { lineId: tempLine.id, index };
      }
      nextLines.push(tempLine);
    }
  });
  prevLines.filter(({ id }) => !nextLines.map(({ id }) => id).includes(id)).forEach((deleted) => {
    commits.push({
      type: "DELETE",
      id: generateCommitId(),
      payload: { lineId: deleted.id },
    });
  });
  return { nextLines, nextCursor, commits };
};
