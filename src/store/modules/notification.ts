import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { INotificationState, INotification, IRootState } from '../../types';

export default {
  namespaced: true,
  state(): INotificationState {
    return {
      notification: false,
      notificationProps: {},
      timerID: null
    }
  },
  getters: {
    notification(state) {
      return state.notification;
    },
    notificationProps(state) {
      return state.notificationProps;
    },
  } as GetterTree<INotificationState, IRootState>,
  mutations: {
    setNotification(state, payload: boolean) {
      if (state.timerID !== null) {
        clearTimeout(state.timerID);
      }

      if (payload === false) {
        state.notificationProps = {};
      }
      state.notification = payload;
    },
  } as MutationTree<INotificationState>,
  actions: {
    showNotification({ state, commit }, payload) {
      commit('setNotification', true);

      state.notificationProps = {
        type: payload.type,
        message: payload.message
      };

      state.timerID = setTimeout(() => commit('setNotification', false), payload.timeout);
    }
  } as ActionTree<INotificationState, IRootState>
}