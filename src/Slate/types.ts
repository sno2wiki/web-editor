import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

export type Decorate = "bold" | "italic" | "monospace" | "del" | "wavy";

export type ParagraphElement = { type: "paragraph"; children: any[]; };
export type RedirectElement = { type: "redirect"; context: string | null; term: string; children: CustomText[]; };
export type ElementUnion =
  | ParagraphElement
  | RedirectElement;
type CustomText =
  & { text: string; }
  & (
    | {} // eslint-disable-line @typescript-eslint/ban-types
    | { bold: true; }
    | { italic: true; }
    | { monospace: true; }
    | { wave: true; }
    | { strike: true; }
  );

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: ElementUnion;
    Text: CustomText;
  }
}
