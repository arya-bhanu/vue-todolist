import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'
import WelcomeView from '@/views/WelcomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      async beforeEnter() {
        const authStore = useAuthStore()
        const { user } = await authStore.getUser()
        if (!user) {
          return { name: 'welcome' }
        }
      }
    }
  ]
})

export default router
