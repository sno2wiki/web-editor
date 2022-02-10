import { calcCursorIndex } from "./calcCursorIndex";

describe("calcCursorIndex()", () => {
  test("等しいなら-1を返す", () => {
    const actual = calcCursorIndex("ABC", "ABC");
    expect(actual).toBe(-1);
  });

  test("先頭の1文字が欠けている", () => {
    const actual = calcCursorIndex("ABCDE", "BCDE");
    expect(actual).toBe(0);
  });

  test("中央の1文字が欠けている", () => {
    const actual = calcCursorIndex("ABCDE", "ABDE");
    expect(actual).toBe(2);
  });

  test("最後の1文字が欠けている", () => {
    const actual = calcCursorIndex("ABCDE", "ABCD");
    expect(actual).toBe(4);
  });

  test("先頭の複数文字が欠けている", () => {
    const actual = calcCursorIndex("ABCDE", "CDE");
    expect(actual).toBe(0);
  });

  test("中央の複数文字が欠けている", () => {
    const actual = calcCursorIndex("ABCDE", "ABE");
    expect(actual).toBe(2);
  });

  test("最後の複数文字が欠けている", () => {
    const actual = calcCursorIndex("ABCDE", "ABC");
    expect(actual).toBe(3);
  });

  test("先頭の1文字が増えている", () => {
    const actual = calcCursorIndex("ABC", "XABC");
    expect(actual).toBe(1);
  });

  test("中央の1文字が増えている", () => {
    const actual = calcCursorIndex("ABCD", "ABXCD");
    expect(actual).toBe(3);
  });

  test("最後の1文字が増えている", () => {
    const actual = calcCursorIndex("ABC", "ABCX");
    expect(actual).toBe(4);
  });

  test("先頭の複数文字が増えている", () => {
    const actual = calcCursorIndex("ABC", "XYABC");
    expect(actual).toBe(2);
  });

  test("中央の複数文字が増えている", () => {
    const actual = calcCursorIndex("ABCD", "ABXYCD");
    expect(actual).toBe(4);
  });

  test("最後の複数文字が増えている", () => {
    const actual = calcCursorIndex("ABC", "ABCXY");
    expect(actual).toBe(5);
  });

  test("先頭の1文字が置き換わっている", () => {
    const actual = calcCursorIndex("ABC", "XBC");
    expect(actual).toBe(1);
  });

  test("中央の1文字が置き換わっている", () => {
    const actual = calcCursorIndex("ABCDE", "ABXDE");
    expect(actual).toBe(3);
  });

  test("最後の1文字が置き換わっている", () => {
    const actual = calcCursorIndex("ABC", "ABX");
    expect(actual).toBe(3);
  });

  test("先頭の複数文字が置き換わっている", () => {
    const actual = calcCursorIndex("ABCDE", "XYCDE");
    expect(actual).toBe(2);
  });

  test("中央の複数文字が置き換わっている", () => {
    const actual = calcCursorIndex("ABCDE", "AXYDE");
    expect(actual).toBe(3);
  });

  test("最後の複数文字が置き換わっている", () => {
    const actual = calcCursorIndex("ABCDE", "ABCXY");
    expect(actual).toBe(5);
  });
});
