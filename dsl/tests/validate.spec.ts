import { ValidationError } from "../errors";
import { validateQuery } from "../validate";

describe("validateQuery", () => {
  it.each([
    ["a string", "hello"],
    ["null", null],
    ["an array", []],
  ])("rejects %s as the query", (_label, input) => {
    expect(() => validateQuery(input)).toThrow(ValidationError);
  });

  it("rejects a missing security", () => {
    expect(() =>
      validateQuery({ expression: { fn: "*", a: 1, b: 2 } }),
    ).toThrow("security: expected a string");
  });

  it("rejects a non-string security", () => {
    expect(() =>
      validateQuery({ security: 123, expression: { fn: "*", a: 1, b: 2 } }),
    ).toThrow("security: expected a string");
  });

  it("rejects a missing expression", () => {
    expect(() => validateQuery({ wrong: 123, security: "BCD" })).toThrow(
      "expression: expected an expression object",
    );
  });

  it("rejects an unknown operator", () => {
    expect(() =>
      validateQuery({ security: "ABC", expression: { fn: "%", a: 1, b: 2 } }),
    ).toThrow("expression.fn: expected one of");
  });

  it("rejects a missing operator", () => {
    expect(() =>
      validateQuery({ security: "ABC", expression: { a: 1, b: 2 } }),
    ).toThrow("expression.fn");
  });

  it("accepts a valid nested query", () => {
    const query = {
      security: "CDE",
      expression: {
        fn: "-",
        a: { fn: "-", a: "eps", b: "shares" },
        b: { fn: "*", a: "assets", b: 2 },
      },
    };
    expect(validateQuery(query)).toEqual(query);
  });

  it("rejects a boolean argument", () => {
    expect(() =>
      validateQuery({
        security: "ABC",
        expression: { fn: "*", a: "sales", b: true },
      }),
    ).toThrow("expression.b: expected a number, attribute name or expression");
  });

  it("rejects a missing argument", () => {
    expect(() =>
      validateQuery({ security: "ABC", expression: { fn: "*", a: "sales" } }),
    ).toThrow("expression.b");
  });

  it("reports the path of an error inside a nested expression", () => {
    expect(() =>
      validateQuery({
        security: "ABC",
        expression: { fn: "-", a: { fn: "-", a: "eps", b: null }, b: 1 },
      }),
    ).toThrow("expression.a.b");
  });
});
