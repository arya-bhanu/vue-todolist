import { supabase } from '@/lib/supabaseClient'
import type { TodoType } from '@/views/HomeView.vue'
import type { User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('authStore', () => {
  const userStore = ref<null | User>(null)

  async function loginUser() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${import.meta.env.VITE_CLIENT_URL}/welcome`
      }
    })
    return { data, error }
  }

  async function logoutUser() {
    const { error } = await supabase.auth.signOut()
    return error
  }

  async function getUser() {
    const { data: user } = await supabase.auth.getUser()
    userStore.value = user.user
    return user
  }

  return { loginUser, getUser, userStore, logoutUser }
})

export const useNoteStore = defineStore('noteStore', () => {
  async function createNote(payload: TodoType) {
    const { error } = await supabase.from('note').insert(payload)
    return error
  }

  async function viewNotes() {
    const { data, error } = await supabase.from('note').select()
    return { data, error }
  }

  async function deleteNote(id: string) {
    const { error } = await supabase.from('note').delete().eq('id', id)
    return error
  }

  async function updateNoteContent(newValue: string, id: string) {
    const { error } = await supabase.from('note').update({ content: newValue }).eq('id', id)
    return error
  }

  async function updateNoteDone(newVal: boolean, id: string) {
    const { error } = await supabase.from('note').update({ done: newVal }).eq('id', id)
    return error
  }

  return { createNote, viewNotes, deleteNote, updateNoteContent, updateNoteDone }
})
