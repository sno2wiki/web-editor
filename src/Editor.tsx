import { css } from "@emotion/css";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Line } from ".";
import { buildLines } from "./builders";
import { calcNextLines } from "./calcNextLines";
import { CommitUnion } from "./types";

export const Editor: React.VFC<{
  lines: Line[];
  pushCommits(commits: CommitUnion[]): void;
  generateCommitId(): string;
  generateLineId(): string;
}> = (
  { lines: onlineLines, pushCommits, generateCommitId, generateLineId },
) => {
  /*
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

  /*
  const updateLine = (targetLineId: string, text: string) => {
    console.log(lines.map((line) => line.id === targetLineId ? { ...line, text } : line));
    // setLines((previous) => previous.map((line) => line.id === targetLineId ? { ...line, text } : line));
  };
  */

  /*

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

  const linesWrapperRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef(document.getSelection());
  const [composed, setComposed] = useState(false); // IME用

  const [localLines, setLocalLines] = useState<{ id: string; text: string; }[]>(onlineLines);
  const linesHTML = useMemo(() => buildLines(localLines), [localLines]);
  useEffect(() => {
    setLocalLines(onlineLines);
  }, [onlineLines]);

  const [selection, setSelection] = useState<
    { anchor: { position: string; offset: number; }; focus: { position: string; offset: number; }; }
  >();
  const [cursor, setCursor] = useState<{ lineId: string; index: number; } | undefined>(undefined);

  // 選択範囲を監視
  useEffect(() => {
    const handleSelection = () => {
      if (!selectionRef.current) return;
      const { anchorNode, anchorOffset, focusNode, focusOffset } = selectionRef.current;
      if (!anchorNode || anchorNode.nodeName !== "#text" || !focusNode || focusNode.nodeName !== "#text") return;
      const anchorPosition = anchorNode.parentElement?.getAttribute("char-position");
      const focusPosition = focusNode.parentElement?.getAttribute("char-position");
      if (!anchorPosition || !focusPosition) return;
      setSelection({
        anchor: { position: anchorPosition, offset: anchorOffset },
        focus: { position: focusPosition, offset: focusOffset },
      });
    };
    document.addEventListener("selectionchange", handleSelection);
    return () => document.removeEventListener("selectionchange", handleSelection);
  }, []);
  // Selectionからカーソル位置を決定
  useEffect(() => {
    if (
      !composed
      && selection
      && selection.anchor.position === selection.focus.position
      && selection.anchor.offset === selection.focus.offset
    ) {
      const [focusLineId, focusIndexStr] = selection.focus.position.split("-");
      const focusIndex = parseInt(focusIndexStr, 10);
      setCursor({ lineId: focusLineId, index: focusIndex + selection.focus.offset - 1 });
    }
  }, [composed, selection]);
  // カーソル位置をSelectionに反映
  useEffect(() => {
    if (!cursor || !selectionRef.current || !linesWrapperRef.current) return;

    selectionRef.current.removeAllRanges();
    const range = new Range();
    if (cursor.index === 0) {
      // TODO: br時の対応
      const $char = linesWrapperRef.current.querySelector(`[char-position="${cursor.lineId}-1"]`);
      if (!$char) return;
      range.setStartBefore($char);
      range.setStartBefore($char);
      selectionRef.current.addRange(range);
    } else {
      const $char = linesWrapperRef.current.querySelector(`[char-position="${cursor.lineId}-${cursor.index}"]`);
      if (!$char) return;
      range.setStartAfter($char);
      range.setEndAfter($char);
      selectionRef.current.addRange(range);
    }
  }, [cursor]);

  const updateLines = useCallback(() => {
    if (!linesWrapperRef.current) return;
    const $lines = linesWrapperRef.current.children;
    const tempLines = [...$lines].map(($line) => ({
      id: $line.getAttribute("line-id") as string,
      text: $line.textContent || "",
    }));
    const { nextLines, nextCursor, commits } = calcNextLines(
      localLines,
      tempLines,
      {
        generateCommitId,
        generateLineId,
      },
    );
    setLocalLines(nextLines);
    pushCommits(commits);
    setCursor((previous) => nextCursor || previous);
    if (!nextCursor) {
      const anchorPosition = selectionRef.current?.anchorNode?.parentElement?.getAttribute("char-position");
      const anchorOffset = selectionRef.current?.anchorOffset;
      const focusPosition = selectionRef.current?.focusNode?.parentElement?.getAttribute("char-position");
      const focusOffset = selectionRef.current?.focusOffset;
      console.log(anchorPosition, anchorOffset, focusPosition, focusOffset);

      if (anchorPosition && anchorOffset && focusPosition && focusOffset) {
        setSelection({
          anchor: { position: anchorPosition, offset: anchorOffset },
          focus: { position: focusPosition, offset: focusOffset },
        });
      }
    }
  }, [generateCommitId, generateLineId, localLines, pushCommits]);
  return (
    <div className={css({ overflow: "hidden" })}>
      <div>
        <p className={css({ fontFamily: "monospace" })}>SELECTION_A:{JSON.stringify(selection?.anchor)}</p>
        <p className={css({ fontFamily: "monospace" })}>SELECTION_F:{JSON.stringify(selection?.focus)}</p>
        <p className={css({ fontFamily: "monospace" })}>CURSOR:{JSON.stringify(cursor)}</p>
      </div>
      <div
        className={css({ position: "relative" })}
        ref={linesWrapperRef}
        role={"textbox"}
        spellCheck={false}
        autoCorrect={"off"}
        autoCapitalize={"none"}
        translate={"no"}
        contentEditable
        suppressContentEditableWarning
        onInput={() => {
          if (composed) return;
          updateLines();
          setComposed(false);
        }}
        onCompositionStart={() => {
          setComposed(true);
        }}
        onCompositionEnd={() => {
          updateLines();
          setComposed(false);
        }}
        dangerouslySetInnerHTML={{ __html: linesHTML }}
      >
      </div>
    </div>
  );
};
