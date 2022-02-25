import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createEditor, Descendant, NodeEntry, Range, Text } from "slate";
import { withHistory } from "slate-history";
import { Editable, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react";

import { Element } from "./Element";
import { EndpointsContext } from "./EndpointsContext";
import { Leaf } from "./Leaf";
import { tokenizor } from "./tokenize";
import { EditorProps } from "./types";
import { withRedirects } from "./withRedirects";

export const Editor2: React.VFC<EditorProps> = ({ externalValue, pushValue, redirectHref }) => {
  const editor = useMemo(
    () => withRedirects(withReact(withHistory(createEditor()))),
    [],
  );
  const [value, setValue] = useState<Descendant[]>(externalValue);

  useEffect(
    () => {
      setValue(externalValue);
      editor.children = externalValue;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [externalValue],
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
    <EndpointsContext.Provider value={{ redirectHref }}>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          pushValue(newValue);
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
