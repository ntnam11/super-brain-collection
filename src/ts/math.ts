export class Coord {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * (max + 1))
}

export function padZero(num: number, maxlength: number) {
  return num.toString().padStart(maxlength, '0')
}

export function strfTime(date: Date) {
  const hour = date.getUTCHours()
  const min = date.getUTCMinutes()
  const sec = date.getUTCSeconds()
  const ms = date.getUTCMilliseconds()

  return `${padZero(hour, 2)}:${padZero(min, 2)}:${padZero(sec, 2)}.${padZero(ms, 3)}`
}
