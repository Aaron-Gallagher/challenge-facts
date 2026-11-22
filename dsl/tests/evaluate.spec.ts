import { evaluate } from "../evaluate";
import { createRepository } from "../repository";

const security = { id: 1, symbol: "TEST" };

const repository = createRepository(
  [security],
  [
    { id: 1, name: "sales" },
    { id: 2, name: "eps" },
  ],
  [{ securityId: 1, attributeId: 1, value: 10 }],
);

describe("evaluate", () => {
  it("multiplies two numbers", () => {
    expect(evaluate({ fn: "*", a: 3, b: 2 }, security, repository)).toBe(6);
  });

  it("evaluates a nested expression", () => {
    expect(
      evaluate(
        { fn: "-", a: { fn: "*", a: 3, b: 2 }, b: 1 },
        security,
        repository,
      ),
    ).toBe(5);
  });

  it("looks up an attribute value", () => {
    expect(evaluate({ fn: "*", a: "sales", b: 2 }, security, repository)).toBe(
      20,
    );
  });

  it("throws on an unknown operator", () => {
    expect(() =>
      evaluate({ fn: "%", a: 1, b: 2 }, security, repository),
    ).toThrow("Unknown operator");
  });

  it("throws on an unknown attribute", () => {
    expect(() =>
      evaluate({ fn: "*", a: "nope", b: 2 }, security, repository),
    ).toThrow("Unknown attribute: nope");
  });

  it("throws when the security has no value for the attribute", () => {
    expect(() =>
      evaluate({ fn: "*", a: "eps", b: 2 }, security, repository),
    ).toThrow("No eps value for TEST");
  });
});
