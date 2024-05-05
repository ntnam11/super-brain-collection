<template>
  <div class="timer-container">
    <div class="time">{{ timeValue }}</div>
  </div>
</template>

<script setup lang="ts">
import { strfTime } from '@/ts/math'
import { defineEmits, onMounted, ref } from 'vue'

enum TimerMode {
  Forward,
  Backward
}

interface TimerProps {
  time?: number
  mode?: TimerMode
  offsetTime?: number
}

const props = withDefaults(defineProps<TimerProps>(), {
  time: () => 0,
  mode: () => TimerMode.Forward,
  offsetTime: () => 0
})

const emit = defineEmits<{
  done: [time: string]
}>()

defineExpose({
  StartTimer,
  StopTimer,
  ResetTimer,
  time: () => timeValue.value
})

let timeValue = ref('00:00:00.000')
let timeBegan = new Date().getTime()
let timeEnded = new Date().getTime()
let timer: string | number | NodeJS.Timeout | undefined

function clockRunning() {
  const currentTime = new Date()
  const timeElapsed = new Date(currentTime.getTime() - timeBegan + props.offsetTime * 1000)
  timeValue.value = strfTime(timeElapsed)
}

function stopwatchRunning() {
  const currentTime = new Date()
  const timeLeft = new Date(timeEnded - currentTime.getTime())
  timeValue.value = strfTime(timeLeft)

  if (timeLeft.getTime() <= 0) {
    clearInterval(timer)
    emit('done', timeValue.value)
  }
}

function StartTimer() {
  if (props.mode === TimerMode.Forward) {
    timeBegan = new Date().getTime()
    timer = setInterval(clockRunning, 10)
  } else if (props.mode === TimerMode.Backward) {
    timer = setInterval(stopwatchRunning, 10)
  }
}

function StopTimer() {
  if (timer != null) {
    clearInterval(timer)
  }
}

function ResetTimer() {
  if (timer != null) {
    clearInterval(timer)
  }
  timeValue.value = '00:00:00.000'
}

onMounted(() => {
  StartTimer()
})
</script>
<style scoped lang="scss">
.timer-container {
  display: flex;

  .time {
    margin: auto;
    font-size: 2rem;
  }
}
</style>
