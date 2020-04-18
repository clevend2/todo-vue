import { Store, StoreOptions } from 'vuex';
import notes from '@/store/modules/notes';
import { RootState } from './types';

const options: StoreOptions<RootState> = {
  modules: {
    notes,
  },
};

const rootStore = new Store<RootState>(options);

export default rootStore;
