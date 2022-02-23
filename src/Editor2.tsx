import { css, cx } from "@emotion/css";
import React, { useCallback, useMemo, useState } from "react";
import { BaseEditor, createEditor, Descendant, NodeEntry, Range, Text } from "slate";
import { withHistory } from "slate-history";
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react";

type Decorate = "bold" | "italic" | "monospace" | "del" | "wavy";

type CustomElement = { type: "paragraph"; children: CustomText[]; };
type CustomText =
  & { text: string; }
  & { [key in Decorate]?: true; };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  return (
    <span
      {...attributes}
      className={cx(
        leaf.bold && css({ fontWeight: "bold" }),
        leaf.italic && css({ fontStyle: "italic" }),
        leaf.monospace && css({ fontFamily: "monospace" }),
        leaf.del && css({ textDecoration: "line-through" }),
        leaf.wavy && css({ textDecoration: "wavy underline" }),
      )}
    >
      {children}
    </span>
  );
};

export const tokenize = (
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
      tokens.push(...tokenize(text.slice(indices[1]), offset + indices[1]));
    }
  };

  simpleDecorate("\\`[^\\`]+?\\`", "monospace");
  simpleDecorate("\\*[^\\*]+?\\*", "bold");
  simpleDecorate("\\_[^\\_]+?\\_", "italic");
  simpleDecorate("\\-[^\\-]+?\\-", "del");
  simpleDecorate("\\~[^\\~]+?\\~", "wavy");

  return tokens;
};

export const Editor2: React.VFC<{ lines: { id: string; text: string; }[]; }> = ({ lines }) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>(
    lines.map(({ text }) => ({ type: "paragraph", children: [{ text }] })),
  );

  const contextMap = useMemo(() => {
    console.dir(value);
    return new Map();
  }, [value]);

  const decorate = useCallback(([node, path]: NodeEntry) => {
    const ranges: Range[] = [];

    if (!Text.isText(node)) return ranges;
    const tokens = tokenize(node.text);
    for (const token of tokens) {
      ranges.push({ [token.type]: true, anchor: { path, offset: token.start }, focus: { path, offset: token.end } });
    }

    return ranges;
  }, []);
  const renderElement = useCallback(({ attributes, children, element }: RenderElementProps) => {
    switch (element.type) {
      default:
        return <p {...attributes}>{children}</p>;
    }
  }, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        console.dir(editor.operations);
      }}
    >
      <Editable
        spellCheck={false}
        decorate={decorate}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </Slate>
  );
};
