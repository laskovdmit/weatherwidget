<template>
  <div class="widget__settings settings">
    <div class="settings__header">
      <div class="settings__title">Настройки виджета</div>
      <button
        class="settings__close"
        type="button"
        @click="$emit('close')"
      >
        &times;
      </button>
    </div>
    <div class="settings__section">
      <settings-city-list />
    </div>
    <div class="settings__section">
      <input
        v-model="cityName"
        class="settings__input"
        type="input"
        placeholder="Введиет населенный пункт"
        @input="getClues"
        @keypress="preventInput"
      >
      <ul v-if="cityList.length" class="settings__list settings__list--clues">
        <li
          v-for="(city, i) in cityList"
          class="settings__item"
          :key="i"
          @click="chooseCity(city)"
        >
          <button type="button" class="settings__btn">
            {{ city.name }}, {{ city.country }}
          </button>
        </li>
      </ul>
      <div v-else class="settings__text">
        Нет совпадения
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted, onUnmounted, computed } from 'vue';
import { useStore } from '../store';
import axios from 'axios';
import { ICity, MessageType } from '../types';
import SettingsCityList from '@/components/SettingsCityList.vue';

export default defineComponent({
  emits: ['close'],
  setup(_, { emit }) {
    const store = useStore();
    const key: string = store.getters['apiKey'];

    const citiesLength = computed<number>(() => {
      return store.getters['cities/citiesWeather'].length;
    });

    const cityList: Ref<ICity[]> = ref([]);
    let cityName: Ref<string> = ref('');
    let timeout: boolean = false; 
    let lastInput: string = '';

    function getClues(event: Event) {
      const val = (event.target as HTMLInputElement).value;

      if (val === '') {
        cityList.value = [];
        return;
      }

      if (timeout) {
        lastInput = val;
      } else {
        timeout = true;

        setTimeout(() => {
          timeout = false;

          if (lastInput && val && lastInput !== val) {
            getGeocode(lastInput);
            lastInput = '';
          }
        }, 1000);

        getGeocode(val);
      }
    }
    
    async function getGeocode(input: string) {
      await axios.get<ICity[]>(`http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${key}`)
        .then(response => {
          cityList.value = response.data.map(city => {
            const name: string = city.local_names && city.local_names.ru ? city.local_names.ru : city.name;

            return {
              name,
              lat: city.lat,
              lon: city.lon,
              country: city.country
            }
          });
        })
        .catch(err => {
          store.dispatch('notification/showNotification', {
            type: MessageType.ERROR,
            message: err.message,
            timeout: 3000
          });
        })
    }

    function chooseCity(city: ICity) {
      store.dispatch('cities/addCity', {
        order: citiesLength.value + 1,
        coord: {
          lon: city.lon,
          lat: city.lat,
        }
      });
      emit('close');
    }

    function preventInput(event: KeyboardEvent) {
      const regExp = /[А-ЯЁ]|[а-яё]|[^_\W]|\.|,|-|\/|\\|\s/ig;

      if (!event.key.match(regExp)) {
        event.preventDefault();
        
        store.dispatch('notification/showNotification', {
          type: MessageType.WARNING,
          message: 'Можно ввести только буквы/цифры, пробел и .,-\\/',
          timeout: 3000
        });
      }
    }

    const escPress = (event: KeyboardEvent) => event.code === 'Escape' ? emit('close'): null;
    onMounted(() => window.addEventListener('keydown', escPress));
    onUnmounted(() => window.removeEventListener('keydown', escPress));

    return {
      cityName,
      getClues,
      cityList,
      chooseCity,
      preventInput
    }
  },
  components: { SettingsCityList }
});
</script>