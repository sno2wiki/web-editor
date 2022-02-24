import { Decorate } from "./Editor2";

export const tokenizor = (
  text: string,
  offset = 0,
) => {
  const tokens: { type: Decorate; start: number; end: number; }[] = [];

  const simpleDecorate = (pattern: string, type: Decorate) => {
    const result = new RegExp(pattern, "d").exec(text);
    if (result) {
      const indices: [number, number] = (result as any).indices[0];
      tokens.push({ type, start: offset + indices[0], end: offset + indices[1] });

      // tokens.push(...tokenize(text.slice(0, indices[0]), offset, accepts.filter((v) => v !== type)));
      tokens.push(...tokenizor(text.slice(indices[1]), offset + indices[1]));
    }
  };

  simpleDecorate("\\`[^\\`]+?\\`", "monospace");
  simpleDecorate("\\*[^\\*]+?\\*", "bold");
  simpleDecorate("\\_[^\\_]+?\\_", "italic");
  simpleDecorate("\\-[^\\-]+?\\-", "del");
  simpleDecorate("\\~[^\\~]+?\\~", "wavy");

  return tokens;
};
