import {
  ActionContext,
  ActionTree,
  Module,
  Mutation,
  GetterTree,
  Getter,
  MutationTree,
} from 'vuex/types/index';

import { ID, Persisted } from '@/api/types';
import { IEntity, IEntityReadResult, IEntityResultMeta } from '../entities/types';

export type RootState = object;

interface IEntityResultMetaDictionary {
  [index: string]: IEntityResultMeta;
}

export interface IAPICollectionState<T extends IEntity> {
  data: Persisted<T>[];
  resultMeta: IEntityResultMetaDictionary;
  [index: string]: any;
}

interface IAPICollectionMutation<T extends IEntity> extends Mutation<IAPICollectionState<T>> {
  <T extends IEntity>(state: IAPICollectionState<T>, payload: any): void;
}

interface IAPICollectionMutations<T extends IEntity> extends MutationTree<IAPICollectionState<T>> {
  [index: string]: IAPICollectionMutation<T>;
}

interface IAPICollectionGetter<T extends IEntity>
  extends Getter<IAPICollectionState<T>, RootState> {
  <T extends IEntity>(
    state: IAPICollectionState<T>,
    getters: any,
    rootState: RootState,
    rootGetters: any
  ): any;
}

export type IPersistedMap<T> = Map<ID, Persisted<T>>;

interface IAPICollectionGetters<T extends IEntity>
  extends GetterTree<IAPICollectionState<T>, RootState> {
  byId: (state: IAPICollectionState<T>) => IPersistedMap<T>;
  [index: string]: IAPICollectionGetter<T>;
}

// this is here to enforce that all entity actions are standardized in their return
// * always async
// * either returns an entity, an array of entities, or nothing
interface IEntityAction<S, T extends IEntity> {
  (context: ActionContext<S, RootState>, payload: any): Promise<
    Persisted<T> | IEntityReadResult<T> | void
  >;
}

interface IEntityActions<S, T extends IEntity> extends ActionTree<S, RootState> {
  [index: string]: IEntityAction<S, T>;
}

export interface IAPICollectionContextGetters<T extends IEntity> {
  byId: IPersistedMap<T>;
}

export interface IAPICollectionContext<T extends IEntity>
  extends ActionContext<IAPICollectionState<T>, RootState> {
  getters: IAPICollectionContextGetters<T>;
}

export interface IEntityModule<S, T extends IEntity> extends Module<S, RootState> {
  actions: IEntityActions<S, T>;
}

export interface IAPICollectionModule<T extends IEntity>
  extends IEntityModule<IAPICollectionState<T>, T> {
  mutations: IAPICollectionMutations<T>;
  getters: IAPICollectionGetters<T>;
}
