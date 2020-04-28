import {
  IEntity, IEntityParameters, IEntityReadResult, INote,
} from '@/entities/types';
import { logger } from '@/util/index';
import {
  HTTPAction, IParameters, IParameterValue, Persisted, ID,
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

let maxId = notes.length;

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
  async create(entityData: INote): Promise<Persisted<INote>> {
    // mocked
    let created: Persisted<INote>;

    if (entityData.id) {
      throw new Error('400: POST request body includes ID');
    } else {
      maxId += 1;

      created = {
        ...entityData,
        id: `${maxId}`,
      };

      notes.push(created);
    }

    return created;
  },
  async update(entityId: ID, entityData: INote): Promise<Persisted<INote>> {
    // mocked
    let updated: Persisted<INote>;

    const existingNote: Persisted<INote> | undefined = notes.find(
      (note) => (note.id === entityId),
    );
    if (existingNote) {
      Object.assign(existingNote, entityData);

      updated = existingNote;
    } else {
      throw new Error('404: resource not found');
    }

    return updated;
  },
  async remove(entityId: ID): Promise<Persisted<IEntity>> {
    // mocked
    let removed: Persisted<IEntity>;

    const existingNoteIdx: number = notes.findIndex(
      (note) => (note.id === entityId),
    );
    if (existingNoteIdx > -1) {
      notes.splice(existingNoteIdx, 1);

      removed = { id: entityId };
    } else {
      throw new Error('404: resource not found');
    }

    return removed;
  },
};

async function fakeREST(action: HTTPAction, path: string, body?: any): Promise<any> {
  // shimming a real URL here so it can be parsed by URL() constructor
  const { pathname, searchParams } = new URL(path, 'http://fake.fake');
  const [, resource, id] = pathname.split('/');
  let parameters: IEntityParameters;

  logger.log('API Request:', action, path, body);

  if (resource !== 'notes') {
    throw new Error('Uhh... this is not notes. We only have notes right now.');
  }

  switch (action) {
    case HTTPAction.PUT:
      // falls through
    case HTTPAction.PATCH:
      // TODO: skinny updates on an entity
      if (id && body) {
        return notesAPI.update(id, body);
      }
      break;
    case HTTPAction.POST:
      if (body) {
        return notesAPI.create(body);
      }
      break;
    case HTTPAction.DELETE:
      if (id) {
        return notesAPI.remove(id);
      }
      break;
    case HTTPAction.GET:
      parameters = {
        keywords: searchParams.get('keywords') || '',
        deadline: Number(searchParams.get('deadline')) || null,
      };

      return notesAPI.find(parameters);
    default:
      throw new Error('400: Malformed request');
  }

  return null;
}

/**
 * put an artificial delay in front of a function return
 * between .5-1.5 seconds
 */
function mockDelay(fn: Function): Function {
  return async (...args: any[]) => new Promise((resolve) => setTimeout(
    () => {
      resolve(fn(...args));
    },
    500 + (Math.random() * 1000),
  ));
}

export const api = mockDelay(fakeREST);
