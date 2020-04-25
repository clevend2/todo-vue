import { IAPICollectionModule } from '@/store/types';
import { INote } from '@/entities/types';
import { notify } from '@/util';
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

const BASE_URI = 'notes';

const notes: IAPICollectionModule<INote> = {
  namespaced: true,
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
      const result = await createEntity<INote>(BASE_URI, context, entity);

      notify('Note created!');

      return result;
    },
    async read(context, parameters) {
      const result = await readEntities<INote>(BASE_URI, context, parameters);
      return result;
    },
    async update(context, entity) {
      const result = await updateEntity<INote>(BASE_URI, context, entity);

      notify('Note saved!');

      return result;
    },
    async delete(context, entity) {
      await deleteEntity<INote>(BASE_URI, context, entity);

      notify('Note deleted.');
    },
  },
};

export default notes;
