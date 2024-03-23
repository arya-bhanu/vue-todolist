<script setup lang="ts">
import { onMounted, ref } from 'vue'
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
const isUpdating = ref(false)
const oldValInput = ref('')

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

async function handleOnFocus(e: FocusEvent) {
  oldValInput.value = (e.target as HTMLInputElement).value
}

async function updateNoteContent(e: FocusEvent, id: string) {
  const value = (e.target as HTMLInputElement).value
  if (value.trim() === oldValInput.value.trim()) return
  try {
    isUpdating.value = true
    const error = await noteStore.updateNoteContent(value, id)
    if (error) throw error
  } catch (err) {
    console.error(err)
  } finally {
    await fetchNotes()
    isUpdating.value = false
  }
}

async function updateNoteDone(e: Event, id: string) {
  const newVal = (e.target as HTMLInputElement).checked
  try {
    isUpdating.value = true
    const error = await noteStore.updateNoteDone(newVal, id)
    if (error) throw error
  } catch (err) {
    console.error(err)
  } finally {
    await fetchNotes()
    isUpdating.value = false
  }
}

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
      <div class="name-container">
        <span>What's up, </span>
        <h2 class="title">
          {{ nameUser }}
        </h2>
      </div>
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
            <input
              @change.prevent="(e) => updateNoteDone(e, todo.id)"
              :disabled="isUpdating"
              type="checkbox"
              v-model="todo.done"
            />
            <span :class="`bubble ${todo.category}`"> </span>
          </label>
          <div class="todo-content">
            <input
              @focus.prevent="handleOnFocus"
              @blur.prevent="(e) => updateNoteContent(e, todo.id)"
              :disabled="isUpdating"
              type="text"
              v-model="todo.content"
            />
          </div>
          <div class="right-container">
            <span>{{ todo.category }}</span>
            <div class="actions">
              <button class="delete" @click="() => deleteTodo(todo)">Delete</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else>Notes are empty</div>
    </section>
  </div>
</template>

<style scoped lang="css">
.name-container span {
  font-weight: bold;
  font-size: 1.2rem;
}

.right-container {
  display: flex;
  align-items: center;
  column-gap: 0.3rem;
  row-gap: 0.2rem;
  flex-wrap: wrap;
}

.right-container span {
  background-color: rgb(215, 24, 177);
  color: white;
  padding: 0.4rem 0.5rem;
  display: block;
  border-radius: 0.3rem;
}

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
  display: block;
  height: fit-content;
  min-width: max-content;
  cursor: pointer;
  background-color: white;
  font-weight: bold;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.1s ease;
}
.auth-btn--container button:hover {
  box-shadow: 0px 0px 7px 2px rgba(0, 0, 0, 0.1);
}
</style>
