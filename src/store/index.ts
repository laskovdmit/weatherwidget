import { createStore, createLogger, useStore as baseUseStore, Store, Plugin } from 'vuex';
import { InjectionKey } from 'vue';
import { IRootState } from '../types';
import notification from './modules/notification';
import cities from './modules/cities';

const plugins: Plugin<any>[] = [];

if (process.env.NODE_ENV === 'development') {
  plugins.push(createLogger())
}

export const key: InjectionKey<Store<IRootState>> = Symbol();

export function useStore() {
  return baseUseStore(key);
}

export default createStore<IRootState>({
  plugins,
  state() {
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
  },
  mutations: {
    setLoading(state, payload: boolean) {
      state.loading = payload;
    }
  },
  modules: { notification, cities }
})