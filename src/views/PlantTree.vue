<template>
  <div class="container">
    <div class="left-panel">
      <div class="board-grid main-board">
        <TreeBoard :mode="BoardMode.Icon" :board-size="boardSize" :board="mainBoard"></TreeBoard>
        <div class="controls-board">
          <div class="rules">
            <div class="inline-svg">
              <IconCircle></IconCircle>
              <span> = 0 or 2 </span>
              <IconTree></IconTree>
            </div>
            <div class="inline-svg">
              <IconTriangle></IconTriangle>
              <span> = 1 or 3 </span>
              <IconTree></IconTree>
            </div>
            <div class="inline-svg">
              <div class="icon-tree-multiple">
                <template v-for="i in 4" v-bind:key="i">
                  <IconTree></IconTree>
                </template>
              </div>
              <span> = 4 </span>
              <IconTree></IconTree>
            </div>
          </div>
          <div class="control-buttons">
            <button @click="NewBoard()">New</button>
          </div>
          <div class="leaderboard">
            <span>Records</span>
            <ol>
              <li v-for="(record, i) in records" v-bind:key="i">{{ record.value }}</li>
            </ol>
          </div>
        </div>
      </div>
      <div class="debug-board hidden">
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
          ref="inputBoards"
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
import IconCircle from '@/components/icons/IconCircle.vue'
import IconTree from '@/components/icons/IconTree.vue'
import IconTriangle from '@/components/icons/IconTriangle.vue'

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
const inputBoards = ref<InstanceType<typeof TreeBoard>[]>()
const timer = ref<InstanceType<typeof TestTimer> | null>(null)
const result = ref('Test in progress...')
const penaltyTime = ref(0)

interface RecordData {
  value: string
}
const records = ref([]) as Ref<RecordData[]>
let wrongCount = 0

const r = document.querySelector(':root') as HTMLElement
const template = []
for (let i = 0; i < boardSize; i++) {
  template.push('1fr')
}
r.style.setProperty('--grid-template', template.join(' '))

function compare(a: RecordData, b: RecordData) {
  if (a.value < b.value) {
    return -1
  }
  if (a.value > b.value) {
    return 1
  }
  return 0
}
const savedRecords = localStorage.getItem('e3t1-records')
if (savedRecords) {
  records.value = JSON.parse(savedRecords)
  records.value.sort(compare)
}

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
  // mainBoard.value.Print()

  timer.value?.ResetTimer()
  timer.value?.StartTimer()
  wrongCount = 0
  penaltyTime.value = 0
  result.value = 'Test in progress...'
}

function Submit() {
  debugBoard.value = Board.Combine(boards.value)
  // console.log('Debug board')
  // debugBoard.value.Print()

  if (debugBoard.value.Equals(mainBoard.value)) {
    result.value = 'Finished'
    timer.value?.StopTimer()
    let record = {
      value: timer.value?.time()
    } as RecordData
    records.value.push(record)
    records.value.sort(compare).slice(0, 5)
    localStorage.setItem('e3t1-records', JSON.stringify(records.value))
  } else {
    wrongCount++
    penaltyTime.value += 15
    result.value = `Wrong Answer ${wrongCount} time${wrongCount > 1 ? 's' : ''}`
  }
}

function UpdateBoard(board: Board, i: number) {
  boards.value[i] = board
}

function ClearAll() {
  for (let i = 0; i < boardCount; i++) {
    if (inputBoards.value) {
      inputBoards.value[i].Reset()
    }
    boards.value[i].Clear()
    boards.value[i].ClearPreview()
    boards.value[i].Unlock()
  }
}

onMounted(() => {
  NewBoard()
})
</script>
<style scoped lang="scss">
.container {
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin: 2rem;

  .board-grid {
    display: grid;
    column-gap: calc(var(--grid-template-gap) * 3);
    row-gap: calc(var(--grid-template-gap) * 3);
  }

  .main-board {
    grid-template-columns: 1fr;
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

  .inline-svg {
    display: flex;

    > * {
      margin: auto 3px;
    }

    > :first-child {
      margin-left: auto;
      margin-right: 5px;
    }

    > :last-child {
      margin-right: auto;
    }

    span {
      width: 55px;
    }

    svg {
      width: 20px;
      height: 20px;
    }

    .icon-tree-multiple {
      display: grid;
      grid-template-columns: 1fr 1fr;

      svg {
        width: 10px;
        height: 10px;
      }
    }
  }

  .rules {
    margin-bottom: 1rem;
    > * {
      margin: 5px;
    }
  }

  .leaderboard {
    margin-top: 1rem;
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
