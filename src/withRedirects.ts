import { Editor } from "slate";

export const withRedirects = (editor: Editor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === "redirect" ? true : isInline(element);
  };

  /*
  editor.isVoid = (element) => {
    return element.type === "redirect" ? true : isVoid(element);
  };
  */

  return editor;
};
