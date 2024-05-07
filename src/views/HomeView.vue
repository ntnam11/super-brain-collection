<template>
  <div class="container">
    <div class="content">
      <p>Hello!</p>
      <p>This is my collection of Super Brain (最强大脑) challenges.</p>
      <p>Have fun testing.</p>
    </div>
    <div class="links">
      <RouterLink to="/s11e3t1">Tree Planting</RouterLink>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
<style scoped lang="scss">
.container {
  max-width: 1320px;
  width: 100%;
  margin: auto;

  .links {
    margin-top: 1rem;
  }
}
</style>
