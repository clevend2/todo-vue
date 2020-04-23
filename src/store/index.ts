import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import notes from '@/store/modules/notes';
import { RootState } from './types';

const options: StoreOptions<RootState> = {
  modules: {
    notes,
  },
};

Vue.use(Vuex);

const rootStore = new Vuex.Store<RootState>(options);

export default rootStore;
