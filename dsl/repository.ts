import attributesData from "../data/attributes.json";
import factsData from "../data/facts.json";
import securitiesData from "../data/securities.json";
import { Attribute } from "../models/attribute";
import { Fact } from "../models/fact";
import { Security } from "../models/security";

export interface Repository {
  findSecurity: (symbol: string) => Security | undefined;
  findAttribute: (name: string) => Attribute | undefined;
  findFactValue: (
    securityId: number,
    attributeId: number,
  ) => number | undefined;
}

export const createRepository = (
  securities: Security[],
  attributes: Attribute[],
  facts: Fact[],
): Repository => ({
  findSecurity: (symbol) => securities.find((s) => s.symbol === symbol),
  findAttribute: (name) => attributes.find((a) => a.name === name),
  findFactValue: (securityId, attributeId) =>
    facts.find(
      (f) => f.securityId === securityId && f.attributeId === attributeId,
    )?.value,
});

const facts: Fact[] = factsData.map((fact) => ({
  securityId: fact.security_id,
  attributeId: fact.attribute_id,
  value: fact.value,
}));

export const repository = createRepository(
  securitiesData,
  attributesData,
  facts,
);
