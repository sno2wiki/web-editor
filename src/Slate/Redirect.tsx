import { css } from "@emotion/css";
import React, { useMemo } from "react";
import { RenderElementProps, useFocused, useSelected } from "slate-react";

export const Redirect: React.FC<
  {
    attributes: RenderElementProps["attributes"];
    context: string | null;
    term: string;
  }
> = ({ context, term, attributes, children }) => {
  const selected = useSelected();
  const focused = useFocused();

  const href = useMemo(() => {
    return context ? `/redirects/${context}/${term}` : `/redirects/_/${term}`;
  }, [context, term]);

  return (
    <span
      {...attributes}
      className={css({ color: "blue" })}
    >
      <a
        className={css({ color: "blue" })}
        href={href}
      >
        {term}@{context}
      </a>
      {children}
    </span>
  );
};
