<template>
  <div class="auth-view">
    <div class="auth-container" :class="{ 'register-mode': isRegister }">
      <!-- 左侧装饰区域 -->
      <div class="auth-decoration">
        <div class="eye-container">
          <EyeBall
            :size="80"
            :pupil-size="32"
            :max-distance="18"
            :is-blinking="isBlinking"
            :force-look-x="forceLookX"
            :force-look-y="forceLookY"
            eye-color="#fff"
            pupil-color="#1a1a2e"
          />
          <EyeBall
            :size="80"
            :pupil-size="32"
            :max-distance="18"
            :is-blinking="isBlinking"
            :force-look-x="forceLookX"
            :force-look-y="forceLookY"
            eye-color="#fff"
            pupil-color="#1a1a2e"
          />
        </div>
        <h2 class="decoration-title">{{ isRegister ? '欢迎加入' : '欢迎回来' }}</h2>
        <p class="decoration-subtitle">
          {{ isRegister ? '创建账号，开启高效之旅' : '登录以继续管理你的任务' }}
        </p>
      </div>

      <!-- 右侧表单区域 -->
      <div class="auth-form-section">
        <div class="form-header">
          <h1 class="form-title">TaskFlow</h1>
          <p class="form-subtitle">极简任务管理与番茄钟</p>
        </div>

        <form class="auth-form" @submit.prevent="handleSubmit">
          <!-- 用户名输入 -->
          <div class="form-group">
            <label class="form-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              用户名
            </label>
            <input
              v-model="form.username"
              type="text"
              class="form-input"
              placeholder="请输入用户名"
              @focus="onInputFocus('username')"
              @blur="onInputBlur"
              required
            />
          </div>

          <!-- 邮箱输入 (仅注册) -->
          <div v-if="isRegister" class="form-group">
            <label class="form-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              邮箱
            </label>
            <input
              v-model="form.email"
              type="email"
              class="form-input"
              placeholder="请输入邮箱"
              @focus="onInputFocus('email')"
              @blur="onInputBlur"
              required
            />
          </div>

          <!-- 密码输入 -->
          <div class="form-group">
            <label class="form-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              密码
            </label>
            <div class="password-input-wrapper">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="请输入密码"
                @focus="onInputFocus('password')"
                @blur="onInputBlur"
                required
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- 确认密码 (仅注册) -->
          <div v-if="isRegister" class="form-group">
            <label class="form-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              确认密码
            </label>
            <div class="password-input-wrapper">
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="请再次输入密码"
                @focus="onInputFocus('confirmPassword')"
                @blur="onInputBlur"
                required
              />
              <button
                type="button"
                class="toggle-password"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="errorMessage" class="error-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {{ errorMessage }}
          </div>

          <!-- 提交按钮 -->
          <button type="submit" class="submit-btn" :disabled="isLoading">
            <span v-if="isLoading" class="loading-spinner"></span>
            {{ isLoading ? (isRegister ? '注册中...' : '登录中...') : (isRegister ? '注册' : '登录') }}
          </button>
        </form>

        <!-- 切换链接 -->
        <div class="auth-switch">
          <span>{{ isRegister ? '已有账号？' : '还没有账号？' }}</span>
          <button type="button" class="switch-btn" @click="toggleMode">
            {{ isRegister ? '立即登录' : '立即注册' }}
          </button>
        </div>

        <!-- 游客入口 -->
        <div class="guest-entry">
          <button type="button" class="guest-btn" @click="handleGuestLogin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            游客登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import EyeBall from '../components/auth/EyeBall.vue'

const router = useRouter()

const emit = defineEmits(['login'])

const isRegister = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isBlinking = ref(false)
const forceLookX = ref(undefined)
const forceLookY = ref(undefined)

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 眨眼动画
let blinkInterval
const startBlinking = () => {
  blinkInterval = setInterval(() => {
    isBlinking.value = true
    setTimeout(() => {
    }, 150)
  }, 3000 + Math.random() * 2000)
}


// 记录最后聚焦的字段，用于恢复眼球状态
const lastFocusedField = ref("")

// 输入框焦点控制眼球
const onInputFocus = (field) => {
  lastFocusedField.value = field
  // 根据输入框位置让眼球看向不同方向
  switch (field) {
    case 'username':
      forceLookX.value = -8
      forceLookY.value = -5
      break
    case 'email':
      forceLookX.value = 8
      forceLookY.value = -5
      break
    case 'password':
    case 'confirmPassword':
      // 密码输入时闭眼
      isBlinking.value = true
      forceLookX.value = 0
      forceLookY.value = 0
      break
  }
}

