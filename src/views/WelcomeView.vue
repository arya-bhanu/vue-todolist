<template>
  <div class="container">
    <div class="center">
      <h1>Hello World!</h1>
      <h3>Welcome on BroNotes 👋</h3>
      <p>Manage your daily personal and business life</p>
      <button @click="handleLogin">
        <span>Sign in</span>
        <i>
          <v-icon name="fc-google" />
        </i>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAuthStore } from '@/stores'

const authStore = useAuthStore()
async function handleLogin() {
  try {
    const { error } = await authStore.loginUser()
    if (error) throw error
  } catch (err) {
    console.error(err)
  }
}
</script>
<style scoped lang="css">
.container {
  min-height: 100vh;
  display: flex;
}
.container .center {
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container .center h1 {
  text-align: center;
  font-size: 3rem;
}
.container .center h3 {
  text-align: center;
  font-weight: 500;
  font-size: 1.5rem;
}
.container .center p {
  text-decoration: underline;
  text-align: center;
}

.container .center button {
  cursor: pointer;
  display: flex;
  align-items: center;
  column-gap: 0.3rem;
  outline-width: 0.2rem;
  outline: auto;
  padding: 0.3rem 0.5rem;
  outline-color: black;
  margin-top: 2rem;
}
</style>
