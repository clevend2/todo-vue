import { IAPICollectionState } from '@/store/types';
import { IEntity, IEntityResultMeta } from '@/entities/types';
import { ID, Persisted } from '@/api/types';

export function addEntity<T extends IEntity>(
  state: IAPICollectionState<T>,
  entity: Persisted<T>,
): void {
  state.data.push(entity);
}

export function modifyEntity<T extends IEntity>(
  state: IAPICollectionState<T>,
  [original, modified]: [Persisted<T>, Persisted<T>],
): void {
  Object.assign(original, modified);
}

export function removeEntity<T extends IEntity>(state: IAPICollectionState<T>, entityId: ID): void {
  state.data = state.data.filter((entity) => entity.id !== entityId);
}

export function addResultMeta<T extends IEntity>(
  state: IAPICollectionState<T>,
  [parameterString, resultMeta]: [string, IEntityResultMeta],
): void {
  state.resultMeta[parameterString] = resultMeta;
}

export function modifyResultMeta<T extends IEntity>(
  state: IAPICollectionState<T>,
  [parameterString, modified]: [string, IEntityResultMeta],
): void {
  Object.assign(state.resultMeta[parameterString], modified);

  // dedupe ids
  state.resultMeta[parameterString].ids = [...new Set(state.resultMeta[parameterString].ids)];
}
