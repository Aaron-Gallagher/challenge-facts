import { run } from "../run";

describe("run", () => {

  it("multiplies an attribute by a number", () => {
    const result = run(
      '{ "expression": { "fn": "*", "a": "sales", "b": 2 }, "security": "ABC" }',
    );
    expect(result).toEqual({ ok: true, value: 8 });
  });
  
  it('Divides', () => {
    const result = run(
      '{ "expression": {"fn": "/", "a": "price", "b": "eps"}, "security": "BCD" }',
    );
    expect(result).toEqual({ ok: true, value: 0.5 });
  });

  it("returns a lookup error for an unknown attribute inside a nested expression", () => {
    const result = run(
      '{ "expression": { "fn": "*", "a": { "fn": "-", "a": "sales", "b": "costs" }, "b": 2 }, "security": "ABC" }',
    );
    expect(result).toEqual({
      ok: false,
      kind: "lookup",
      message: "Unknown attribute: costs",
    });
  });

  it('validates against a nested expression with a number', () => {
    const result = run(
      '{ "expression": { "fn": "*", "a": { "fn": "-", "a": "sales", "b": 2 }, "b": 2 }, "security": "ABC" }',
    );
    expect(result).toEqual({ ok: true, value: 4 });
  });

  it("evaluates the nested README example", () => {
    const result = run(
      '{ "expression": { "fn": "-", "a": { "fn": "-", "a": "eps", "b": "shares" }, "b": { "fn": "-", "a": "assets", "b": "liabilities" } }, "security": "CDE" }',
    );
    expect(result).toEqual({ ok: true, value: -21 });
  });

  it("returns a parse error for invalid JSON", () => {
    const result = run(
      '{ "expression": { "fn": "+", "a": "price", "b": "eps" }, "security": "BCD"',
    );
    expect(result).toMatchObject({ ok: false, kind: "parse" });
  });

  it("returns a validation error for a query with the wrong shape", () => {
    const result = run('{ "wrong": 123, "security": "BCD" }');
    expect(result).toEqual({
      ok: false,
      kind: "validation",
      message: "expression: expected an expression object",
    });
  });

  it("returns a lookup error for an unknown security", () => {
    const result = run(
      '{ "expression": { "fn": "*", "a": "sales", "b": 2 }, "security": "ZZZ" }',
    );
    expect(result).toEqual({
      ok: false,
      kind: "lookup",
      message: "Unknown security: ZZZ",
    });
  });

  it("returns an evaluation error when dividing by zero", () => {
    const result = run(
      '{ "expression": { "fn": "/", "a": "price", "b": 0 }, "security": "ABC" }',
    );
    expect(result).toEqual({
      ok: false,
      kind: "evaluation",
      message: "Cannot divide by zero",
    });
  });
});