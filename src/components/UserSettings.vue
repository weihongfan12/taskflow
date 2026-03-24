<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="settings-panel">
          <div class="panel-header">
            <h2>个人设置</h2>
            <button class="close-btn" @click="$emit('close')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="panel-content">
            <div class="avatar-section">
              <div class="avatar-wrapper">
                <div class="avatar" :class="{ 'has-image': formData.avatar }">
                  <img v-if="formData.avatar" :src="formData.avatar" alt="avatar" />
                  <span v-else class="avatar-placeholder">{{ avatarInitial }}</span>
                </div>
                <label class="avatar-edit">
                  <input type="file" accept="image/*" @change="handleAvatarChange" hidden />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                </label>
              </div>
              <p class="avatar-hint">点击更换头像</p>
            </div>

            <div class="form-section">
              <div class="form-group">
                <label>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  用户名
                </label>
                <input
                  v-model="formData.name"
                  type="text"
                  placeholder="请输入用户名"
                  maxlength="20"
                />
              </div>

              <div class="form-group">
                <label>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  个性签名
                </label>
                <textarea
                  v-model="formData.bio"
                  placeholder="介绍一下自己..."
                  maxlength="100"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div class="stats-section">
              <h3>数据统计</h3>
              <div class="stats-grid">
                <div class="stat-card">
                  <span class="stat-value">{{ totalTasks }}</span>
                  <span class="stat-label">总任务数</span>
                </div>
                <div class="stat-card">
                  <span class="stat-value">{{ completedTasksCount }}</span>
                  <span class="stat-label">已完成</span>
                </div>
                <div class="stat-card">
                  <span class="stat-value">{{ totalPomodoros }}</span>
                  <span class="stat-label">番茄钟</span>
                </div>
                <div class="stat-card">
                  <span class="stat-value">{{ totalMinutes }}</span>
                  <span class="stat-label">专注分钟</span>
                </div>
              </div>
            </div>

            <div class="danger-section">
              <button class="danger-btn" @click="handleReset">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                重置所有数据
              </button>
            </div>
          </div>

          <div class="panel-footer">
            <button class="cancel-btn" @click="$emit('close')">取消</button>
            <button class="save-btn" @click="handleSave" :disabled="!isChanged">
              保存修改
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useTaskStore } from '../stores/taskStore'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])

const store = useTaskStore()

const user = computed(() => store.user)

const formData = reactive({
  name: '',
  bio: '',
  avatar: null
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    formData.name = user.value.name
    formData.bio = user.value.bio
    formData.avatar = user.value.avatar
  }
}, { immediate: true })

const avatarInitial = computed(() => {
  return formData.name ? formData.name.charAt(0).toUpperCase() : 'U'
})

const isChanged = computed(() => {
  return formData.name !== user.value.name ||
         formData.bio !== user.value.bio ||
         formData.avatar !== user.value.avatar
})

const totalTasks = computed(() => store.tasks.length)
const completedTasksCount = computed(() => store.completedTasks.length)
const totalPomodoros = computed(() => store.pomodoroRecords.length)
const totalMinutes = computed(() => store.pomodoroRecords.length * store.settings.workDuration)

function handleAvatarChange(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      formData.avatar = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

function handleSave() {
  store.updateUser({
    name: formData.name || '用户',
    bio: formData.bio,
    avatar: formData.avatar
  })
  emit('close')
}

function handleReset() {
  if (confirm('确定要重置所有数据吗？此操作不可恢复！')) {
    localStorage.clear()
    location.reload()
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.settings-panel {
  background: #ffffff;
  border-radius: 24px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.05);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0;
}

.panel-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: -0.5px;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: #f5f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #eee;
  color: #333;
}

.close-btn svg {
  width: 18px;
  height: 18px;
}

.panel-content {
  padding: 24px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.avatar.has-image {
  background: none;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 36px;
  font-weight: 700;
  color: white;
  font-family: 'Georgia', serif;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.avatar-edit:hover {
  transform: scale(1.1);
}

.avatar-edit svg {
  width: 14px;
  height: 14px;
  color: #667eea;
}

.avatar-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
}

.form-group label svg {
  width: 16px;
  height: 16px;
  color: #667eea;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #eee;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.2s ease;
  background: #fafafa;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
  resize: none;
  font-family: inherit;
}

.stats-section {
  margin-bottom: 32px;
}

.stats-section h3 {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.danger-section {
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.danger-btn {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background: #fff5f5;
  color: #e53e3e;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.danger-btn:hover {
  background: #feb2b2;
}

.danger-btn svg {
  width: 18px;
  height: 18px;
}

.panel-footer {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
}

.cancel-btn,
.save-btn {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #f5f5f7;
  color: #666;
}

.cancel-btn:hover {
  background: #eee;
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .settings-panel,
.modal-leave-to .settings-panel {
  transform: scale(0.95) translateY(20px);
}

@media (max-width: 480px) {
  .settings-panel {
    border-radius: 20px 20px 0 0;
    max-height: 95vh;
  }

  .panel-header,
  .panel-content,
  .panel-footer {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
