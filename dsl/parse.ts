import { ParseError } from "./errors";

export const parse = (query: string): unknown => {
  try {
    return JSON.parse(query);
  } catch (error) {
    throw new ParseError(
      error instanceof Error ? error.message : "Invalid JSON"
    );
  }
};