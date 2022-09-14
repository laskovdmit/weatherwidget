<template>
  <div
    class="notification"
    :class="notification ? `notification--${notificationProps.type}` : ''"
  >
    <button
      class="notification__close"
      type="button"
      @click="closeNotification"
    >
      &times;
    </button>
    {{ notificationProps.message ? notificationProps.message : '' }}
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '../store';
import { INotification } from '../types';

export default defineComponent({
  setup() {
    const store = useStore();
    const notificationProps = computed<INotification>(() => store.getters['notification/notificationProps']);
    const notification = computed<boolean>(() => store.getters['notification/notification']);

    function closeNotification() {
      store.commit('notification/setNotification', false);
    }

    return {
      notificationProps,
      closeNotification,
      notification
    }
  }
});
</script>