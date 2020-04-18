export type Timestamp = number;

export type ID = string;

export type Cursor = number;

export enum HTTPAction {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export type IParameterValue = string | number | Array<string | number>;

export interface IParameters {
  [index: string]: IParameterValue | null;
}

export interface IPaginationAfter extends IParameters {
  first: number;
  after: Cursor;
}

export interface IPaginationBefore extends IParameters {
  last: number;
  before: Cursor;
}

export interface IResultMeta {
  total: number;
  parameters: IParameters;
}

export interface IReadResult {
  meta: IResultMeta;
  data: object | any[];
}

export type Persisted<T> = {
  [P in keyof T]?: T[P];
} & { id: ID };
