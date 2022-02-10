import { css } from "@emotion/css";
import React, { Fragment, useEffect, useReducer, useRef, useState } from "react";

import { calcNextLines } from "./lines";

export type CharKey = `${string}-${number}`;

export const Cursor: React.VFC<{ basePosition: { left: number; top: number; height: number; }; }> = (
  { basePosition: basePoint },
) => {
  return (
    <div
      style={{ left: basePoint.left, top: basePoint.top, height: basePoint.height }}
      className={css({ position: "absolute" })}
    >
      <div className={css({ position: "absolute", width: 2, height: "100%", top: 0, left: -1, background: "black" })}>
      </div>
      {
        /*
          <div
            className={css({
              position: "absolute",
              top: "100%",
              display: "flex",
              flexDirection: "column",
            })}
          >
            <div>Strong</div>
            <div>Italic</div>
          </div>
        */
      }
    </div>
  );
};

export const Editor: React.VFC<{
  online: { head: string; lines: { id: string; text: string; }[]; };
}> = (
  { online },
) => {
  const [charPositions, setCharPosition] = useReducer(
    (
      previous: Map<CharKey, { inlineStart: [number, number]; inlineEnd: [number, number]; height: number; }>,
      { key, payload }: {
        key: CharKey;
        payload: { inlineStart: [number, number]; inlineEnd: [number, number]; height: number; };
      },
    ) => previous.set(key, payload),
    new Map(),
  );

  const [cursor, setCursor] = useState<{ lineId: string; index: number; } | undefined>(undefined);
  const [lines, setCurrentLines] = useState<{ id: string; text: string; }[]>(online.lines);
  useEffect(() => {
    setCurrentLines(online.lines);
  }, [online]);
  /*
  const updateLine = (targetLineId: string, text: string) => {
    console.log(lines.map((line) => line.id === targetLineId ? { ...line, text } : line));
    // setLines((previous) => previous.map((line) => line.id === targetLineId ? { ...line, text } : line));
  };
  */

  const [selection, setSelection] = useState<
    { anchor: { char: CharKey; offset: number; }; focus: { char: CharKey; offset: number; }; }
  >();
  const linesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selection = document.getSelection();
    const handleSelection = () => {
      if (!selection) return;

      // selection.removeAllRanges();

      /*
      const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
      const anchorLineId = anchorNode?.parentElement?.parentElement?.getAttribute("line-id");
      const focusLineId = focusNode?.parentElement?.parentElement?.getAttribute("line-id");
      setSelection({
        anchor: { char: anchorLineId as CharKey, offset: anchorOffset },
        focus: { char: focusLineId as CharKey, offset: focusOffset },
      });
      */
    };

    document.addEventListener("selectionchange", handleSelection);
    return () => document.removeEventListener("selectionchange", handleSelection);
  }, []);
  /*
  const cursorPosition = useMemo<{ left: number; top: number; height: number; } | undefined>(() => {
    if (!selection?.focus) return;
    const { focus } = selection;
    if (focus.offset === 1) {
      const pos = charPositions.get(selection.focus.char);
      return pos && { left: pos.inlineEnd[0], top: pos.inlineEnd[1], height: pos.height };
    } else {
      const [lineStr, charStr] = focus.char.split("-");
      const line = parseInt(lineStr, 10);
      const char = parseInt(charStr, 10);
      if (1 < char) {
        const pos = charPositions.get(`${line}-${char - 1}`);
        return pos && { left: pos.inlineEnd[0], top: pos.inlineEnd[1], height: pos.height };
      } else {
        const pos = charPositions.get(`${line}-${1}`);
        return pos && { left: pos.inlineStart[0], top: pos.inlineStart[1], height: pos.height };
      }
    }
  }, [selection, charPositions]);
  */

  const [decided, setDecided] = useState(true);
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    /*
    const current = Object.fromEntries([...e.currentTarget.children].map(
      ($line) => [$line.id, { text: $line.textContent as string }],
    ));
    setLines(
      (previous) =>
        previous.map(
          (line) => line.id in current ? { id: line.id, ...current[line.id] } : { id: line.id, text: null },
        ),
    );
    */
  };
  const selectionRef = useRef(document.getSelection());
  const updateLines = () => {
    if (!linesRef.current) return;
    const $lines = linesRef.current.children;
    const tempLines = [...$lines].map(($line) => ({
      id: $line.getAttribute("line-id") as string,
      text: $line.textContent || "",
    }));
    const { nextLines, nextCursor } = calcNextLines(lines, tempLines);
    setCurrentLines(nextLines);
    setCursor(() => nextCursor || cursor);
    setDecided(true);
  };
  useEffect(() => {
    if (!cursor || !selectionRef.current || !linesRef.current) return;

    selectionRef.current.removeAllRanges();
    const range = new Range();
    if (cursor.index === 0) {
      const $char = linesRef.current.querySelector(`[char-key="${cursor.lineId}-1"]`);
      if (!$char) return;
      range.setStartBefore($char);
      range.setStartBefore($char);
      selectionRef.current.addRange(range);
    } else {
      const $char = linesRef.current.querySelector(`[char-key="${cursor.lineId}-${cursor.index}"]`);
      if (!$char) return;
      range.setStartAfter($char);
      range.setEndAfter($char);
      selectionRef.current.addRange(range);
    }
  }, [cursor]);

  return (
    <div className={css({ overflow: "hidden" })}>
      <div>
        <p className={css({ fontFamily: "monospace" })}>{JSON.stringify(cursor)}</p>
      </div>
      {
        /*
      cursorPosition && <Cursor basePosition={cursorPosition} />
        */
      }
      <div
        className={css({ position: "relative" })}
        ref={linesRef}
        role={"textbox"}
        spellCheck={false}
        autoCorrect={"off"}
        autoCapitalize={"none"}
        translate={"no"}
        aria-multiline="true"
        aria-autocomplete="list"
        aria-expanded="false"
        contentEditable
        suppressContentEditableWarning
        onInput={() => {
          if (!decided) return;
          updateLines();
        }}
        onCompositionStart={() => {
          setDecided(false);
        }}
        onCompositionEnd={() => {
          updateLines();
        }}
      >
        {lines.map(({ id, text }) => (
          <Fragment key={id}>
            <div
              line-id={id}
              className={css({ caretColor: "red" })}
              dangerouslySetInnerHTML={{
                __html: text.split("").map((char, i) => `<span char-key="${id}-${i + 1}">${char}</span>`).join(""),
              }}
            >
              {
                /*
              text.split("").map((char, i) => (
                <span
                  key={i + 1}
                  char-key={`${id}-${i + 1}`}
                  dangerouslySetInnerHTML={{ __html: char }}
                >
                </span>
              ))
            */
              }
            </div>
            {text === null && <br />}
          </Fragment>
        ))}
        {
          /*
          <Line
            key={id}
            lineId={id}
            givenText={text}
            notifyPosition={(key, payload) => 0  setCharPosition({ key, payload }) }
          />
        */
        }
      </div>
    </div>
  );
};
