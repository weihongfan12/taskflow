<template>
  <AuthView v-if="!store.isAuthenticated" @login="handleLogin" />
  <HomeView v-else />
</template>

<script setup>
import { onMounted } from 'vue'
import { useTaskStore } from './stores/taskStore'
import AuthView from './views/AuthView.vue'
import HomeView from './views/HomeView.vue'

const store = useTaskStore()

onMounted(() => {
  store.initAuth()
  store.loadFromStorage()
})

function handleLogin(userData) {
  store.login(userData)
}
</script>
