import { css } from "@emotion/css";
import React from "react";

import { Editor } from "./components/Editor";
import { createCommitId, createLineId } from "./components/Editor/lines/createId";

export const App: React.VFC = () => {
  return (
    <div
      className={css({
        margin: "64px 64px",
        /*userSelect: "none" */
      })}
    >
      <p>EDITOR TEST</p>
      <Editor
        online={{
          head: createCommitId(),
          lines: [
            { id: createLineId(), text: "ダークらき☆すたｷﾀ━━━━(ﾟ∀ﾟ)━━━━!!" },
            { id: createLineId(), text: "...where you must rest your weary bones" },
            { id: createLineId(), text: "シメジシミュレーション" },
            { id: createLineId(), text: "インターネットやめないで" },
            { id: createLineId(), text: "@" },
            { id: createLineId(), text: "<strong>A</strong>" },
            { id: createLineId(), text: "استمع (؟·معلومات)، ومعناها" },
          ],
        }}
      />
    </div>
  );
};
