import { calcNextLines } from ".";
import { createCommitId, createLineId } from "./createId";

jest.mock("./createId");
const mockedCreateCommitId = createCommitId as unknown as jest.Mock<
  ReturnType<typeof createCommitId>,
  Parameters<typeof createCommitId>
>;
const mockedCreateLineId = createLineId as unknown as jest.Mock<
  ReturnType<typeof createLineId>,
  Parameters<typeof createLineId>
>;

describe("calcNextLines()", () => {
  beforeEach(() => {
    mockedCreateCommitId.mockRestore();
    mockedCreateLineId.mockRestore();
  });

  afterEach(() => {
    mockedCreateCommitId.mockClear();
    mockedCreateLineId.mockClear();
  });

  test("do nothing #1", () => {
    const actual = calcNextLines(
      [{ id: "line1", text: "ABC" }],
      [{ id: "line1", text: "ABC" }],
    );
    expect(actual.nextLines).toStrictEqual(
      [{ id: "line1", text: "ABC" }],
    );
    expect(actual.commits).toStrictEqual(
      [],
    );
    expect(actual.nextCursor).toStrictEqual(undefined);
  });

  test("do nothing #2", () => {
    const actual = calcNextLines(
      [{ id: "line1", text: "ABC" }, { id: "line2", text: "ABC" }],
      [{ id: "line1", text: "ABC" }, { id: "line2", text: "ABC" }],
    );
    expect(actual.nextLines).toStrictEqual(
      [{ id: "line1", text: "ABC" }, { id: "line2", text: "ABC" }],
    );
    expect(actual.commits).toStrictEqual(
      [],
    );
    expect(actual.nextCursor).toStrictEqual(undefined);
  });

  test("update only #1", () => {
    mockedCreateCommitId.mockReturnValueOnce("newcommit1");

    const actual = calcNextLines(
      [{ id: "line1", text: "ABC" }],
      [{ id: "line1", text: "AB" }],
    );
    expect(actual.nextLines).toStrictEqual(
      [{ id: "line1", text: "AB" }],
    );
    expect(actual.commits).toStrictEqual(
      [
        { id: "newcommit1", type: "UPDATE", payload: { lineId: "line1", text: "AB" } },
      ],
    );
    expect(actual.nextCursor).toStrictEqual({ lineId: "line1", index: 2 });
  });

  test("update only #2", () => {
    mockedCreateCommitId.mockReturnValueOnce("newcommit1");

    const actual = calcNextLines(
      [{ id: "line1", text: "ABC" }, { id: "line2", text: "ABC" }],
      [{ id: "line1", text: "ABC" }, { id: "line2", text: "AB" }],
    );
    expect(actual.nextLines).toStrictEqual(
      [{ id: "line1", text: "ABC" }, { id: "line2", text: "AB" }],
    );
    expect(actual.commits).toStrictEqual(
      [
        { id: "newcommit1", type: "UPDATE", payload: { lineId: "line2", text: "AB" } },
      ],
    );
    expect(actual.nextCursor).toStrictEqual({ lineId: "line2", index: 2 });
  });

  test("update only #3", () => {
    mockedCreateCommitId
      .mockReturnValueOnce("newcommit1")
      .mockReturnValueOnce("newcommit2");

    const actual = calcNextLines(
      [{ id: "line1", text: "ABC" }, { id: "line2", text: "ABC" }],
      [{ id: "line1", text: "AB" }, { id: "line2", text: "AB" }],
    );
    expect(actual.nextLines).toStrictEqual(
      [{ id: "line1", text: "AB" }, { id: "line2", text: "AB" }],
    );
    expect(actual.commits).toStrictEqual(
      [
        { id: "newcommit1", type: "UPDATE", payload: { lineId: "line1", text: "AB" } },
        { id: "newcommit2", type: "UPDATE", payload: { lineId: "line2", text: "AB" } },
      ],
    );
    expect(actual.nextCursor).toStrictEqual({ lineId: "line2", index: 2 });
  });

  test("line break #1", () => {
    mockedCreateCommitId
      .mockReturnValueOnce("newcommit1")
      .mockReturnValueOnce("newcommit2");
    mockedCreateLineId
      .mockReturnValueOnce("newline1");

    const actual = calcNextLines(
      [
        { id: "line1", text: "ABC" },
      ],
      [
        { id: "line1", text: "AB" },
        { id: "line1", text: "C" },
      ],
    );
    expect(actual.nextLines).toStrictEqual(
      [
        { id: "line1", text: "AB" },
        { id: "newline1", text: "C" },
      ],
    );
    expect(actual.commits).toStrictEqual(
      [
        {
          id: "newcommit1",
          type: "UPDATE",
          payload: { lineId: "line1", text: "AB" },
        },
        {
          id: "newcommit2",
          type: "INSERT",
          payload: { prevLineId: "line1", newLineId: "newline1", text: "C" },
        },
      ],
    );
    expect(actual.nextCursor).toStrictEqual({ lineId: "newline1", index: 0 });
  });

  test("line break #2", () => {
    mockedCreateCommitId
      .mockReturnValueOnce("newcommit1")
      .mockReturnValueOnce("newcommit2");
    mockedCreateLineId
      .mockReturnValueOnce("newline1");

    const actual = calcNextLines(
      [
        { id: "line1", text: "ABC" },
      ],
      [
        { id: "line1", text: "ABC" },
        { id: "line1", text: "" },
      ],
    );
    expect(actual.nextLines).toStrictEqual(
      [
        { id: "line1", text: "ABC" },
        { id: "newline1", text: "" },
      ],
    );
    expect(actual.commits).toStrictEqual(
      [
        {
          id: "newcommit1",
          type: "INSERT",
          payload: { prevLineId: "line1", newLineId: "newline1", text: "" },
        },
      ],
    );
    expect(actual.nextCursor).toStrictEqual({ lineId: "newline1", index: 0 });
  });

  test("line break #3", () => {
    mockedCreateCommitId
      .mockReturnValueOnce("newcommit1")
      .mockReturnValueOnce("newcommit2");
    mockedCreateLineId
      .mockReturnValueOnce("newline1");

    const actual = calcNextLines(
      [
        { id: "line1", text: "ABC" },
      ],
      [
        { id: "line1", text: "" },
        { id: "line1", text: "ABC" },
      ],
    );
    expect(actual.nextLines).toStrictEqual(
      [
        { id: "line1", text: "" },
        { id: "newline1", text: "ABC" },
      ],
    );
    expect(actual.commits).toStrictEqual(
      [
        {
          id: "newcommit1",
          type: "UPDATE",
          payload: { lineId: "line1", text: "" },
        },
        {
          id: "newcommit2",
          type: "INSERT",
          payload: { prevLineId: "line1", newLineId: "newline1", text: "ABC" },
        },
      ],
    );
    expect(actual.nextCursor).toStrictEqual({ lineId: "newline1", index: 0 });
  });

  test("line fold #1", () => {
    mockedCreateCommitId
      .mockReturnValueOnce("newcommit1")
      .mockReturnValueOnce("newcommit2");
    mockedCreateLineId
      .mockReturnValueOnce("newline1");

    const actual = calcNextLines(
      [
        { id: "line1", text: "ABC" },
        { id: "line2", text: "DEF" },
      ],
      [
        { id: "line1", text: "ABCDEF" },
      ],
    );
    expect(actual.nextLines).toStrictEqual(
      [
        { id: "line1", text: "ABCDEF" },
      ],
    );
    expect(actual.commits).toStrictEqual(
      [
        {
          id: "newcommit1",
          type: "UPDATE",
          payload: { lineId: "line1", text: "ABCDEF" },
        },
        {
          id: "newcommit2",
          type: "DELETE",
          payload: { lineId: "line2" },
        },
      ],
    );
    expect(actual.nextCursor).toStrictEqual({ lineId: "line1", index: 3 });
  });

  test("line fold #2", () => {
    mockedCreateCommitId
      .mockReturnValueOnce("newcommit1")
      .mockReturnValueOnce("newcommit2");
    mockedCreateLineId
      .mockReturnValueOnce("newline1");

    const actual = calcNextLines(
      [
        { id: "line1", text: "ABC" },
        { id: "line2", text: "DEF" },
        { id: "line3", text: "GHI" },
      ],
      [
        { id: "line1", text: "ABCDEF" },
        { id: "line3", text: "GHI" },
      ],
    );
    expect(actual.nextLines).toStrictEqual(
      [
        { id: "line1", text: "ABCDEF" },
        { id: "line3", text: "GHI" },
      ],
    );
    expect(actual.commits).toStrictEqual(
      [
        {
          id: "newcommit1",
          type: "UPDATE",
          payload: { lineId: "line1", text: "ABCDEF" },
        },
        {
          id: "newcommit2",
          type: "DELETE",
          payload: { lineId: "line2" },
        },
      ],
    );
    expect(actual.nextCursor).toStrictEqual({ lineId: "line1", index: 3 });
  });

  test("edit multiple lines #1", () => {
    mockedCreateCommitId
      .mockReturnValueOnce("newcommit1")
      .mockReturnValueOnce("newcommit2")
      .mockReturnValueOnce("newcommit3");
    mockedCreateLineId
      .mockReturnValueOnce("newline1");

    const actual = calcNextLines(
      [
        { id: "line1", text: "ABC" },
        { id: "line2", text: "DEF" },
        { id: "line3", text: "GHI" },
      ],
      [
        { id: "line1", text: "AB" },
        { id: "line3", text: "HI" },
      ],
    );
    expect(actual.nextLines).toStrictEqual(
      [
        { id: "line1", text: "AB" },
        { id: "line3", text: "HI" },
      ],
    );
    expect(actual.commits).toStrictEqual(
      [
        {
          id: "newcommit1",
          type: "UPDATE",
          payload: { lineId: "line1", text: "AB" },
        },
        {
          id: "newcommit2",
          type: "UPDATE",
          payload: { lineId: "line3", text: "HI" },
        },
        {
          id: "newcommit3",
          type: "DELETE",
          payload: { lineId: "line2" },
        },
      ],
    );
    expect(actual.nextCursor).toStrictEqual({ lineId: "line3", index: 0 });
  });

  test("edit multiple lines #2", () => {
    mockedCreateCommitId
      .mockReturnValueOnce("newcommit1")
      .mockReturnValueOnce("newcommit2")
      .mockReturnValueOnce("newcommit3")
      .mockReturnValueOnce("newcommit4");
    mockedCreateLineId
      .mockReturnValueOnce("newline1");

    const actual = calcNextLines(
      [
        { id: "line1", text: "ABC" },
        { id: "line2", text: "DEF" },
        { id: "line3", text: "GHI" },
        { id: "line4", text: "JKL" },
      ],
      [
        { id: "line1", text: "AB" },
        { id: "line4", text: "KL" },
      ],
    );
    expect(actual.nextLines).toStrictEqual(
      [
        { id: "line1", text: "AB" },
        { id: "line4", text: "KL" },
      ],
    );
    expect(actual.commits).toStrictEqual(
      [
        {
          id: "newcommit1",
          type: "UPDATE",
          payload: { lineId: "line1", text: "AB" },
        },
        {
          id: "newcommit2",
          type: "UPDATE",
          payload: { lineId: "line4", text: "KL" },
        },
        {
          id: "newcommit3",
          type: "DELETE",
          payload: { lineId: "line2" },
        },
        {
          id: "newcommit4",
          type: "DELETE",
          payload: { lineId: "line3" },
        },
      ],
    );
    expect(actual.nextCursor).toStrictEqual({ lineId: "line4", index: 0 });
  });
});
