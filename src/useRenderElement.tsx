import { css } from "@emotion/css";
import React, { useCallback } from "react";
import { RenderElementProps } from "slate-react";

import { Redirect } from "./Redirect";

export const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "redirect":
      return <Redirect attributes={attributes} context={element.context} term={element.term}>{children}</Redirect>;
    default:
      return (
        <p
          className={css({
            lineHeight: "1.8em",
            color: "var(--editor-text-color)",
            fontSize: "var(--editor-text-font-size)",
            fontFamily: "var(--editor-text-font-family)",
          })}
          {...attributes}
        >
          {children}
        </p>
      );
  }
};

export const useRenderElement = () => {
  return useCallback((props: RenderElementProps) => <Element {...props} />, []);
};
