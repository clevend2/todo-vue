import { IAPICollectionContext } from '@/store/types';
import { IEntity, IEntityReadResult, IEntityResultMeta } from '@/entities/types';
import { Persisted, HTTPAction, IParameters } from '@/api/types';
import { api, parametersToQueryString } from '@/api/helpers';
import EntityError from '@/entities/error';

export async function createEntity<T extends IEntity>(
  BASE_URI: string,
  { commit }: IAPICollectionContext<T>,
  entity: T,
): Promise<Persisted<T>> {
  if (entity.id) {
    throw new EntityError('create(): entity payload has ID');
  }

  const result: Persisted<T> = await api(HTTPAction.POST, BASE_URI, entity);

  commit('addEntity', result);

  return result;
}

export async function readEntities<T extends IEntity>(
  BASE_URI: string,
  { commit, state, getters }: IAPICollectionContext<T>,
  parameters: IParameters,
): Promise<IEntityReadResult<T>> {
  const stringifiedParameters = parametersToQueryString(parameters);

  const result: IEntityReadResult<T> = await api(
    HTTPAction.GET,
    `${BASE_URI}?${stringifiedParameters}`,
  );

  const resultMeta: IEntityResultMeta = { ...result.meta, ids: [] };

  result.data.forEach((entity: Persisted<T>) => {
    const existingEntity: Persisted<T> | undefined = getters.byId.get(entity.id);

    if (!existingEntity) {
      commit('addEntity', entity);
    } else {
      commit('modifyEntity', [existingEntity, entity]);
    }
  });

  const existingResultMeta: IEntityResultMeta | undefined = state.resultMeta[stringifiedParameters];

  if (existingResultMeta) {
    commit('modifyResultMeta', [stringifiedParameters, resultMeta]);
  } else {
    commit('addResultMeta', [stringifiedParameters, resultMeta]);
  }

  return result;
}

export async function updateEntity<T extends IEntity>(
  BASE_URI: string,
  { commit, getters }: IAPICollectionContext<T>,
  entity: Persisted<T>,
): Promise<Persisted<T>> {
  if (!entity.id) {
    throw new EntityError('updateEntity(): entity payload has no ID');
  }

  const existingEntity: Persisted<T> | undefined = getters.byId.get(entity.id);

  const result: Persisted<T> = await api(HTTPAction.PUT, `${BASE_URI}/${entity.id}`, entity);

  if (existingEntity) {
    commit('modifyEntity', [existingEntity, result]);
  } else {
    commit('addEntity', result);
  }

  return result;
}

export async function deleteEntity<T extends IEntity>(
  BASE_URI: string,
  { commit, getters }: IAPICollectionContext<T>,
  entity: Persisted<T>,
): Promise<void> {
  if (!entity.id) {
    throw new EntityError('deleteEntity(): entity payload has no ID');
  }

  await api(HTTPAction.DELETE, `${BASE_URI}/${entity.id}`);

  const existingEntity: Persisted<T> | undefined = getters.byId.get(entity.id);
  if (existingEntity) {
    commit('removeEntity', existingEntity.id);
  }
}
