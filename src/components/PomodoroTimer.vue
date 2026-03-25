<template>
  <div class="pomodoro-timer">
    <div class="timer-display">
      <div class="timer-circle" :class="{ working: isWorking, resting: !isWorking }">
        <svg class="progress-ring" viewBox="0 0 200 200">
          <circle
            class="progress-bg"
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke-width="8"
          />
          <circle
            class="progress-bar"
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke-width="8"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset"
          />
        </svg>
        <div class="timer-text">
          <span class="time">{{ formattedTime }}</span>
          <span class="status">{{ statusText }}</span>
        </div>
      </div>
    </div>

    <div class="timer-controls">
      <button class="control-btn primary" @click="toggleTimer" :class="{ active: isRunning }">
        <svg v-if="!isRunning" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      </button>
      <button class="control-btn" @click="resetTimer" :disabled="!isRunning && timeLeft === totalTime">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="1 4 1 10 7 10"></polyline>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
        </svg>
      </button>
    </div>

    <div class="current-task" v-if="currentTask">
      <span class="task-label">当前任务：</span>
      <span class="task-name">{{ currentTask.title }}</span>
    </div>
    <div class="current-task" v-else>
      <span class="task-label">请先选择一个任务</span>
    </div>

    <div class="today-stats">
      <div class="stat-item">
        <span class="stat-value">{{ todayPomodoros }}</span>
        <span class="stat-label">今日番茄</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ todayMinutes }}</span>
        <span class="stat-label">专注分钟</span>
      </div>
    </div>

    <div class="settings-toggle">
      <button @click="showSettings = !showSettings">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        设置
      </button>
    </div>

    <div class="settings-panel" v-if="showSettings">
      <div class="setting-item">
        <label>工作时长（分钟）</label>
        <input type="number" v-model.number="localWorkDuration" min="1" max="60" />
      </div>
      <div class="setting-item">
        <label>休息时长（分钟）</label>
        <input type="number" v-model.number="localBreakDuration" min="1" max="30" />
      </div>
      <button class="save-settings" @click="saveSettings">保存设置</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, onMounted } from 'vue'
import { useTaskStore } from '../stores/taskStore'

const store = useTaskStore()

const isRunning = ref(false)
const isWorking = ref(true)
const timeLeft = ref(25 * 60)
const showSettings = ref(false)
const localWorkDuration = ref(25)
const localBreakDuration = ref(5)

let timerInterval = null

const circumference = 2 * Math.PI * 90

const totalTime = computed(() => {
  return isWorking.value ? store.settings.workDuration * 60 : store.settings.breakDuration * 60
})

const progressOffset = computed(() => {
  const progress = timeLeft.value / totalTime.value
  return circumference * (1 - progress)
})

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const statusText = computed(() => {
  return isWorking.value ? '工作中' : '休息中'
})

const currentTask = computed(() => {
  if (!store.currentTaskId) return null
  return store.tasks.find(t => t.id === store.currentTaskId)
})

const todayPomodoros = computed(() => store.todayPomodoros.length)
const todayMinutes = computed(() => store.todayPomodoros.length * store.settings.workDuration)

onMounted(() => {
  store.loadFromStorage()
})

watch(() => store.settings, (newSettings) => {
  localWorkDuration.value = newSettings.workDuration
  localBreakDuration.value = newSettings.breakDuration
  if (!isRunning.value) {
    timeLeft.value = isWorking.value ? newSettings.workDuration * 60 : newSettings.breakDuration * 60
  }
}, { immediate: true })

function toggleTimer() {
  if (isRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

function startTimer() {
  isRunning.value = true
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      completeTimer()
    }
  }, 1000)
}

function pauseTimer() {
  isRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function resetTimer() {
  pauseTimer()
  timeLeft.value = totalTime.value
}

function completeTimer() {
  pauseTimer()
  playNotification()
  
  if (isWorking.value && store.currentTaskId) {
    store.addPomodoro(store.currentTaskId)
  }
  
  isWorking.value = !isWorking.value
  timeLeft.value = totalTime.value
}

function playNotification() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
    
    setTimeout(() => {
      const osc2 = audioContext.createOscillator()
      const gain2 = audioContext.createGain()
      osc2.connect(gain2)
      gain2.connect(audioContext.destination)
      osc2.frequency.value = 1000
      osc2.type = 'sine'
      gain2.gain.setValueAtTime(0.3, audioContext.currentTime)
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      osc2.start(audioContext.currentTime)
      osc2.stop(audioContext.currentTime + 0.5)
    }, 200)
  } catch (e) {
    console.log('Audio notification not supported')
  }
}

function saveSettings() {
  store.updateSettings({
    workDuration: localWorkDuration.value,
    breakDuration: localBreakDuration.value
  })
  timeLeft.value = localWorkDuration.value * 60
  showSettings.value = false
}

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.pomodoro-timer {
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--shadow);
}

.timer-display {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.timer-circle {
  position: relative;
  width: 200px;
  height: 200px;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-bg {
  stroke: var(--bg-color);
}

.progress-bar {
  stroke: var(--primary-color);
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
}

.timer-circle.working .progress-bar {
  stroke: var(--primary-color);
}

.timer-circle.resting .progress-bar {
  stroke: var(--success-color);
}

.timer-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.time {
  display: block;
  font-size: 36px;
  font-weight: 700;
  color: var(--text-color);
}

.status {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.control-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  color: var(--text-secondary);
}

.control-btn svg {
  width: 24px;
  height: 24px;
}

.control-btn.primary {
  background: var(--primary-color);
  color: white;
}

.control-btn.primary.active {
  background: var(--warning-color);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.current-task {
  text-align: center;
  padding: 12px;
  background: var(--bg-color);
  border-radius: 8px;
  margin-bottom: 16px;
}

.task-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.task-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
}

.today-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border-color);
  margin: 0 24px;
}

.settings-toggle {
  text-align: center;
}

.settings-toggle button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--bg-color);
  border-radius: 20px;
  color: var(--text-secondary);
  font-size: 13px;
}

.settings-toggle button svg {
  width: 16px;
  height: 16px;
}

.settings-panel {
  margin-top: 16px;
  padding: 16px;
  background: var(--bg-color);
  border-radius: 8px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.setting-item label {
  font-size: 13px;
  color: var(--text-secondary);
}

.setting-item input {
  width: 80px;
  text-align: center;
}

.save-settings {
  width: 100%;
  padding: 10px;
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
  margin-top: 8px;
}
</style>
