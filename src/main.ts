import { createApp } from 'vue';
import App from './App.vue';
import store, { key } from './store';
import './scss/style.scss';

createApp(App).use(store, key).mount('#app');
