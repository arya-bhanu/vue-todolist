<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'vue-router'

type TodoType = {
  content: string
  category: string
  done: boolean
  createdAt: Date
  updatedAt: Date | null
  createdBy: string
}

const router = useRouter()

const nameUser = ref('')
const inputContent = ref('')
const inputCategory = ref<'business' | 'personal'>('personal')
const todos = ref<TodoType[]>([])
const countries = ref<any[] | null>([])

function addTodo(payload: Event) {
  payload.preventDefault()
  if (inputContent.value.trim() === '') return
  todos.value.push({
    category: inputCategory.value,
    content: inputContent.value,
    createdAt: new Date(),
    createdBy: nameUser.value,
    done: false,
    updatedAt: null
  })
  inputContent.value = ''
  inputCategory.value = 'business'
}
function deleteTodo(todo: TodoType) {
  todos.value = todos.value.filter((el) => el !== todo)
}

async function getCountries() {
  const { data } = await supabase.from('countries').select()
  countries.value = data
}

watch(
  todos,
  (curr) => {
    window.localStorage.setItem('todos', JSON.stringify(curr))
  },
  {
    deep: true
  }
)
watch(nameUser, (prev) => {
  window.localStorage.setItem('name', prev)
})
onMounted(() => {
  nameUser.value = window.localStorage.getItem('name') || ''
  const todosString = window.localStorage.getItem('todos')
  todos.value = todosString ? JSON.parse(todosString) : []
  getCountries()
})
</script>

<template>
  <main class="app">
    <section class="greeting">
      <h2 class="title">
        <span>What's up, <input type="text" v-model="nameUser" placeholder="Name here" /></span>
      </h2>
      <div class="auth-btn--container">
        <button>Sign Out</button>
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
      <div class="list">
        <div
          v-for="(todo, index) in todos"
          :key="index"
          :class="`todo-item ${todo.done && 'done'}`"
        >
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
    </section>
  </main>
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
