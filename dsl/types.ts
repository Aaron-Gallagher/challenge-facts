export type Argument = number | string | Expression;

export interface Expression {
  fn: string;
  a: Argument;
  b: Argument;
}

export interface Query {
  security: string;
  expression: Expression;
}
