<template>
  <div class="widget__city">
    <span>{{ city.name }}, {{ city.sys.country }}</span>
    <div class="widget__icon">
      <img
        :src="'http://openweathermap.org/img/wn/' + city.weather[0].icon + '.png'"
        alt="Текущая погода"
        class=""
      />
    </div>
    <span>Погода: {{ city.weather[0].main }}</span>
    <span>Подробнее: {{ city.weather[0].description }}</span>
    <span>Температура: {{ city.main.temp }} °C</span>
    <span>Ощущается как: {{ city.main.feels_like }} °C</span>
    <span>Видимость: {{ city.visibility / 1000 }} км</span>
    <span>Влажность: {{ city.main.humidity }} %</span>
    <span>Ветер: {{ city.wind.speed }} м/с</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['city'],
  setup() {
    return {}
  }
});
</script>