<template>
  <div class="main">
    <button @click="handleSubmitLogin">Login Google</button>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores'

async function handleSubmitLogin() {
  const authStore = useAuthStore()
  try {
    const { error } = await authStore.loginUser()
    if (error) throw error
  } catch (err) {
    console.log(err)
  }
}
</script>

<style scoped lang="css">
.main {
  display: flex;
  min-height: 100vh;
}
</style>
