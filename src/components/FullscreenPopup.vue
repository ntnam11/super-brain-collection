<template>
  <div class="container">
    <div class="modal-container">
      <div class="modal-title">
        <span>{{ props.title }}</span>
      </div>
      <div class="popup-description">
        <span>{{ props.description }}</span>
      </div>
      <div class="popup-actions" v-if="props.actions">
        <button v-for="action in props.actions" v-bind:key="action.name" @click="action.action">
          {{ action.name }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface PopupActionProps {
  name: string
  action: void
}

interface PopupProps {
  title: string
  description: string
  actions: PopupActionProps[]
}

const props = withDefaults(defineProps<PopupProps>(), {
  title: 'Popup Title',
  description: 'Popup Content'
})
</script>
<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;

  .modal-container {
    max-width: 1320px;
    margin: auto;
  }

  .modal-title {
  }
}
</style>
