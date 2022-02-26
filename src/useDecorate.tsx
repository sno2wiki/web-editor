import { useCallback } from "react";
import { NodeEntry, Range, Text } from "slate";

import { Decorate } from "./types";

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

export const useDecorate = () => {
  return useCallback(([node, path]: NodeEntry) => {
    const ranges: Range[] = [];

    if (!Text.isText(node)) return ranges;
    const tokens = tokenizor(node.text);
    for (const token of tokens) {
      ranges.push({
        [token.type]: true,
        anchor: { path, offset: token.start },
        focus: { path, offset: token.end },
      });
    }
    return ranges;
  }, []);
};
