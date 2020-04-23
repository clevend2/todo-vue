import {
  IEntity, IEntityParameters, IEntityReadResult, INote,
} from '@/entities/types';
import { logger } from '@/util/index';
import {
  HTTPAction, IParameters, IParameterValue, Persisted,
} from './types';

export const stringifyParameterValue = (v: IParameterValue): string => v.toString();

export const parametersToQueryString = (parameters: IParameters): string => {
  const trimmedArray: [string, string][] = [];

  // remove unecessary parameters and convert to strings
  /* eslint-disable-next-line no-restricted-syntax */
  for (const [k, v] of [...Object.entries(parameters)]) {
    if (v !== null) {
      trimmedArray.push([k, stringifyParameterValue(v)]);
    }
  }

  // typecasting values to strings before parsing
  const asParams = new URLSearchParams(trimmedArray);

  // doesn't matter the sorting as long as its consistent so keys are in the same order
  asParams.sort();

  return asParams.toString();
};

const notes: Persisted<INote>[] = [
  {
    id: '1',
    gist: 'Test gist of note 2',
    text: 'This is a test of the emergency note system',
  },
  {
    id: '2',
    gist: 'Test gist of note 3',
    text:
      'This is a test of the OTHER emergency note system and unfortunately its really long Irure nulla consequat excepteur ad mollit laborum ullamco eiusmod aute. Excepteur pariatur sint exercitation tempor officia. Lorem irure labore dolore et id.',
  },
  {
    id: '3',
    gist: 'Test gist of task 1',
    text: 'We need this done NOW',
    deadline: Date.now(),
  },
  {
    id: '4',
    gist: 'Test gist of task 2',
    text: 'We need this done tomorrow',
    deadline: Date.now() + 3600000,
  },
  {
    id: '5',
    gist: 'Test gist of task 3',
    text: 'We need this done yesterday',
    deadline: Date.now() - 3600000,
  },
];

const notesAPI = {
  async find(parameters: IEntityParameters): Promise<IEntityReadResult<INote>> {
    // mocked
    // TODO: mock some basic filtering here
    return {
      meta: {
        total: notes.length,
        parameters,
      },
      data: notes,
    };
  },
  async update(entity: Persisted<INote>): Promise<IEntity> {
    // mocked
    let updated: IEntity;

    const existingNote: IEntity | undefined = notes.find(
      (note) => (note.id === entity.id),
    );
    if (existingNote) {
      Object.assign(existingNote, entity);

      updated = existingNote;
    } else {
      updated = entity;
    }

    return updated;
  },
  async remove(entity: Persisted<INote>): Promise<IEntity> {
    // mocked
    let removed: IEntity;

    const existingNoteIdx: number = notes.findIndex(
      (note) => (note.id === entity.id),
    );
    if (existingNoteIdx > -1) {
      notes.splice(existingNoteIdx, 1);

      removed = { id: entity.id };
    } else {
      throw new RangeError('404: resource not found');
    }

    return removed;
  },
};

async function fakeREST(action: HTTPAction, URI: string, data?: any): Promise<any> {
  const { pathname, searchParams } = new URL(URI, 'http://fake.com');
  const [, resource, id] = pathname.split('/');
  let parameters: IEntityParameters;
  logger.log('API Request:', action, URI, data);
  if (resource !== 'notes') {
    throw new TypeError('Uhh... this is not notes. We only have notes right now.');
  }

  switch (action) {
    case HTTPAction.PUT:
      // falls through
    case HTTPAction.PATCH:
      // TODO: skinny updates on an entity
      if (!id) {
        break;
      }
      // falls through
    case HTTPAction.POST:
      if (data && data.id) {
        return notesAPI.update(data);
      }
      break;
    case HTTPAction.DELETE:
      if (data) {
        return notesAPI.remove(data);
      }
      break;
    case HTTPAction.GET:
      parameters = {
        keywords: searchParams.get('keywords') || '',
        deadline: Number(searchParams.get('deadline')) || null,
      };

      return notesAPI.find(parameters);
    default:
      throw new SyntaxError('400: Malformed request');
  }

  return null;
}

export const api = fakeREST;
