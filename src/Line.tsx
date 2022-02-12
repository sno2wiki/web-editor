import { css } from "@emotion/css";
import { direction as checkDirection } from "direction";
import React, { useMemo } from "react";

export const Line: React.VFC<
  { lineId: string; text: string; }
> = (
  { lineId, text },
) => {
  const textDirection = useMemo<"ltr" | "rtl">(() => {
    const dir = checkDirection(text);
    return dir === "neutral" ? "ltr" : dir;
  }, [text]);
  const html = useMemo(
    () => text.split("").map((char, i) => `<span char-key="${lineId}-${i + 1}">${char}</span>`).join(""),
    [lineId, text],
  );

  return (
    <div line-id={lineId} className={css({ caretColor: "red" })} dangerouslySetInnerHTML={{ __html: html }}>
    </div>
  );
};

/*
  const textDirection = useMemo<"ltr" | "rtl">(() => {
    const dir = checkDirection(text);
    return dir === "neutral" ? "ltr" : dir;
  }, [text]);
  const charRef = useCallback((key: CharKey, node: HTMLSpanElement | null) => {
    if (!node) {
      return;
    }
    const rect = (node.getBoundingClientRect());
    const { height, left, top, right } = rect;
    notifyPosition(
      key,
      {
        inlineStart: textDirection === "ltr" ? [left, top] : [right, top],
        inlineEnd: textDirection === "ltr" ? [right, top] : [left, top],
        height,
      },
    );
  }, [notifyPosition, textDirection]);

  const chars = useMemo<{ char: string; key: CharKey; }[]>(
    () => text.split("").map((char, index) => ({ char, key: `${lineId}-${index + 1}` })),
    [lineId, text],
  );
  const charElements = useMemo<
    { key: CharKey; char: string; Element: React.VFC; }[]
  >(() =>
    text.split("").map(
      (char, index) => ({
        key: `${lineId}-${index + 1}`,
        char,
        Element: (props) => (
          <span char-key={`${lineId}-${index + 1}`} {...props}>
            {char}
          </span>
        ),
      }),
    ), [lineId, text]);

  return (
    <p
      id={lineId}
      className={css({ userSelect: "text" })}
      dir={textDirection}
      onInput={(e) => {
        if (e.currentTarget.textContent === null) return;
        console.log(e.currentTarget.textContent);
        setText(e.currentTarget.textContent);
      }}
    >
      <span
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </p>
  );
  */
