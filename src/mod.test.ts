import { expect } from "chai";
import { match, otherwise, when } from "./mod";

describe("match()", function () {
  it("should match exact values", function () {
    expect(
      match(2, [
        when(1, () => "incorrect"),
        when(2, () => "correct"),
        when(3, () => "incorrect"),
      ])
    ).to.equal("correct");

    expect(
      match("best", [
        when("good", () => "no"),
        when("better", () => "nah"),
        when("best", () => "yes"),
      ])
    ).to.equal("yes");

    expect(
      match(false, [when(true, () => "no"), when(false, () => "si")])
    ).to.equal("si");
  });

  it("should match regular expressions", function () {
    expect(
      match("text", [when(/not/, () => "no"), when(/text/, () => "yes")])
    ).to.equal("yes");
  });

  it("should match constructor types", function () {
    expect(
      match("text", [
        when(1, () => "incorrect"),
        when("not", () => "incorrect"),
        when(String, () => "correct"),
      ])
    ).to.equal("correct");

    expect(
      match(99, [
        when(10, () => "no"),
        when(Number, () => "yes"),
        otherwise(() => "no"),
      ])
    ).to.equal("yes");
  });

  it("should match custom match functions", function () {
    expect(
      match(10, [
        when(
          (x: number) => x === 1,
          () => "no"
        ),
        when(
          (x: number) => x === 10,
          () => "yes"
        ),
        when(
          (x: number) => x === 100,
          () => "no"
        ),
      ])
    ).to.equal("yes");
  });

  it("should shallow match objects", function () {
    expect(
      match({ foo: "bar" }, [
        when(1, () => "wrong"),
        when(String, () => "nope"),
        when({ foo: "bar" }, () => "right"),
      ])
    ).to.equal("right");

    expect(
      match({ status: 200 }, [
        when({ status: 404 }, () => "not correct"),
        when({ status: 500 }, () => "not correct"),
        when({ status: 200 }, () => "correct"),
      ])
    ).to.equal("correct");
  });

  it("should match object keys as conditions", function () {
    expect(
      match({ method: "GET", path: "/test" }, [
        when({ status: "GET", path: /tset/ }, () => "failure"),
        when({ method: "GET", path: /test/ }, () => "success"),
      ])
    ).to.equal("success");

    expect(
      match({ status: 200, headers: { "Content-Type": "application/json" } }, [
        when(
          { status: 200, headers: { "Content-Type": "application/text" } },
          () => "false"
        ),
        when(
          { status: 200, headers: { "Content-Type": "application/json" } },
          () => "true"
        ),
      ])
    ).to.equal("true");

    expect(
      match({ status: 503 }, [
        when({ status: /4\d{2}/ }, () => "client error"),
        when({ status: /2\d{2}/ }, () => "success status"),
        when({ status: /5\d{2}/ }, () => "server error"),
      ])
    ).to.equal("server error");
  });

  it("should match otherwise fallbacks", function () {
    expect(
      match("not going to", [
        when(1, () => "incorrect"),
        when("nope", () => "incorrect"),
        when(Number, () => "incorrect"),
        otherwise(() => "correct"),
      ])
    ).to.equal("correct");
  });

  it("should return undefined if no matches", function () {
    expect(
      match(11, [
        when(10, () => "no"),
        when("text", () => "no"),
        when(String, () => "no"),
      ])
    ).to.be.undefined;
  });

  it("should pass value into match functions", function () {
    expect(match(50, [when(Number, (x) => x * 2)])).to.equal(100);

    expect(match("hello", [when(String, (x) => `Text was ${x}`)])).to.equal(
      "Text was hello"
    );

    expect(
      match({ status: 200, body: "Hello world" }, [
        when({ status: 200 }, (x) => x.body),
      ])
    ).to.equal("Hello world");
  });

  it("should pass through promises", async function () {
    expect(
      await match(true, [otherwise(() => Promise.resolve("promised"))])
    ).to.equal("promised");
  });
});
