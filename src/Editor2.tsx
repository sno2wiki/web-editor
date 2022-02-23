import { css, cx } from "@emotion/css";
import React, { useCallback, useMemo, useState } from "react";
import { BaseEditor, createEditor, Descendant, NodeEntry, Range, Text } from "slate";
import { withHistory } from "slate-history";
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react";

type CustomElement = { type: "paragraph"; children: CustomText[]; };
type CustomText = { text: string; } & { bold?: true; };

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
        leaf.bold && css({ fontWeight: "bold" }),
      )}
    >
      {children}
    </span>
  );
};

export const Editor2: React.VFC<{ lines: { id: string; text: string; }[]; }> = ({ lines }) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>(
    lines.map(({ text }) => ({ type: "paragraph", children: [{ text }] })),
  );

  const decorate = useCallback(([node, path]: NodeEntry) => {
    const ranges: Range[] = [];

    if (!Text.isText(node)) return ranges;

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
