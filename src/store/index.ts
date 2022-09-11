import {
  createStore,
  createLogger,
  Plugin,
  GetterTree,
  MutationTree,
  ModuleTree
} from 'vuex';
import { IRootState } from '../types';
import notification from './modules/notification';
import cities from './modules/cities';

const plugins: Plugin<any>[] = [];

if (process.env.NODE_ENV === 'development') {
  plugins.push(createLogger())
}

export default createStore({
  plugins,
  state(): IRootState {
    return {
      API_KEY: 'b6f6d966711733ed6823c3e826a29e7b',
      loading: false,
    }
  },
  getters: {
    apiKey(state) {
      return state.API_KEY;
    },
    loading(state) {
      return state.loading;
    }
  } as GetterTree<IRootState, IRootState>,
  mutations: {
    setLoading(state, payload: boolean) {
      state.loading = payload;
    }
  } as MutationTree<IRootState>,
  modules: { notification, cities } as ModuleTree<IRootState>
})
export { IRootState }