import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
     },
     {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
     },
     {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
     },
     {
      path: '/index',
      name: 'index',
      component: () => import('../views/indexView.vue'),
      children: [
         {
          path: '/home',
          name: 'home',
          component: () => import('../views/homeView.vue')
         },
         {
          path: '/usersManage',
          name: 'usersManage',
          component: () => import('../views/components/usersManage.vue')
         }
      ]
    }
  ],
})

export default router
