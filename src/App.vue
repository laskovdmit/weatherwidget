<template>
  <div :class="['widget', { 'widget--setting': isActive }]">
    <button
      v-if="!loading && citiesWeather.length"
      class="widget__btn widget__btn--refresh"
      type="button"
      @click="refresh"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
        <path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"/>
      </svg>
    </button>
    <button
      v-if="!loading && citiesWeather.length"
      class="widget__btn widget__btn--settings"
      type="button"
      @click="isActive = !isActive"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
        <path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z"/>
      </svg>
    </button>
    <div v-if="!loading" class="widget__list">
      <template v-if="citiesWeather.length">
        <div
          ref="wrap"
          class="widget__wrap"
          :style="{
            width: citiesWeather.length * 100 + '%',
            transform: `translate(-${slideWidth}px, 0)`
          }"
        >
          <city-item 
            v-for="city in citiesWeather"
            :key="city.id"
            :city="city"
          />
        </div>
        <div v-if="!isActive" class="widget__controls">
          <button
            v-if="currentSlide !== 0"
            class="widget__arrow widget__arrow--left"
            @click="currentSlide -= 1"
          >
            &#8592;
          </button>
          <button
            v-if="currentSlide !== citiesWeather.length - 1"
            class="widget__arrow widget__arrow--right"
            @click="currentSlide += 1"
          >
            &#8594;
          </button>
        </div>
      </template>
      <div v-else class="widget__empty">
        <div class="widget__message">Не выбран населенный пункт</div>
        <button
          type="button"
          class="widget__setcity"
          @click="isActive = true"
        >
          Выбрать  
        </button>
      </div>
    </div>
    <div v-else class="widget__spinner">
      <spinner />
    </div>
    <settings
      v-if="isActive"
      @close="isActive = false"
      @remove-sity="currentSlide = 0"
    />
    <notification :class="notification ? 'notification--show' : ''" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useStore } from './store';
import { WeatherDetails, ICityProps } from './types';
import CityItem from '@/components/CityItem.vue';
import Settings from '@/components/Settings.vue';
import Spinner from '@/components/Spinner.vue';
import Notification from '@/components/Notification.vue';

export default defineComponent({
  setup() {
    const store = useStore();
    let isActive = ref<boolean>(false); 
    const wrap = ref<HTMLInputElement | null>(null);

    const loading = computed<boolean>(() => store.getters['loading']);
    const notification = computed<boolean>(() => store.getters['notification/notification']);

    onMounted(() => {
      if (localStorage.weatherCities) {
        const cities: WeatherDetails[] = JSON.parse(localStorage.weatherCities);

        cities.forEach(city => {
          if ('coord' in city && 'order' in city) {
            store.dispatch('cities/addCity', {
              order: city.order,
              coord: {
                lat: city.coord.lat,
                lon: city.coord.lon
              }
            } as ICityProps);
          }
        });
      } else if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          store.dispatch('cities/addCity', {
            order: 1,
            coord: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            }
          } as ICityProps);
        });
      }
    });

    const citiesWeather = computed<WeatherDetails[]>(() => {
      return store.getters['cities/citiesWeather'];
    });

    let currentSlide = ref<number>(0);
    function refresh() {
      store.dispatch('cities/refresh');
      currentSlide.value = 0
    }

    const slideWidth = computed<number>(() => {
      if (wrap.value) {
        return (wrap.value.getBoundingClientRect().width / citiesWeather.value.length) * currentSlide.value;
      } else {
        return 0;
      }
    });

    return {
      loading,
      notification,
      isActive,
      citiesWeather,
      refresh,
      currentSlide,
      wrap,
      slideWidth
    }
  },
  components: { CityItem, Settings, Spinner, Notification }
})
</script>