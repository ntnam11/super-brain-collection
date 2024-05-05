import { getRandomInt } from '@/ts/math'

export class Board {
  size: number
  cells: Cell[][]
  groupSize?: GroupSize
  locked = false

  constructor(size = 6, groupSize?: GroupSize) {
    this.size = size
    this.groupSize = groupSize
    this.cells = []

    for (let i = 0; i < size; i++) {
      const row = []
      for (let j = 0; j < size; j++) {
        row.push(new Cell(0))
      }
      this.cells.push(row)
    }
  }

  Create() {
    const i = getRandomInt(this.size - (this.groupSize ?? 0))
    const j = getRandomInt(this.size - (this.groupSize ?? 0))
    return this.Put(i, j)
  }

  Print() {
    const row = []
    for (let i = 0; i < this.size; i++) {
      const arr = []
      for (let j = 0; j < this.size; j++) {
        if (!this.cells[i][j].preview) {
          arr.push(this.cells[i][j].value)
        } else {
          arr.push('p')
        }
      }
      row.push(arr.join(' '))
    }
    console.log(row.join('\n'))
  }

  Clear() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.cells[i][j] = new Cell(0)
      }
    }
  }

  Preview(x: number, y: number) {
    if (this.groupSize) {
      if (x + this.groupSize >= this.size) {
        x = this.size - this.groupSize
      }
      if (y + this.groupSize >= this.size) {
        y = this.size - this.groupSize
      }
      for (let i = 0; i < this.groupSize; i++) {
        for (let j = 0; j < this.groupSize; j++) {
          this.cells[x + i][y + j].preview = true
        }
      }
      // console.log(`Preview board`)
      // this.Print()
    }
  }

  ClearPreview() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.cells[i][j].preview = false
      }
    }
  }

  Put(x: number, y: number) {
    if (this.groupSize) {
      if (x + this.groupSize >= this.size) {
        x = this.size - this.groupSize
      }
      if (y + this.groupSize >= this.size) {
        y = this.size - this.groupSize
      }
      const result = new Board(this.size, this.groupSize)
      for (let i = 0; i < this.groupSize; i++) {
        for (let j = 0; j < this.groupSize; j++) {
          result.cells[x + i][y + j].value = 1
        }
      }
      return result
    }
    return this
  }

  IsValid(maxValue: number) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.cells[i][j].value > maxValue) {
          return false
        }
      }
    }
    return true
  }

  Equals(board: Board) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        switch (this.cells[i][j].value) {
          case 1:
          case 3:
            switch (board.cells[i][j].value) {
              case 1:
              case 3:
                break
              default:
                return false
            }
            break
          case 0:
          case 2:
            switch (board.cells[i][j].value) {
              case 0:
              case 2:
                break
              default:
                return false
            }
            break
          case 4:
            if (board.cells[i][j].value != 4) return false
            break
        }
      }
    }
    return true
  }

  Lock() {
    this.locked = true
  }

  Unlock() {
    this.locked = false
  }

  Combine(board: Board) {
    const result = new Board(this.size, this.groupSize)
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        result.cells[i][j].value = this.cells[i][j].value + board.cells[i][j].value
      }
    }
    return result
  }

  static Combine(boards: Board[]) {
    const size = boards[0].size
    const groupSize = boards[0].groupSize
    const result = new Board(size, groupSize)
    for (let n = 0; n < boards.length; n++) {
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          result.cells[i][j].value += boards[n].cells[i][j].value
        }
      }
    }
    return result
  }
}

export enum GroupSize {
  Group1x1 = 1,
  Group2x2 = 2,
  Group3x3 = 3,
  Group4x4 = 4
}

export enum BoardMode {
  Icon,
  Empty,
  Number
}

export class Cell {
  value: number
  preview = false

  constructor(value: number) {
    this.value = value
  }
}
