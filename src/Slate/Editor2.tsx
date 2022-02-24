import React, { useCallback, useMemo, useState } from "react";
import { BaseEditor, BaseOperation, createEditor, Descendant, Editor, NodeEntry, Range, Text, Transforms } from "slate";
import { withHistory } from "slate-history";
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react";

import { Leaf } from "./Leaf";
import { Redirect } from "./Redirect";
import { tokenizor } from "./tokenize";
import { withRedirects } from "./withRedirects";

export type Decorate = "bold" | "italic" | "monospace" | "del" | "wavy";

export type ParagraphElement = { type: "paragraph"; children: any[]; };
export type RedirectElement = { type: "redirect"; context: string | null; term: string; children: CustomText[]; };
export type ElementUnion =
  | ParagraphElement
  | RedirectElement;

type CustomText =
  & { text: string; }
  & (
    | {}
    | { bold: true; }
    | { italic: true; }
    | { monospace: true; }
    | { wave: true; }
    | { strike: true; }
  );

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: ElementUnion;
    Text: CustomText;
  }
}

const insertRedirect = (editor: Editor) => {
  const mention: RedirectElement = {
    type: "redirect",
    context: "sno2wiki",
    term: "リダイレクト仕様",
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};

const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "redirect":
      return <Redirect attributes={attributes} context={element.context} term={element.term}>{children}</Redirect>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

export const Editor2: React.VFC<
  {
    lines: { id: string; text: string; }[];
    pushOperations: (operations: BaseOperation[]) => void;
  }
> = ({ pushOperations }) => {
  const editor = useMemo(
    () => withRedirects(withReact(withHistory(createEditor()))),
    [],
  );
  const [value, setValue] = useState<Descendant[]>(initValues // lines.map(({ text }) => ({ type: "paragraph", children: [{ text }] })),
  );

  const decorate = useCallback(([node, path]: NodeEntry) => {
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
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);

  return (
    <>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          const { selection, operations } = editor;

          pushOperations(operations);

          if (selection && Range.isCollapsed(selection)) {
            const [start, end] = Range.edges(selection);
            console.log(start, end);
          }
        }}
      >
        <Editable
          spellCheck={false}
          decorate={decorate}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            const { selection, operations } = editor;
            if (event.key === "[" || event.key === "]") {
              event.preventDefault();
              Transforms.insertText(editor, "[]");
              Transforms.move(editor, { distance: 1, unit: "character", reverse: true });
            }
            if (event.ctrlKey && event.key === "ArrowLeft") {
              event.preventDefault();
            } else if (event.ctrlKey && event.key === "ArrowRight") {
              event.preventDefault();
            }
          }}
        />
      </Slate>
      <p>{JSON.stringify(value)}</p>
    </>
  );
};

const initValues: Descendant[] = [
  {
    type: "paragraph",
    children: [
      /*
      { text: "*bold*", bold: true },
      { text: "," },
      { text: "_italic_", italic: true },
      { text: "," },
      { text: "`Codeblock`", monospace: true },
      { text: "," },
      { text: "~wave~", wave: true },
      { text: "," },
      { text: "-strike-", strike: true },
      */
      {
        text: "*bold*, _italic_, `codeblock`, ~wave~, -strike-",
      },
      {
        type: "redirect",
        context: "sno2wiki",
        term: "リダイレクト仕様",
        children: [{ text: "" }],
      },
      {
        text: "大丈夫ですよ",
      },
      { text: "" },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "実験2",
      },
      { text: "" },
      /*
      {
        type: "redirect",
        context: "sno2wiki",
        term: "エディタについて",
        children: [{ text: "" }],
      },
      */
    ],
  },
];
