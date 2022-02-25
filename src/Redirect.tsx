import { css, cx } from "@emotion/css";
import React, { useContext, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { RenderElementProps, useSelected } from "slate-react";

import { EndpointsContext } from "./EndpointsContext";

export const Redirect: React.FC<
  {
    attributes: RenderElementProps["attributes"];
    context: string | null;
    term: string;
  }
> = ({ context, term, attributes, children }) => {
  const [state, setState] = useState<
    null | Record<"left" | "right" | "top" | "bottom" | "width" | "height", number>
  >(null);
  const [hover, setHover] = useState<
    | { hover: false; }
    | { hover: true; mouse: { x: number; y: number; }; }
  >({ hover: false });

  const { redirectHref } = useContext(EndpointsContext);

  const href = useMemo(() => {
    return redirectHref && redirectHref(context, term);
  }, [context, redirectHref, term]);

  const selected = useSelected();
  const clickable = useMemo(() => !selected, [selected]);

  return (
    <span
      {...attributes}
      className={cx(css({ position: "relative" }))}
    >
      <a
        {...(clickable ? { contentEditable: false } : {})}
        type="link"
        {...(href && { href })}
        className={cx(
          css({ color: "blue" }),
          clickable && css({ fontWeight: "bold" }),
        )}
        onMouseOver={(e) => {
          const { left, right, top, bottom, width, height } = e.currentTarget.getBoundingClientRect();
          setHover({ hover: true, mouse: { x: e.clientX, y: e.clientY } });
          setState({ left, right, top, bottom, width, height });
        }}
        onMouseLeave={() => {
          setHover({ hover: false });
        }}
      >
        {children}
      </a>
      {hover.hover && state && <Preview mouseX={hover.mouse.x} rect={state} context={context} term={term} />}
    </span>
  );
};

export const Preview: React.VFC<{
  rect: Record<"left" | "right" | "top" | "bottom" | "width" | "height", number>;
  mouseX: number;
  context: string | null;
  term: string;
}> = (
  { mouseX, rect, context, term },
) => {
  const style = useMemo(() => ({
    left: mouseX,
    top: rect.top + rect.height,
  }), [mouseX, rect]);

  return ReactDOM.createPortal(
    <div
      style={{ ...style }}
      className={css({
        position: "absolute",
        userSelect: "none",
        padding: "16px 12px",
        borderRadius: "4px",
        background: "#FFFe",
        boxShadow: "0 8px 16px #0004",
        border: "1px solid #0004",
        backdropFilter: "blur(1px)",
      })}
    >
      <p className={css({ fontSize: "0.75rem" })}>
        {term}@{context}
      </p>
    </div>,
    document.body,
  );
};
