<template>
  <div class="widget__city">
    <span>City: {{ city.name }}</span>
    <span>Weather: {{ city.weather[0].main }}</span>
    <span>Details: {{ city.weather[0].description }}</span>
    <span>Feels like: {{ city.main.feels_like }}</span>
    <span>Pressure: {{ city.main.pressure }}</span>
    <span>Wind speed: {{ city.wind.speed }} miles/hour</span>
    <span>Clouds: {{ city.clouds.all }} %</span>
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