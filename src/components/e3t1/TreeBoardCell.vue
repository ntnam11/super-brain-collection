<template>
  <div class="tree-board-cell">
    <div class="cell-image">
      <template v-if="props.mode == BoardMode.Icon">
        <template v-if="props.value == -1">
          <IconCross></IconCross>
        </template>
        <template v-else-if="props.value == 1 || props.value == 3">
          <IconTriangle></IconTriangle>
        </template>
        <template v-else-if="props.value == 0 || props.value == 2">
          <IconCircle></IconCircle>
        </template>
        <template v-else-if="props.value == 4">
          <div class="icon-tree-multiple">
            <template v-for="i in 4" v-bind:key="i">
              <IconTree></IconTree>
            </template>
          </div>
        </template>
      </template>
      <template v-else-if="props.mode == BoardMode.Empty">
        <template v-if="props.preview">
          <IconTree></IconTree>
        </template>
        <template v-else>
          <template v-if="props.value > 0">
            <IconTree></IconTree>
          </template>
          <template v-else>
            <IconEmpty></IconEmpty>
          </template>
        </template>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import IconCircle from '../icons/IconCircle.vue'
import IconCross from '../icons/IconCross.vue'
import IconTree from '../icons/IconTree.vue'
import IconTriangle from '../icons/IconTriangle.vue'
import IconEmpty from '../icons/IconEmpty.vue'
import { BoardMode } from './board'

interface CellProps {
  mode: BoardMode
  value: number
  preview: boolean
}

const props = withDefaults(defineProps<CellProps>(), {
  mode: () => BoardMode.Empty,
  value: () => 0,
  preview: () => false
})
</script>
<style scoped lang="scss">
.tree-board-cell {
  aspect-ratio: 1;
  display: flex;
  background: url('./ground.png');

  .cell-image {
    display: flex;
    width: 100%;
    height: 100%;
    margin: auto;
    cursor: pointer;

    svg {
      margin: auto;
      // pointer-events: none;
    }
  }
}
svg {
  padding: 10px;
  max-width: 50px;
  max-height: 50px;
}
.icon-tree-multiple {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100%;

  svg {
    padding: 0;
    max-width: 20px;
    max-height: 20px;
  }
}
</style>
