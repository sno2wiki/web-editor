import React from "react";
import { RenderElementProps } from "slate-react";

import { Redirect } from "./Redirect";

export const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "redirect":
      return <Redirect attributes={attributes} context={element.context} term={element.term}>{children}</Redirect>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};
