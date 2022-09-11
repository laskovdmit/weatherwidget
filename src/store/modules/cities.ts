import axios from 'axios';
import { Module } from 'vuex';
import {
  ICitiesWeatherState,
  ICityWeather,
  IRootState,
  MessageType
} from '../../types';

export default {
  namespaced: true,
  state() {
    return {
      citiesWeather: [],
    }
  },
  getters: {
    citiesWeather(state) {
      return state.citiesWeather.sort((a, b) => {
        return a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
      });
    }
  },
  mutations: {
    setCitiesWeather(state, payload: ICityWeather[] ) {
      state.citiesWeather = payload;
      
      if (payload.length) {
        localStorage.weatherCities = JSON.stringify(state.citiesWeather);
      } else {
        localStorage.removeItem('weatherCities');
      }
    },
    removeCityWeather(state, id: number) {
      const idx = state.citiesWeather.findIndex(item => item.id === id);

      const arr = [
        ...state.citiesWeather.slice(0, idx),
        ...state.citiesWeather.slice(idx + 1).map((item, i) => {
          return { ...item, order: i + idx + 1 }
        })
      ];

      state.citiesWeather = arr;
      
      if (state.citiesWeather.length) {
        localStorage.weatherCities = JSON.stringify(state.citiesWeather);
      } else {
        localStorage.removeItem('weatherCities');
      }
    }
  },
  actions: {
    async addCity({ state, commit, rootState, dispatch }, city: ICityWeather) {
      commit('setLoading', true, { root: true });

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${rootState.API_KEY}&units=metric&lang=ru`;

      await axios(url)
        .then(response => {
          if (state.citiesWeather.findIndex(item => item.id === response.data.id) === -1) {
            state.citiesWeather.push({ ...response.data, order: city.order });
            localStorage.weatherCities = JSON.stringify(state.citiesWeather);
          } else {
            dispatch('notification/showNotification', {
              type: MessageType.WARNING,
              message: 'Данный населенный пункт уже добавлен',
              timeout: 3000
            }, { root: true });
          }
        })
        .catch(err => {
          dispatch('notification/showNotification', {
            type: MessageType.ERROR,
            message: err.message,
            timeout: 3000
          }, { root: true });
        })
        .finally(() => commit('setLoading', false, { root: true }));
    },
    async refresh({ state, commit, dispatch, rootState }) {
      if (!state.citiesWeather.length) return;

      commit('setLoading', true, { root: true });
      const arr: ICityWeather[] = [];

      for (let i = 0; i < state.citiesWeather.length; i++) {
        const city = state.citiesWeather[i];
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${rootState.API_KEY}&units=metric&lang=ru`;
        
        await axios(url)
          .then(response => {
            arr.push({ ...response.data, order: city.order });
          })
          .catch(err => {
            dispatch('notification/showNotification', {
              type: MessageType.ERROR,
              message: err.message,
              timeout: 3000
            }, { root: true });
            arr.push(city);
          });
      }

      commit('setCitiesWeather', arr);
      commit('setLoading', false, { root: true });
    }
  }
} as Module<ICitiesWeatherState, IRootState>