const onInputBlur = () => {
  if (["password", "confirmPassword"].includes(lastFocusedField.value)) {
    isBlinking.value = false
    forceLookX.value = undefined
    forceLookY.value = undefined
  }
}

// 切换登录/注册模式
const toggleMode = () => {
  isRegister.value = !isRegister.value
  errorMessage.value = ''
  // 清空表单
  form.username = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  showPassword.value = false
  showConfirmPassword.value = false
}

// 表单提交
const handleSubmit = async () => {
  errorMessage.value = ''

  // 验证
  if (!form.username.trim()) {
    errorMessage.value = '请输入用户名'
    return
  }
  if (isRegister.value) {
    if (!form.email.trim()) {
      errorMessage.value = '请输入邮箱'
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errorMessage.value = '请输入有效的邮箱地址'
      return
    }
  }
  if (!form.password) {
    errorMessage.value = '请输入密码'
    return
  }
  if (isRegister.value && form.password !== form.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  isLoading.value = true

  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟用户数据
    const userData = {
      id: Date.now().toString(),
      name: form.username,
      email: isRegister.value ? form.email : `${form.username}@taskflow.app`,
      avatar: null,
      isGuest: false
    }

    // 保存到 localStorage
    localStorage.setItem('taskflow_user', JSON.stringify(userData))
    localStorage.setItem('taskflow_token', 'mock_token_' + Date.now())

    emit('login', userData)

    // 注册成功后跳转到登录页面
    router.push('/login')
  } catch (error) {
    errorMessage.value = isRegister.value ? '注册失败，请重试' : '登录失败，请检查用户名和密码'
  } finally {
    isLoading.value = false
  }
}

// 游客登录
const handleGuestLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    const guestUser = {
      id: 'guest_' + Date.now(),
      name: '游客用户',
      email: null,
      avatar: null,
      isGuest: true
    }

    localStorage.setItem('taskflow_user', JSON.stringify(guestUser))
    localStorage.setItem('taskflow_token', 'guest_token_' + Date.now())

    emit('login', guestUser)
  } catch (error) {
    errorMessage.value = '登录失败，请重试'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  startBlinking()
})

onUnmounted(() => {
  if (blinkInterval) {
    clearInterval(blinkInterval)
  }
})
</script>

<style scoped>
.auth-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-container {
  display: flex;
  width: 100%;
  max-width: 900px;
  min-height: 560px;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* 左侧装饰区域 */
.auth-decoration {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: white;
}

.eye-container {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.decoration-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  text-align: center;
}

.decoration-subtitle {
  font-size: 15px;
  opacity: 0.9;
  text-align: center;
}

/* 右侧表单区域 */
.auth-form-section {
  flex: 1;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 14px;
  color: #888;
}

/* 表单样式 */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a2e;
}

.form-label svg {
  width: 16px;
  height: 16px;
  color: #667eea;
}

.form-input {
  padding: 14px 16px;
  border: 2px solid #e8ecf2;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.2s ease;
  background: #fafbfc;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #aaa;
}

.password-input-wrapper {
  position: relative;
}

.password-input-wrapper .form-input {
  padding-right: 48px;
}

.toggle-password {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  padding: 4px;
  color: #888;
  transition: color 0.2s ease;
}

.toggle-password:hover {
  color: #667eea;
}

.toggle-password svg {
  width: 20px;
  height: 20px;
}

/* 错误提示 */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fff5f5;
  color: #e53e3e;
  border-radius: 10px;
  font-size: 14px;
}

.error-message svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* 提交按钮 */
.submit-btn {
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 切换链接 */
.auth-switch {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #666;
}

.switch-btn {
  background: none;
  color: #667eea;
  font-weight: 600;
  margin-left: 4px;
  transition: color 0.2s ease;
}

.switch-btn:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* 游客入口 */
.guest-entry {
  margin-top: 16px;
  text-align: center;
}

.guest-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #f7fafc;
  color: #4a5568;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
}

.guest-btn:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.guest-btn svg {
  width: 16px;
  height: 16px;
}

/* 响应式 */
@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
    max-width: 400px;
  }

  .auth-decoration {
    padding: 32px;
    min-height: 180px;
  }

  .eye-container {
    margin-bottom: 16px;
  }

  .decoration-title {
    font-size: 22px;
  }

  .auth-form-section {
    padding: 32px;
  }
}
</style>
