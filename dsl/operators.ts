import { EvaluationError } from "./errors";

export type OperatorFn = (a: number, b: number) => number;

export const operators = new Map<string, OperatorFn>([
  ["+", (a, b) => a + b],
  ["-", (a, b) => a - b],
  ["*", (a, b) => a * b],
  [
    "/",
    (a, b) => {
      if (b === 0) {
        throw new EvaluationError("Cannot divide by zero");
      }
      return a / b;
    },
  ],
]);
