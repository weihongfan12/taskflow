<template>
  <div class="task-item" :class="{ completed: task.completed, 'is-selected': isSelected }">
    <div class="task-checkbox" @click="handleComplete">
      <svg v-if="task.completed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
    <div class="task-content" @click="$emit('select', task.id)">
      <div class="task-header">
        <span class="task-title">{{ task.title }}</span>
        <span class="priority-badge" :class="task.priority">{{ priorityText }}</span>
      </div>
      <div class="task-meta">
        <span v-if="task.dueDate" class="due-date">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {{ formatDate(task.dueDate) }}
        </span>
        <span v-if="task.tags.length" class="tags">
          <span v-for="tag in task.tags" :key="tag" class="tag">{{ tag }}</span>
        </span>
      </div>
    </div>
    <div class="task-actions">
      <button class="action-btn edit" @click.stop="$emit('edit', task)" title="编辑">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      <button class="action-btn delete" @click.stop="$emit('delete', task.id)" title="删除">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['complete', 'edit', 'delete', 'select'])

const priorityText = computed(() => {
  const map = { high: '高', medium: '中', low: '低' }
  return map[props.task.priority] || '中'
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) return '今天'
  if (date.toDateString() === tomorrow.toDateString()) return '明天'
  return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}

function handleComplete() {
  if (!props.task.completed) {
    emit('complete', props.task.id)
  }
}
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  transition: all 0.2s ease;
  cursor: pointer;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.task-item.is-selected {
  border: 2px solid var(--primary-color);
}

.task-item.completed {
  opacity: 0.6;
}

.task-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.task-item.completed .task-checkbox {
  background: var(--success-color);
  border-color: var(--success-color);
  color: white;
}

.task-checkbox svg {
  width: 14px;
  height: 14px;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.task-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-color);
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.priority-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.priority-badge.high {
  background: #FFF2F0;
  color: var(--danger-color);
}

.priority-badge.medium {
  background: #FFF7E6;
  color: var(--warning-color);
}

.priority-badge.low {
  background: #F6FFED;
  color: var(--success-color);
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--text-secondary);
}

.due-date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.due-date svg {
  width: 14px;
  height: 14px;
}

.tags {
  display: flex;
  gap: 6px;
}

.tag {
  padding: 2px 8px;
  background: #E8F4FD;
  color: var(--primary-color);
  border-radius: 10px;
  font-size: 11px;
}

.task-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.task-item:hover .task-actions {
  opacity: 1;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn.edit:hover {
  background: #E8F4FD;
  color: var(--primary-color);
}

.action-btn.delete:hover {
  background: #FFF2F0;
  color: var(--danger-color);
}
</style>
