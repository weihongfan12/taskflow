<template>
  <div class="home-view">
    <header class="app-header">
      <div class="header-top">
        <button class="user-avatar-btn" @click="showUserSettings = true">
          <div class="user-avatar" :class="{ 'has-image': store.user.avatar }">
            <img v-if="store.user.avatar" :src="store.user.avatar" alt="avatar" />
            <span v-else class="avatar-initial">{{ avatarInitial }}</span>
          </div>
        </button>
      </div>
      <h1 class="app-title">TaskFlow</h1>
      <p class="app-subtitle">极简任务管理与番茄钟</p>
    </header>

    <main class="main-content">
      <section class="task-section">
        <div class="section-header">
          <h2 class="section-title">
            任务列表
            <span class="task-count">{{ activeTasks.length }}</span>
          </h2>
          <div class="header-actions">
            <CustomSelect v-model="sortBy" :options="sortOptions" />
            <button class="add-btn" @click="showTaskForm = true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              新建任务
            </button>
          </div>
        </div>

        <div class="task-list" v-if="sortedTasks.length">
          <TransitionGroup name="task">
            <TaskItem
              v-for="task in sortedTasks"
              :key="task.id"
              :task="task"
              :is-selected="task.id === store.currentTaskId"
              @complete="handleComplete"
              @edit="handleEdit"
              @delete="handleDelete"
              @select="handleSelect"
            />
          </TransitionGroup>
        </div>
        <div class="empty-state" v-else>
          <div class="empty-illustration">
            <svg viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="50" stroke="#E8ECF2" stroke-width="2" stroke-dasharray="8 4"/>
              <path d="M40 55 L55 70 L80 45" stroke="#667eea" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p>暂无任务</p>
          <span>点击上方"新建任务"开始添加</span>
        </div>

        <div class="completed-section" v-if="completedTasks.length">
          <div class="section-header completed-header">
            <h3 class="completed-title">
              已完成
              <span class="task-count">{{ completedTasks.length }}</span>
            </h3>
            <button class="clear-btn" @click="handleClearCompleted">清空已完成</button>
          </div>
          <div class="completed-list">
            <TaskItem
              v-for="task in completedTasks.slice(0, 3)"
              :key="task.id"
              :task="task"
              @complete="handleComplete"
              @edit="handleEdit"
              @delete="handleDelete"
            />
          </div>
        </div>
      </section>

      <aside class="sidebar">
        <PomodoroTimer />
        <StatsChart />
      </aside>
    </main>

    <TaskForm
      v-if="showTaskForm"
      :task="editingTask"
      @submit="handleSubmit"
      @cancel="closeForm"
    />

    <UserSettings
      :show="showUserSettings"
      @close="showUserSettings = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import TaskItem from '../components/TaskItem.vue'
import TaskForm from '../components/TaskForm.vue'
import PomodoroTimer from '../components/PomodoroTimer.vue'
import StatsChart from '../components/StatsChart.vue'
import UserSettings from '../components/UserSettings.vue'
import CustomSelect from '../components/CustomSelect.vue'

const store = useTaskStore()

const showTaskForm = ref(false)
const showUserSettings = ref(false)
const editingTask = ref(null)
const sortBy = ref('priority')

const sortOptions = [
  { value: 'priority', label: '按优先级' },
  { value: 'dueDate', label: '按截止日期' },
  { value: 'created', label: '按创建时间' }
]

const activeTasks = computed(() => store.activeTasks)
const completedTasks = computed(() => store.completedTasks)

const avatarInitial = computed(() => {
  return store.user.name ? store.user.name.charAt(0).toUpperCase() : 'U'
})

const sortedTasks = computed(() => {
  const tasks = [...activeTasks.value]
  switch (sortBy.value) {
    case 'priority':
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    case 'dueDate':
      return tasks.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      })
    case 'created':
      return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    default:
      return tasks
  }
})

function handleSubmit(taskData) {
  if (editingTask.value) {
    store.updateTask(editingTask.value.id, taskData)
  } else {
    store.addTask(taskData)
  }
  closeForm()
}

function handleComplete(id) {
  store.completeTask(id)
}

function handleEdit(task) {
  editingTask.value = task
  showTaskForm.value = true
}

function handleDelete(id) {
  store.deleteTask(id)
}

function handleSelect(id) {
  store.setCurrentTask(id)
}

function handleClearCompleted() {
  if (confirm('确定要清空所有已完成的任务吗？')) {
    store.clearCompletedTasks()
  }
}

function closeForm() {
  showTaskForm.value = false
  editingTask.value = null
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.app-header {
  text-align: center;
  margin-bottom: 32px;
  position: relative;
}

.header-top {
  position: absolute;
  top: 0;
  right: 0;
}

.user-avatar-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: none;
  padding: 0;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  transition: transform 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.user-avatar.has-image {
  background: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initial {
  font-size: 20px;
  font-weight: 700;
  color: white;
  font-family: 'Georgia', serif;
}

.app-title {
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  letter-spacing: -1px;
}

.app-subtitle {
  font-size: 15px;
  color: #888;
  font-weight: 400;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

.task-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1a1a2e;
}

.task-count {
  font-size: 13px;
  font-weight: 600;
  padding: 3px 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  transition: all 0.2s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.add-btn svg {
  width: 18px;
  height: 18px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-enter-active,
.task-leave-active {
  transition: all 0.3s ease;
}

.task-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.task-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.empty-illustration {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}

.empty-illustration svg {
  width: 100%;
  height: 100%;
}

.empty-state p {
  font-size: 17px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 6px;
}

.empty-state span {
  font-size: 14px;
  color: #999;
}

.completed-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.completed-header {
  margin-bottom: 12px;
}

.completed-title {
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
}

.clear-btn {
  padding: 6px 12px;
  background: transparent;
  color: #e53e3e;
  font-size: 13px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #fff5f5;
}

.completed-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 900px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    order: -1;
  }

  .app-title {
    font-size: 32px;
  }
}
</style>
