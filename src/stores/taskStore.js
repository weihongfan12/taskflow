import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'taskflow_data'

const defaultSettings = {
  workDuration: 25,
  breakDuration: 5
}

const defaultUser = {
 id: 'default',
 name: '用户',
 avatar: null,
 bio: '',
 email: null,
 isGuest: true,
 createdAt: new Date().toISOString()
}

const USER_STORAGE_KEY = 'taskflow_user'
const TOKEN_STORAGE_KEY = 'taskflow_token'

export const useTaskStore = defineStore('task', () => {
 const tasks = ref([])
 const pomodoroRecords = ref([])
 const settings = ref({ ...defaultSettings })
 const currentTaskId = ref(null)
 const user = ref({ ...defaultUser })
 const isAuthenticated = ref(false)

 function initAuth() {
 try {
 const savedUser = localStorage.getItem(USER_STORAGE_KEY)
 const token = localStorage.getItem(TOKEN_STORAGE_KEY)
 if (savedUser && token) {
 user.value = { ...defaultUser, ...JSON.parse(savedUser) }
 isAuthenticated.value = true
 return true
 }
 } catch (e) {
 console.error('Failed to init auth:', e)
 }
 isAuthenticated.value = false
 return false
 }

 function login(userData) {
 user.value = { ...defaultUser, ...userData }
 isAuthenticated.value = true
 saveToStorage()
 }

 function logout() {
 user.value = { ...defaultUser }
 isAuthenticated.value = false
 localStorage.removeItem(USER_STORAGE_KEY)
 localStorage.removeItem(TOKEN_STORAGE_KEY)
 currentTaskId.value = null
 }

  function loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        tasks.value = parsed.tasks || []
        pomodoroRecords.value = parsed.pomodoroRecords || []
        settings.value = { ...defaultSettings, ...parsed.settings }
        currentTaskId.value = parsed.currentTaskId || null
        user.value = { ...defaultUser, ...parsed.user }
      }
    } catch (e) {
      console.error('Failed to load from storage:', e)
    }
  }

  function saveToStorage() {
    try {
      const data = {
        tasks: tasks.value,
        pomodoroRecords: pomodoroRecords.value,
        settings: settings.value,
        currentTaskId: currentTaskId.value,
        user: user.value
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save to storage:', e)
    }
  }

  loadFromStorage()

  const activeTasks = computed(() => {
    return tasks.value.filter(t => !t.completed).sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  })

  const completedTasks = computed(() => {
    return tasks.value.filter(t => t.completed)
  })

  const todayCompletedTasks = computed(() => {
    const today = new Date().toDateString()
    return completedTasks.value.filter(t => {
      const completeDate = new Date(t.completedAt).toDateString()
      return completeDate === today
    })
  })

  const todayPomodoros = computed(() => {
    const today = new Date().toDateString()
    return pomodoroRecords.value.filter(p => {
      const recordDate = new Date(p.completedAt).toDateString()
      return recordDate === today
    })
  })

  const weekStats = computed(() => {
    const stats = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toDateString()
      const dayCompleted = completedTasks.value.filter(t => {
        return new Date(t.completedAt).toDateString() === dateStr
      }).length
      const dayPomodoros = pomodoroRecords.value.filter(p => {
        return new Date(p.completedAt).toDateString() === dateStr
      }).length
      stats.push({
        date: date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
        tasks: dayCompleted,
        pomodoros: dayPomodoros
      })
    }
    return stats
  })

  function addTask(task) {
    const newTask = {
      id: Date.now().toString(),
      title: task.title,
      priority: task.priority || 'medium',
      dueDate: task.dueDate || null,
      tags: task.tags || [],
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    tasks.value.push(newTask)
    saveToStorage()
    return newTask
  }

  function updateTask(id, updates) {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updates }
      saveToStorage()
    }
  }

  function deleteTask(id) {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.value.splice(index, 1)
      if (currentTaskId.value === id) {
        currentTaskId.value = null
      }
      saveToStorage()
    }
  }

  function completeTask(id) {
    updateTask(id, {
      completed: true,
      completedAt: new Date().toISOString()
    })
  }

  function clearCompletedTasks() {
    tasks.value = tasks.value.filter(t => !t.completed)
    saveToStorage()
  }

  function setCurrentTask(id) {
    currentTaskId.value = id
    saveToStorage()
  }

  function addPomodoro(taskId) {
    const record = {
      id: Date.now().toString(),
      taskId: taskId,
      completedAt: new Date().toISOString()
    }
    pomodoroRecords.value.push(record)
    saveToStorage()
  }

  function updateSettings(newSettings) {
    settings.value = { ...settings.value, ...newSettings }
    saveToStorage()
  }

  function updateUser(updates) {
    user.value = { ...user.value, ...updates }
    saveToStorage()
  }

 return {
 tasks,
 pomodoroRecords,
 settings,
 currentTaskId,
 user,
 isAuthenticated,
 activeTasks,
 completedTasks,
 todayCompletedTasks,
 todayPomodoros,
 weekStats,
 addTask,
 updateTask,
 deleteTask,
 completeTask,
 clearCompletedTasks,
 setCurrentTask,
 addPomodoro,
 updateSettings,
 updateUser,
 loadFromStorage,
 initAuth,
 login,
 logout
 }
})
