<template>
  <div class="app-container">
    <div class="nav-container">
      <RouterLink to="/">Home</RouterLink>
    </div>
    <h1 id="page-title"></h1>
    <div class="body-container">
      <RouterView />
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import router from './router'

router.beforeEach((to, from, next) => {
  let title = document.getElementById('page-title')
  if (title) {
    title.innerHTML = to.meta.title as string
  }
  next()
})
</script>
<style scoped lang="scss">
#page-title {
  max-width: 1320px;
  margin: 1rem auto;
}

.app-container {
  width: 100vw;
  height: 100vh;

  .nav-container {
    min-height: 50px;
    display: flex;
    max-width: 1320px;
    margin: auto;

    a {
      padding: 1rem;
    }
  }

  .body-container {
    padding: 1rem 2rem;
    display: flex;
  }
}

@media (max-width: 1366px) {
  #page-title {
    width: fit-content;
    margin: 1rem auto;
  }

  .app-container {
    .body-container {
      padding: 0.5rem;
    }
  }
}
</style>
