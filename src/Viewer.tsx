import React, { useEffect, useMemo, useState } from "react";
import { createEditor, Descendant } from "slate";
import { Editable, Slate, withReact } from "slate-react";

import { EndpointsContext } from "./EndpointsContext";
import { ViewerProps } from "./types";
import { useDecorate } from "./useDecorate";
import { useRenderElement } from "./useRenderElement";
import { useRenderLeaf } from "./useRenderLeaf";

export const Viewer: React.VFC<ViewerProps> = ({ externalValue, redirectHref }) => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>(externalValue);

  useEffect(
    () => {
      setValue(externalValue);
      editor.children = externalValue;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [externalValue],
  );

  const decorate = useDecorate();
  const renderElement = useRenderElement();
  const renderLeaf = useRenderLeaf();

  return (
    <EndpointsContext.Provider value={{ redirectHref }}>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
      >
        <Editable
          readOnly
          role={"textbox"}
          spellCheck={false}
          autoCorrect={"off"}
          autoCapitalize={"none"}
          translate={"no"}
          decorate={decorate}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
      </Slate>
    </EndpointsContext.Provider>
  );
};
