import { match, otherwise, when } from "./mod"

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
  it("should match exact values", function() {
    assert(
      "correct",
      match(2, [
        when(1, () => "incorrect"),
        when(2, () => "correct"),
        when(3, () => "incorrect"),
      ]),
    )

    assert(
      "yes",
      match("best", [
        when("good", () => "no"),
        when("better", () => "nah"),
        when("best", () => "yes"),
      ]),
    )
  })

  it("should match constructor types", function() {
    assert(
      "correct",
      match("text", [
        when(1, () => "incorrect"),
        when("not", () => "incorrect"),
        when(String, () => "correct"),
      ]),
    )

    assert(
      "yes",
      match(99, [
        when(10, () => "no"),
        when(Number, () => "yes"),
        otherwise(() => "no"),
      ]),
    )
  })

  it("should match otherwise fallbacks", function() {
    assert(
      "correct",
      match("not going to", [
        when(1, () => "incorrect"),
        when("nope", () => "incorrect"),
        when(Number, () => "incorrect"),
        otherwise(() => "correct"),
      ]),
    )
  })

  it("should return undefined if no matches", function() {
    assert(
      undefined,
      match(11, [
        when(10, () => "no"),
        when("string", () => "no"),
        when(String, () => "no"),
      ]),
    )
  })

  it("should pass value into match functions", function() {
    assert(100, match(50, [when(Number, x => x * 2)]))

    assert(
      "Text was hello",
      match("hello", [when(String, x => `Text was ${x}`)]),
    )
  })
})
