<template>
  <div class="container">
    <div class="left-panel">
      <div class="board-grid main-board">
        <TreeBoard :mode="BoardMode.Icon" :board-size="boardSize" :board="mainBoard"></TreeBoard>
        <div class="controls">
          <div class="control-buttons">
            <button @click="NewBoard()">New</button>
          </div>
        </div>
      </div>
      <div class="debug-board">
        <TreeBoard
          :mode="BoardMode.Icon"
          :board-size="boardSize"
          :board="debugBoard"
          :locked="true"
        ></TreeBoard>
      </div>
    </div>
    <div class="right-panel">
      <div class="board-grid sub-boards">
        <TreeBoard
          v-for="(board, i) in boards"
          v-bind:key="i"
          :mode="BoardMode.Empty"
          :boardSize="boardSize"
          :groupSize="board.groupSize"
          @updated="(board) => UpdateBoard(board, i)"
        ></TreeBoard>
        <div class="controls-board">
          <div class="result">
            <div class="result-text">
              <span>{{ result }}</span>
            </div>
          </div>
          <div class="timer">
            <TestTimer ref="timer" :offset-time="penaltyTime"></TestTimer>
          </div>
          <div class="control-buttons">
            <button @click="Submit()">Submit</button>
            <button @click="ClearAll()">Clear All</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import TreeBoard from '@/components/e3t1/TreeBoard.vue'
import { Board, BoardMode, GroupSize } from '@/components/e3t1/board'
import { onMounted, ref, type Ref } from 'vue'
import TestTimer from '@/components/TestTimer.vue'

const boardSize = 6
const boardCount = 7
const maxCellValue = 4
const mainBoard = ref(new Board())
const debugBoard = ref(new Board())
const boardConfig = [
  {
    groupSize: GroupSize.Group1x1,
    name: 'b11'
  },
  {
    groupSize: GroupSize.Group1x1,
    name: 'b12'
  },
  {
    groupSize: GroupSize.Group2x2,
    name: 'b21'
  },
  {
    groupSize: GroupSize.Group2x2,
    name: 'b22'
  },
  {
    groupSize: GroupSize.Group3x3,
    name: 'b31'
  },
  {
    groupSize: GroupSize.Group3x3,
    name: 'b32'
  },
  {
    groupSize: GroupSize.Group4x4,
    name: 'b41'
  }
]
const boards = ref([]) as Ref<Board[]>
const timer = ref<InstanceType<typeof TestTimer> | null>(null)
const result = ref('Test in progress...')
const penaltyTime = ref(0)
let wrongCount = 0

const r = document.querySelector(':root') as HTMLElement
const template = []
for (let i = 0; i < boardSize; i++) {
  template.push('1fr')
}
r.style.setProperty('--grid-template', template.join(' '))

function NewBoard() {
  mainBoard.value = new Board(boardSize)

  const stack = [] as Board[]
  for (let i = 0; i < boardCount; i++) {
    boards.value[i] = new Board(boardSize, boardConfig[i].groupSize)
    stack.push(boards.value[i])
  }

  ClearAll()
  let resultBoard = new Board(boardSize)

  while (stack.length > 0) {
    const currentBoard = stack.pop() as Board
    let randBoard = new Board(boardSize, currentBoard?.groupSize)
    randBoard = randBoard.Create()
    const combinedBoard = resultBoard.Combine(randBoard)
    if (combinedBoard.IsValid(maxCellValue)) {
      resultBoard = combinedBoard
    } else {
      stack.push(currentBoard)
    }
  }

  mainBoard.value = resultBoard
  mainBoard.value.Print()

  timer.value?.ResetTimer()
  timer.value?.StartTimer()
  wrongCount = 0
  result.value = 'Test in progress...'
}

function Submit() {
  debugBoard.value = Board.Combine(boards.value)
  console.log('Debug board')
  debugBoard.value.Print()

  if (debugBoard.value.Equals(mainBoard.value)) {
    result.value = 'Finished'
    timer.value?.StopTimer()
  } else {
    wrongCount++
    result.value = `Wrong Answer ${wrongCount} time${wrongCount > 1 ? 's' : ''}`
  }
}

onMounted(() => {
  NewBoard()
})

function UpdateBoard(board: Board, i: number) {
  boards.value[i] = board
}

function ClearAll() {
  for (let i = 0; i < boardCount; i++) {
    boards.value[i].Clear()
    boards.value[i].ClearPreview()
    boards.value[i].Unlock()
  }
}
</script>
<style scoped lang="scss">
.container {
  display: flex;

  .board-grid {
    display: grid;
    column-gap: calc(var(--grid-template-gap) * 2);
    row-gap: calc(var(--grid-template-gap) * 2);
  }

  .sub-boards {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  .controls-board {
    display: flex;
    flex-direction: column;

    > :first-child {
      margin-top: auto;
    }

    > :last-child {
      margin-bottom: auto;
    }
  }

  .timer {
    margin-bottom: 2rem;
  }

  .control-buttons {
    display: flex;
    justify-content: space-evenly;

    button {
      padding: 0.5rem 1rem;
    }
  }

  .result {
    margin-bottom: 2rem;
    display: flex;

    .result-text {
      margin: auto;
    }
  }
}
</style>
