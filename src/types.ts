import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";
export type { BaseOperation, Descendant } from "slate";

export type EditorValue = Descendant[];

export type CalcRedirectHref = (context: string | null, term: string) => string;

export type EditorProps = {
  externalValue: EditorValue;
  pushValue(value: EditorValue): void;
  redirectHref: CalcRedirectHref;
};
export type ViewerProps = {
  externalValue: EditorProps["externalValue"];
  redirectHref: EditorProps["redirectHref"];
};

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
