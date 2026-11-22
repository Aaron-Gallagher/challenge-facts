import { Security } from "../models/security";
import { operators } from "./operators";
import { Repository } from "./repository";
import { Argument, Expression } from "./types";
import { LookupError } from "./errors";

export const evaluate = (
  expression: Expression,
  security: Security,
  repository: Repository,
): number => {
  const operator = operators.get(expression.fn);
  if (!operator) {
    throw new LookupError(`Unknown operator: ${expression.fn}`);
  }

  const a =   resolveArgument(expression.a, security, repository);
  const b = resolveArgument(expression.b, security, repository);

  return operator(a, b);
};

const resolveArgument = (
  argument: Argument,
  security: Security,
  repository: Repository,
): number => {
  if (typeof argument === "number") {
    return argument;
  }

  if (typeof argument === "string") {
    return lookupAttribute(argument, security, repository);
  }

  return evaluate(argument, security, repository);
};

const lookupAttribute = (
  name: string,
  security: Security,
  repository: Repository,
): number => {
  const attribute = repository.findAttribute(name);
  if (!attribute) {
    throw new LookupError(`Unknown attribute: ${name}`);
  }

  const value = repository.findFactValue(security.id, attribute.id);
  if (value === undefined) {
    throw new LookupError(`No ${name} value for ${security.symbol}`);
  }

  return value;
};
