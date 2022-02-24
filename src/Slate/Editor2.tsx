import React, { useCallback, useMemo, useState } from "react";
import { BaseOperation, createEditor, Descendant, NodeEntry, Range, Text } from "slate";
import { withHistory } from "slate-history";
import { Editable, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react";

import { Element } from "./Element";
import { EndpointsContext } from "./EndpointsContext";
import { Leaf } from "./Leaf";
import { tokenizor } from "./tokenize";
import { withRedirects } from "./withRedirects";

export const Editor2: React.VFC<
  {
    lines: { id: string; text: string; }[];
    pushOperations: (operations: BaseOperation[]) => void;
    redirectHref(context: string | null, term: string): string;
  }
> = ({ pushOperations }) => {
  const editor = useMemo(
    () => withRedirects(withReact(withHistory(createEditor()))),
    [],
  );
  const [value, setValue] = useState<Descendant[]>(
    // lines.map(({ text }) => ({ type: "paragraph", children: [{ text }] })),
    [
      {
        type: "paragraph",
        children: [
          {
            text: "*bold*, _italic_, `codeblock`, ~wave~, -strike-",
          },
          {
            type: "redirect",
            context: "sno2wiki",
            term: "リダイレクト仕様",
            children: [
              { text: "[sno2wiki=>リダイレクト仕様]" },
            ],
          },
          {
            text: "大丈夫ですよ",
          },
          {
            type: "redirect",
            context: "sno2wiki",
            term: "エディタについて",
            children: [
              { text: "[sno2wiki=>エディタについて]" },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "実験2",
          },
          {
            type: "redirect",
            context: "url",
            term: "scrapbox.io/sno2wman",
            children: [{ text: "[url=>scrapbox.io/sno2wman]" }],
          },
          {
            text: "[]",
          },
        ],
      },
    ],
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
    <EndpointsContext.Provider
      value={{
        redirectHref: (context: string | null, term: string) =>
          context ? `/redirects/${context}/${term}` : `/redirects/_/${term}`,
      }}
    >
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          const { selection, operations } = editor;
          pushOperations(operations);
          if (selection && Range.isCollapsed(selection)) {
            const [start, end] = Range.edges(selection);
          }
        }}
      >
        <Editable
          spellCheck={false}
          // decorate={decorate}
          renderElement={renderElement}
          // renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            const { selection, operations } = editor;

            /*
            if (selection && Range.isCollapsed(selection)) {
              const current = Editor.above<ElementUnion>(
                editor,
                { match: (n) => Editor.isBlock(editor, n) || Editor.isInline(editor, n) },
              );
              const inPlain = current?.[0]?.type === "paragraph";
              const inRedirect = current?.[0]?.type === "redirect";

              if (inPlain && event.ctrlKey && event.key === " ") {
                const { anchor: midPoint } = selection;
                const befPoint = { path: midPoint.path, offset: midPoint.offset - 1 };
                const aftPoint = { path: midPoint.path, offset: midPoint.offset + 1 };

                const befChar = Editor.string(editor, { anchor: befPoint, focus: midPoint });
                const aftChar = Editor.string(editor, { anchor: midPoint, focus: aftPoint });

                if (befChar === "[" && aftChar === "]") {
                  console.log("!");
                }
              }
            }
            /*
            if (event.key === "[" || event.key === "]") {
              event.preventDefault();
              Transforms.insertText(editor, "[]");
              Transforms.move(editor, { distance: 1, unit: "character", reverse: true });
            } else if (event.ctrlKey && event.key === "i") {
              event.preventDefault();
              insertRedirect(editor);
            } else if (event.ctrlKey && event.key === "ArrowLeft") {
              event.preventDefault();
            } else if (event.ctrlKey && event.key === "ArrowRight") {
              event.preventDefault();
            }
            */
          }}
        />
      </Slate>
    </EndpointsContext.Provider>
  );
};
