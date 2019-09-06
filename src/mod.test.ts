import { any, match, number, string } from "./mod"

class AssertionError {
  constructor(
    public message: string,
    public expected: any,
    public actual: any,
  ) {}
}

function assert(actual: any, expected: any) {
  if (!Object.is(expected, actual))
    throw new AssertionError("Assertion failed", expected, actual)
}

describe("match()", function() {
  it("should return exact matches first", function() {
    assert(
      "correct",
      match(2, {
        1: () => "incorrect",
        2: () => "correct",
        3: () => "incorrect",
      }),
    )

    assert(
      "yes",
      match("best", {
        good: () => "no",
        better: () => "nah",
        best: () => "yes",
      }),
    )
  })

  it("should return type fallback if exists on no match", function() {
    assert(
      "correct",
      match("text", {
        1: () => "incorrect",
        not: () => "incorrect",
        [string]: () => "correct",
      }),
    )

    assert(
      "yes",
      match(99, {
        10: () => "no",
        [number]: () => "yes",
        [any]: () => "no",
      }),
    )
  })

  it("should return any fallback if exists on no match", function() {
    assert(
      "correct",
      match("not going to", {
        1: () => "incorrect",
        nope: () => "incorrect",
        [number]: () => "incorrect",
        [any]: () => "correct",
      }),
    )
  })

  it("should return undefined on no match or fallback", function() {
    assert(
      undefined,
      match(11, {
        10: () => "no",
        string: () => "no",
        [string]: () => "no",
      }),
    )
  })

  it("should pass value into match functions", function() {
    assert(
      100,
      match(50, {
        [number]: x => x * 2,
      }),
    )

    assert(
      "Text was hello",
      match("hello", {
        [string]: x => `Text was ${x}`,
      }),
    )
  })
})
