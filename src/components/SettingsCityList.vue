<template>
  <ul
    v-if="addedCities.length"
    class="settings__list"
    @dragover.prevent
    @dragenter.prevent
  >
    <li
      v-for="city in addedCities"
      :key="city.id"
      class="settings__city"
      draggable="true"
      @dragstart="dragStart($event, city)"
      @dragover="dragOver(city)"
    >
      <button
        type="button"
        class="settings__drag"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
          <path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z"/>
        </svg>
      </button>
      {{ cutName(city.name) }}
      <button
        type="button"
        class="settings__trash"
        @click="removeCity(city.id)"
        @dragstart.stop
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"/>
        </svg>
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { WeatherDetails } from '../types';
import { useStore } from '../store';

export default defineComponent({
  emits: ['remove-sity'],
  setup(_, { emit }) {
    const store = useStore();
    const addedCities = computed<WeatherDetails[]>({
      get() {
        return store.getters['cities/citiesWeather'];
      },
      set(val) {
        store.commit('cities/setCitiesWeather', val);
      }
    });
    let activeElemId: number;

    function cutName(name: string) {
      return name.length > 23 ? name.slice(0, 22) + '...' : name;
    }

    function removeCity(id: number) {
      store.commit('cities/removeCityWeather', id);
      emit('remove-sity');
    }

    function dragStart(event: DragEvent, city: WeatherDetails) {
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.dropEffect = "move";
      }
      activeElemId = city.id;
    }

    function dragOver(city: WeatherDetails) {
      if (city.id === activeElemId) return;

      const otherCities = addedCities.value.filter(item => {
        return item.id !== city.id && item.id !== activeElemId;
      });


      const activeCity = addedCities.value.find(item => item.id === activeElemId);
      if (activeCity) {
        addedCities.value = [
          ...otherCities,
          { ...activeCity, order: city.order },
          { ...city, order: activeCity.order }
        ];
      }
    }

    return {
      cutName,
      addedCities,
      removeCity,
      dragStart,
      dragOver,
    }
  }
});
</script>