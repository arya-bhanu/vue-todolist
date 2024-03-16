<template>
  <main>
    <form @submit.prevent="handleSubmitLogin">
      <label for="email">Enter your email</label>
      <input
        required
        type="text"
        v-model="email"
        id="email"
        placeholder="Enter your registered email"
      />
      <label for="password">Enter your password</label>
      <input
        required
        type="password"
        v-model="password"
        id="password"
        placeholder="Enter your password"
      />
    </form>
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

function handleSubmitLogin() {
  const trimmedEmail = email.value.trim()
  const trimmedPassword = password.value.trim()
  if (trimmedEmail && trimmedPassword) {
    console.log('connfirmed')
  }
}
</script>

<style scoped lang="css">
main {
  display: flex;
  min-height: 100vh;
}
</style>
