import { css } from "@emotion/css";
import React from "react";
import { RenderLeafProps } from "slate-react";

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if ("bold" in leaf) {
    return <strong {...attributes} className={css({ fontWeight: "bold" })}>{children}</strong>;
  } else if ("italic" in leaf) {
    return <i {...attributes} className={css({ fontStyle: "italic" })}>{children}</i>;
  } else if ("monospace" in leaf) {
    return <code {...attributes} className={css({ fontFamily: "monospace" })}>{children}</code>;
  } else if ("del" in leaf) {
    return <del {...attributes} className={css({ textDecoration: "line-through" })}>{children}</del>;
  } else if ("wavy" in leaf) {
    return <span {...attributes} className={css({ textDecoration: "wavy underline" })}>{children}</span>;
  } else {
    return <span {...attributes}>{children}</span>;
  }
};
