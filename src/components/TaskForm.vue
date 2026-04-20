<template>
  <div class="task-form" @click.self="$emit('cancel')">
    <div class="form-card">
      <h3 class="form-title">{{ isEdit ? '编辑任务' : '新建任务' }}</h3>
      
      <div class="form-group">
        <label>任务标题</label>
        <input 
          v-model="formData.title" 
          type="text" 
          placeholder="请输入任务标题"
          @keyup.enter="handleSubmit"
        />
      </div>

      <div class="form-group">
        <label>优先级</label>
        <div class="priority-options">
          <button 
            v-for="p in priorities" 
            :key="p.value"
            class="priority-btn"
            :class="[p.value, { active: formData.priority === p.value }]"
            @click="formData.priority = p.value"
          >
            {{ p.label }}
          </button>
        </div>
      </div>

      <div class="form-group">
        <label>截止日期（可选）</label>
        <input 
          v-model="formData.dueDate" 
          type="date"
        />
          <span class="date-hint">{{ formatDate(formData.dueDate) }}</span>
      </div>

      <div class="form-group">
        <label>标签（最多3个）</label>
        <div class="tags-input">
          <input 
            v-model="tagInput" 
            type="text" 
            placeholder="输入标签后按回车添加"
            :disabled="formData.tags.length >= 3"
            @keyup.enter="addTag"
          />
          <div v-if="formData.tags.length" class="tags-list">
            <span v-for="(tag, index) in formData.tags" :key="index" class="tag">
              {{ tag }}
              <button class="tag-remove" @click="removeTag(index)">×</button>
            </span>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn-cancel" @click="$emit('cancel')">取消</button>
        <button class="btn-submit" @click="handleSubmit" :disabled="!formData.title.trim()">
          {{ isEdit ? '保存' : '创建' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const isEdit = ref(!!props.task)

const priorities = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' }
]

const formData = reactive({
  title: '',
  priority: 'medium',
  dueDate: '',
      // 格式: yyyy/mm/日
      validateDueDate: (v) => !v || /^\d{4}[\/]\\d{1,2}[\/]\\d{1,2}$/.test(v.replace(/万/g,'0000').replace(/[一-三日]/g, m => ({日:'0',月:'0',年:'0'}[m]))) // 简单兼容中文数字

  tags: []
})
const formatDate = (val) => {
  if (!val) return '';
  try {
    const d = new Date(val);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '/' + m + '/' + day;
  } catch { return val; }
};

const tagInput = ref('')

watch(() => props.task, (newTask) => {
  if (newTask) {
    isEdit.value = true
    formData.title = newTask.title
    formData.priority = newTask.priority
    formData.dueDate = newTask.dueDate || ''
    formData.tags = [...(newTask.tags || [])]
  } else {
    isEdit.value = false
    formData.title = ''
    formData.priority = 'medium'
    formData.dueDate = ''
    formData.tags = []
  }
}, { immediate: true })

function addTag() {
  const tag = tagInput.value.trim()
  if (tag && formData.tags.length < 3 && !formData.tags.includes(tag)) {
    formData.tags.push(tag)
    tagInput.value = ''
  }
}

function removeTag(index) {
  formData.tags.splice(index, 1)
}

function handleSubmit() {
  if (!formData.title.trim()) return
  emit('submit', { ...formData })
}
</script>

<style scoped>
.task-form {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.form-card {
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 24px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-color);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
}

.priority-options {
  display: flex;
  gap: 8px;
}

.priority-btn {
  flex: 1;
  padding: 8px 16px;
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.2s ease;
}

.priority-btn.active {
  color: white;
}

.priority-btn.high.active {
  background: var(--danger-color);
}

.priority-btn.medium.active {
  background: var(--warning-color);
}

.priority-btn.low.active {
  background: var(--success-color);
}

.tags-input input {
  width: 100%;
  margin-bottom: 8px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #E8F4FD;
  color: var(--primary-color);
  border-radius: 12px;
  font-size: 12px;
}

.tag-remove {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 16px;
  padding: 0;
  line-height: 1;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel, .btn-submit {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
}

.btn-cancel {
  background: var(--bg-color);
  color: var(--text-secondary);
}

.btn-cancel:hover {
  background: var(--border-color);
}

.btn-submit {
  background: var(--primary-color);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #3A7BC8;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
