<template>
  <div :class="[
    'notification',
    `notification--${props.type ? props.type : 'success'}`
  ]">
    <button
      class="notification__close"
      type="button"
      @click="closeNotification"
    >
      &times;
    </button>
    {{ props.message ? props.message : 'Успех!' }}
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();
    const props = computed(() => store.getters['notification/notificationProps']);

    function closeNotification() {
      store.commit('notification/setNotification', false);
    }

    return {
      props,
      closeNotification
    }
  }
});
</script>