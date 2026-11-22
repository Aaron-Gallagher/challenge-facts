import { evaluate } from "./evaluate";
import {
  EvaluationError,
  LookupError,
  ParseError,
  ValidationError,
} from "./errors";
import { parse } from "./parse";
import { Repository, repository as defaultRepository } from "./repository";
import { validateQuery } from "./validate";

export type ErrorKind =
  | "parse"
  | "validation"
  | "lookup"
  | "evaluation"
  | "unknown";

export type RunResult =
  { ok: true; value: number } | { ok: false; kind: ErrorKind; message: string };

export const run = (
  text: string,
  repository: Repository = defaultRepository,
): RunResult => {
  try {
    const query = validateQuery(parse(text));

    const security = repository.findSecurity(query.security);
    if (!security) {
      throw new LookupError(`Unknown security: ${query.security}`);
    }

    const value = evaluate(query.expression, security, repository);
    return { ok: true, value };
  } catch (error) {
    return {
      ok: false,
      kind: errorKind(error),
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

const errorKind = (error: unknown): ErrorKind => {
  if (error instanceof ParseError) return "parse";
  if (error instanceof ValidationError) return "validation";
  if (error instanceof LookupError) return "lookup";
  if (error instanceof EvaluationError) return "evaluation";
  return "unknown";
};
