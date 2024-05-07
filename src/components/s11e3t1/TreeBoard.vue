<template>
  <div class="tree-board" @mouseleave="onMouseLeaveBoard()">
    <template v-for="(row, i) in getBoardCells()" v-bind:key="i">
      <template v-for="(cell, j) in row" v-bind:key="j">
        <TreeBoardCell
          :mode="props.mode"
          :preview="cell.preview"
          :value="cell.value"
          @mouseover="onMouseOverCell(i, j)"
          @mouseup="onMouseUpCell(i, j)"
        ></TreeBoardCell>
      </template>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import TreeBoardCell from './TreeBoardCell.vue'
import { BoardMode } from './board'
import { Board, GroupSize } from './board'

interface BoardProps {
  boardSize: number
  groupSize?: GroupSize
  mode: BoardMode
  board?: Board
  locked?: Boolean
}
const props = withDefaults(defineProps<BoardProps>(), {
  boardSize: () => 6,
  groupSize: () => GroupSize.Group1x1,
  mode: () => BoardMode.Icon
})

const emit = defineEmits<{
  updated: [board: Board]
}>()

defineExpose({
  Reset
})

function Reset() {
  board.value.Unlock()
  board.value.Clear()
  board.value.ClearPreview()
}

const board = ref(new Board(props.boardSize, props.groupSize))
board.value.Print()

function getBoardCells() {
  if (props.board) {
    return props.board.cells
  } else {
    return board.value.cells
  }
}

function onMouseOverCell(i: number, j: number) {
  if (props.mode != BoardMode.Icon) {
    if (!board.value.locked) {
      // console.log(`Mouse over ${i}, ${j}`)
      board.value.ClearPreview()
      board.value.Preview(i, j)
    }
  }
}

function onMouseUpCell(i: number, j: number) {
  if (props.mode != BoardMode.Icon) {
    board.value.ClearPreview()
    board.value = board.value.Put(i, j)
    board.value.Lock()
    emit('updated', board.value)
  }
}

function onMouseLeaveBoard() {
  if (props.mode != BoardMode.Icon) {
    if (!board.value.locked) {
      // console.log('Mouse leave board')
      board.value.ClearPreview()
    }
  }
}
</script>
<style scoped lang="scss">
.tree-board {
  display: grid;
  aspect-ratio: 1;
  grid-template-columns: var(--grid-template);
  column-gap: var(--grid-template-gap);
  row-gap: var(--grid-template-gap);
}
</style>
