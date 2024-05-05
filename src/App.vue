<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <div class="nav-container">
      <RouterLink to="/">Home</RouterLink>
    </div>
    <div class="body-container">
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="scss">
nav a:first-of-type {
  border: 0;
}

.app-container {
  width: 100vw;
  height: 100vh;

  .nav-container {
    min-height: 50px;
    display: flex;
    max-width: 1320px;
    margin: auto;
    padding: 0 1rem;

    a {
      padding: 1rem;
    }
  }

  .body-container {
    padding: 2rem;
  }
}
</style>
