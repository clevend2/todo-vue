import { DEFAULT_PARAMETERS as DEFAULT_API_PARAMETERS } from '@/api/defaults';
import { INote, ITask, IEntityParameters } from './types';

export const DEFAULT_PARAMETERS: IEntityParameters = {
  ...DEFAULT_API_PARAMETERS,
  keywords: '',
  deadline: null,
};

export const DEFAULT_PARAMETER_KEYS: string[] = Object.keys(DEFAULT_PARAMETERS);

export const DEFAULT_NOTEBOOK_NOTE: INote = {
  gist: '',
  text: '',
};

export const DEFAULT_TASK: ITask = {
  ...DEFAULT_NOTEBOOK_NOTE,
  children: [],
};
