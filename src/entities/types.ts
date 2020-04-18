import {
  ID, Timestamp, IParameters, IReadResult, IResultMeta, Persisted,
} from '@/api/types';

export interface IEntity {
  [index: string]: string | number | object | undefined;
}

export interface IEntityResultMeta extends IResultMeta {
  ids: ID[];
}

export interface IEntityParameters extends IParameters {
  keywords: string;
  deadline: number | null;
}

export interface IEntityReadResult<T extends IEntity> extends IReadResult {
  data: Persisted<T>[];
  meta: IResultMeta;
}

export interface INote extends IEntity {
  gist?: string;
  text: string;
}

export interface ITask extends INote {
  deadline?: Timestamp;
  children?: ITask[];
}
