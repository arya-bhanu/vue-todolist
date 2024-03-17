<template>
  <div class="main">
    <form @submit.prevent="handleSubmitSignup">
      <div>
        <label for="email">Enter your email</label>
        <input
          required
          type="text"
          v-model="email"
          id="email"
          placeholder="Enter your registered email"
        />
      </div>
      <div>
        <label for="password">Enter your password</label>
        <input
          required
          type="password"
          v-model="password"
          id="password"
          placeholder="Enter your password"
        />
      </div>
      <div>
        <label for="confirmPassword">Enter your confirm password</label>
        <input
          required
          type="password"
          v-model="confirmPassword"
          id="confirmPassword"
          placeholder="Enter your confirmation password"
        />
      </div>
      <input type="submit" value="Signup" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/index'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

async function handleSubmitSignup() {
  const trimedEmail = email.value.trim()
  const trimedPassword = email.value.trim()
  const trimedConfirmPassword = email.value.trim()

  if (trimedEmail && trimedPassword === trimedConfirmPassword) {
    const authStore = useAuthStore()
    try {
      const { data, error } = await authStore.createUser(trimedEmail, trimedPassword)
      if (error) throw error
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style scoped lang="css">
.main {
  display: flex;
  min-height: 100vh;
}
form {
  display: flex;
  flex-direction: column;
  width: fit-content;
  row-gap: 0.5rem;
  margin: auto;
}
form div {
  display: flex;
  flex-direction: column;
}
form input[type='submit'] {
  cursor: pointer;
}
</style>
