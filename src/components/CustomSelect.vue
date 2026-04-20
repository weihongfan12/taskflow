<template>
  <div class="custom-select" :class="{ 'is-open': isOpen }">
    <button class="select-trigger" @click="toggleDropdown">
      <span class="select-value">{{ currentLabel }}</span>
      <svg class="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
    <Transition name="dropdown">
      <div v-if="isOpen" class="select-dropdown">
        <button
          v-for="option in options"
          :key="option.value"
          class="select-option"
          :class="{ 'is-active': modelValue === option.value }"
          @click="selectOption(option.value)"
        >
          <span class="option-icon">
            <svg v-if="option.value === 'priority'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 15l-4-2.5v-5l4 2.5 4-2.5v5l-4 2.5z"/>
            </svg>
            <svg v-else-if="option.value === 'dueDate'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </span>
          <span class="option-label">{{ option.label }}</span>
          <svg v-if="modelValue === option.value" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'priority'
  },
  options: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const currentLabel = computed(() => {
  const option = props.options.find(o => o.value === props.modelValue)
  return option ? option.label : ''
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectOption(value) {
  emit('update:modelValue', value)
  isOpen.value = false
}

function handleClickOutside(e) {
  if (!e.target.closest('.custom-select')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 140px;
}

.select-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  background: white;
  border: 2px solid #e8ecf2;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.select-trigger:hover {
  border-color: #d0d7de;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.custom-select.is-open .select-trigger {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.12);
}

.select-value {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.select-arrow {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  transition: transform 0.25s ease;
}

.custom-select.is-open .select-arrow {
  transform: rotate(180deg);
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 14px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  padding: 8px;
  z-index: 100;
  overflow: hidden;
}

.select-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-option:hover {
  background: #f8fafc;
}

.select-option.is-active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.option-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-icon svg {
  width: 16px;
  height: 16px;
  color: #9ca3af;
}

.select-option.is-active .option-icon svg {
  color: #667eea;
}

.option-label {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.select-option.is-active .option-label {
  color: #667eea;
}

.check-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
</style>
