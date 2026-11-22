import { ValidationError } from "./errors";
import { operators } from "./operators";
import { Argument, Expression, Query } from "./types";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const validateQuery = (input: unknown): Query => {
  if (!isObject(input)) {
    throw new ValidationError("Query must be a JSON object");
  }

  if (typeof input.security !== "string") {
    throw new ValidationError("security: expected a string");
  }

  return {
    security: input.security,
    expression: validateExpression(input.expression, "expression"),
  };
};

const validateExpression = (value: unknown, path: string): Expression => {
  if (!isObject(value)) {
    throw new ValidationError(`${path}: expected an expression object`);
  }

  if (typeof value.fn !== "string" || !operators.has(value.fn)) {
    const known = [...operators.keys()].join(", ");
    throw new ValidationError(`${path}.fn: expected one of ${known}`);
  }

  return {
    fn: value.fn,
    a: validateArgument(value.a, `${path}.a`),
    b: validateArgument(value.b, `${path}.b`),
  };
};

const validateArgument = (value: unknown, path: string): Argument => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return value;
  }

  if (isObject(value)) {
    return validateExpression(value, path);
  }

  throw new ValidationError(
    `${path}: expected a number, attribute name or expression`,
  );
};
