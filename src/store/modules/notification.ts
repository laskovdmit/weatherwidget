import { Module } from 'vuex';
import { INotificationState, INotification, IRootState } from '../../types';

export default {
  namespaced: true,
  state() {
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
  },
  mutations: {
    setNotification(state, payload: boolean) {
      if (state.timerID !== null) {
        clearTimeout(state.timerID);
      }
      
      state.notification = payload;
    },
  },
  actions: {
    showNotification({ state, commit }, payload: INotification) {
      commit('setNotification', true);

      state.notificationProps = {
        type: payload.type,
        message: payload.message
      };

      state.timerID = setTimeout(() => commit('setNotification', false), payload.timeout);
    }
  }
} as Module<INotificationState, IRootState>