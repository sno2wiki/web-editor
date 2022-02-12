export const buildChars = (text: string, lineId: string) =>
  text.split("").map((char, i) => `<span char-position="${lineId}-${i + 1}">${char}</span>`).join("");

export const buildLine = (line: { id: string; text: string; }) =>
  `<div line-id="${line.id}">${line.text === "" ? "<br/>" : buildChars(line.text, line.id)}</div>`;

export const buildLines = (lines: { id: string; text: string; }[]) => lines.map((line) => buildLine(line)).join("");
