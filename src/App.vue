<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

type TodoType = {
  content: string
  category: string
  done: boolean
  createdAt: Date
  updatedAt: Date | null
  createdBy: string
}

const nameUser = ref('')
const inputContent = ref('')
const inputCategory = ref<'business' | 'personal'>('personal')
const todos = ref<TodoType[]>([])

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
})
</script>

<template>
  <main class="app">
    <section class="greeting">
      <h2 class="title">
        <span>What's up, <input type="text" v-model="nameUser" placeholder="Name here" /></span>
      </h2>
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

<style scoped lang="css"></style>
