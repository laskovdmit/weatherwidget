import axios from 'axios';
import { GetterTree, MutationTree, ActionTree } from 'vuex';
import {
  ICitiesWeatherState,
  ICityWeather,
  IRootState,
  ICityParams, 
  MessageType
} from '../../types';

export default {
  namespaced: true,
  state(): ICitiesWeatherState {
    return {
      citiesWeather: [],
    }
  },
  getters: {
    citiesWeather(state) {
      return state.citiesWeather.sort((a: ICityWeather, b: ICityWeather) => {
        return a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
      });
    }
  } as GetterTree<ICitiesWeatherState, IRootState>,
  mutations: {
    setCitiesWeather(state, payload: ICityWeather[] ) {
      state.citiesWeather = payload;
      localStorage.weatherCities = JSON.stringify(state.citiesWeather);
    },
    addCityWeather(state, payload: ICityWeather) {
      state.citiesWeather.push(payload);
      localStorage.weatherCities = JSON.stringify(state.citiesWeather);
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
  } as MutationTree<ICitiesWeatherState>,
  actions: {
    async addCity({ state, commit, rootState, dispatch }, city: ICityParams) {
      commit('setLoading', true, { root: true });

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${rootState.API_KEY}`;

      await axios(url)
        .then(response => {
          if (state.citiesWeather.findIndex(item => item.id === response.data.id) === -1) {
            commit('addCityWeather', { ...response.data, order: city.order });
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
    }
  } as ActionTree<ICitiesWeatherState, IRootState>
}