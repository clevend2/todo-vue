import { INote } from '@/entities/types';
import { errorDecoratorFactory, notify } from '@/util';
import { entitiesMappedById } from '@/entities/getters';
import {
  addEntity,
  modifyEntity,
  removeEntity,
  addResultMeta,
  modifyResultMeta,
} from '@/entities/mutations';
import {
  createEntity, readEntities, updateEntity, deleteEntity,
} from '@/entities/actions';
import { IAPICollectionModule } from '../types';

const BASE_URI = 'notes';

const e = errorDecoratorFactory('notes');

const notes: IAPICollectionModule<INote> = {
  state: {
    data: [],
    resultMeta: {},
  },
  getters: {
    byId: entitiesMappedById,
  },
  mutations: {
    addEntity,
    modifyEntity,
    removeEntity,
    addResultMeta,
    modifyResultMeta,
  },
  actions: {
    async create(context, entity) {
      const result = await createEntity<INote>(e, BASE_URI, context, entity);

      notify('Note created!');

      return result;
    },
    async read(context, parameters) {
      const result = await readEntities<INote>(e, BASE_URI, context, parameters);
      return result;
    },
    async update(context, entity) {
      const result = await updateEntity<INote>(e, BASE_URI, context, entity);

      notify('Note saved!');

      return result;
    },
    async delete(context, entity) {
      await deleteEntity<INote>(e, BASE_URI, context, entity);

      notify('Note deleted.');
    },
  },
};

export default notes;
