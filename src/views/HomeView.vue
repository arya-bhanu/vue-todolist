<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useNoteStore } from '@/stores'

export type TodoType = {
  content: string
  category: string
  done: boolean
  created_by: string
  user_id: string
  created_at: Date
  id: string
}

type UserMetadataType = {
  avatar_url: string
  email: string
  email_verified: boolean
  full_name: string
  iss: string
  name: string
  phone_verified: boolean
  picture: string
  provider_id: string
  sub: string
}

const router = useRouter()
const authStore = useAuthStore()
const noteStore = useNoteStore()

const nameUser = ref('')
const uuid = ref('')
const inputContent = ref('')
const inputCategory = ref<'business' | 'personal'>('personal')
const todos = ref<TodoType[]>([])
const userMetadata = ref<UserMetadataType | null>(null)

async function handleLogout() {
  try {
    const error = await authStore.logoutUser()
    if (error) throw error
    router.replace({ name: 'login' })
  } catch (err) {
    console.error(err)
  }
}

async function addTodo(payload: Event) {
  payload.preventDefault()
  if (inputContent.value.trim() === '') return
  try {
    const error = await noteStore.createNote({
      category: inputCategory.value,
      content: inputContent.value,
      created_by: nameUser.value,
      done: false,
      user_id: uuid.value
    })
    if (error) throw error
  } catch (err) {
    console.log(err)
  }
  inputContent.value = ''
  inputCategory.value = 'business'

  fetchNotes()
}
async function deleteTodo(todo: TodoType) {
  try {
    const error = await noteStore.deleteNote(todo.id)
    if (error) throw error
    fetchNotes()
  } catch (err) {
    console.error(err)
  }
}
async function fetchNotes() {
  try {
    const { data, error } = await noteStore.viewNotes()
    if (error) throw error
    todos.value = data
  } catch (err) {
    console.error(err)
  }
}

async function updateNote() {
  await new Promise((solve) => {
    setTimeout(() => {
      solve('resolved')
    }, 3000)
  })
}

watch(
  todos,
  (curr) => {
    console.log(curr)
    updateNote()
  },
  {
    deep: true
  }
)

onMounted(() => {
  userMetadata.value = authStore.userStore.user_metadata
  uuid.value = authStore.userStore.id
  nameUser.value = userMetadata.value?.full_name || ''
  fetchNotes()
})
</script>

<template>
  <div class="app">
    <section class="greeting">
      <h2 class="title">
        <span
          >What's up, <input disabled type="text" :value="nameUser" placeholder="Name here"
        /></span>
      </h2>
      <div class="auth-btn--container">
        <button @click="handleLogout">Sign Out</button>
        <button @click="router.push({ name: 'login' })">Log in</button>
      </div>
    </section>
    <section class="create-todo">
      <h3>Create a todo list</h3>
      <form @submit="addTodo">
        <label id="inputContent">
          <h4>What's on your todo list?</h4>
        </label>
        <input
          required
          id="inputContent"
          v-model="inputContent"
          type="text"
          placeholder="e.g. make a video"
        />
        <label>
          <h4>Pick a category</h4>
        </label>
        <div class="options">
          <label>
            <input v-model="inputCategory" type="radio" name="category" value="business" />
            <span class="bubble business" />
            <div>Business</div>
          </label>
          <label>
            <input v-model="inputCategory" type="radio" name="category" value="personal" />
            <span class="bubble personal" />
            <div>Personal</div>
          </label>
        </div>
        <input type="submit" value="Create" />
      </form>
    </section>
    <section class="todo-list">
      <h3>TODO LIST</h3>
      <div v-if="todos && todos.length > 0" class="list">
        <div v-for="todo in todos" :key="todo.id" :class="`todo-item ${todo.done && 'done'}`">
          <label>
            <input type="checkbox" v-model="todo.done" />
            <span :class="`bubble ${todo.category}`"> </span>
          </label>
          <div class="todo-content">
            <input type="text" v-model="todo.content" />
          </div>

          <div class="actions">
            <button class="delete" @click="() => deleteTodo(todo)">Delete</button>
          </div>
        </div>
      </div>
      <div v-else>Notes are empty</div>
    </section>
  </div>
</template>

<style scoped lang="css">
.greeting {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.auth-btn--container {
  display: flex;
  justify-content: space-between;
  column-gap: 0.7rem;
}
.auth-btn--container button {
  min-width: max-content;
  cursor: pointer;
}
</style>
