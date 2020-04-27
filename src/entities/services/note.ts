import rootStore from '@/store';
import { ID } from '@/api/types';
import { INote } from '@/entities/types';
import { DEFAULT_NOTEBOOK_NOTE } from '@/entities/defaults';

/**
 * Get entity data from either the store or the API
 * if the entity is not in the store.
 */
export async function retrieveNote(noteId: ID) {
  if (!noteId) {
    throw new Error('retrieveNote(): ID not provided');
  }

  let storedNote = rootStore.getters['notes/byId'].get(noteId);

  // if the note doesn't exist in the store, get it into the store
  if (!storedNote) {
    await rootStore.dispatch('notes/read', {
      id: noteId,
    });

    storedNote = rootStore.getters['notes/byId'].get(noteId);
  }

  return storedNote;
}

/**
 * invokes the store to either create or update an entity
 * depending on if the payload includes an ID
 */
export async function sendNote(data: INote) {
  return rootStore.dispatch(data.id ? 'notes/update' : 'notes/create', data);
}

/**
 * Gets entity data, providing default data if no ID is provided
 */
export async function prepareNoteData(noteId?: ID) {
  let data;

  if (noteId) {
    data = await retrieveNote(noteId);
  } else {
    data = {
      ...DEFAULT_NOTEBOOK_NOTE,
    };
  }

  return data;
}
