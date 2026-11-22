import { parse } from "../parse";
import { ParseError } from "../errors";

describe('Parse', () => {
  it('should parse valid JSON', () => {
    const query = '{"key": "value"}';
    const result = parse(query);
    expect(result).toEqual({ key: "value" });
  });

  it('should throw ParseError for invalid JSON', () => {
    const query = '{"key": "value"';
    expect(() => parse(query)).toThrow(ParseError);
  });
})