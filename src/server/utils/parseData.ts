import type { IDate } from "../../shared/IDate";
import type { Field } from "../../shared/manifest";

export type Parser<T> = (value: T) => any;
export type UnParser<T> = (value: any) => T;

const dateParser: Parser<IDate> = (value) => {
  return new Date(value.year, value.month - 1, value.day);
};

const dateUnparser: UnParser<IDate> = (value) => {
  value = new Date(value);
  return {
    day: value.getDate(),
    month: value.getMonth() + 1,
    year: value.getFullYear(),
  };
};

const multiselectParser: Parser<string[]> = (value) => {
  return value.join(",");
};

const multiselectUnparser: UnParser<string[]> = (value) => {
  return value.split(",");
};

const defaultParsers = {
  date: dateParser,
  multiselect: multiselectParser,
};

const defaultUnparsers = {
  date: dateUnparser,
  multiselect: multiselectUnparser,
};

/**
 * parsing is the process of transforming usable data into db savable data
 */
export const parseData = (
  data: any,
  fields: Field[],
  customParsers: Record<string, Parser<any>>
) => {
  const allParsers: Record<string, Parser<any>> = {
    ...defaultParsers,
    ...customParsers,
  };
  const copy = JSON.parse(JSON.stringify(data));
  for (const field of fields) {
    if (field.type in allParsers) {
      const value = copy[field.name];
      if (!value) continue;
      copy[field.name] = allParsers[field.type](value);
    }
  }
  return copy;
};

export const parseField = (
  field: Field,
  value: any,
  customParsers: Record<string, Parser<any>>
) => {
  const allParsers: Record<string, Parser<any>> = {
    ...defaultParsers,
    ...customParsers,
  };
  if (field.type in allParsers) {
    return allParsers[field.type](value);
  }
  return value;
};

/**
 * unparsing is the process of transforming db savable data into usable data
 */
export const unparseData = (
  data: any,
  fields: Field[],
  customUnparsers: Record<string, UnParser<any>>
) => {
  const allUnparsers: Record<string, UnParser<any>> = {
    ...defaultUnparsers,
    ...customUnparsers,
  };
  const copy = JSON.parse(JSON.stringify(data));
  for (const field of fields) {
    if (field.type in allUnparsers) {
      const value = copy[field.name];
      if (!value) continue;
      copy[field.name] = allUnparsers[field.type](value);
    }
  }
  return copy;
};
