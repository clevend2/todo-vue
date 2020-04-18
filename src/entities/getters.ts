/* eslint-disable import/prefer-default-export */

import { Persisted } from '@/api/types';
import { IEntity } from '@/entities/types';
import { IAPICollectionState, IPersistedMap } from '@/store/types';
import { makeMapReadOnly } from '@/util';

export function entitiesMappedById<T extends IEntity>(
  state: IAPICollectionState<T>,
): IPersistedMap<T> {
  const map = state.data.reduce((byId: IPersistedMap<T>, entity: Persisted<T>) => {
    if (entity.id) {
      byId.set(entity.id, entity);
    }

    return byId;
  }, new Map());

  return makeMapReadOnly(map);
}
