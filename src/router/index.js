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
         },
         {
          path: '/advocacyInfo',
          name: 'advocacyInfo',
          component: () => import('../views/components/advocacyInfo.vue')
         },
         {
          path: '/addAdvocacyInfo',
          name: 'addAdvocacyInfo',
          component: () => import('../views/components/addAdvocacyInfo.vue')
         },
         {
          path: '/queryAdvocacyInfo',
          name: 'queryAdvocacyInfo',
          component: () => import('../views/components/queryAdvocacyInfo.vue')
         },
         {
          path: '/querySupport',
          name: 'querySupport',
          component: () => import('../views/components/querySupport.vue')
         },
         {
          path: '/queryWaitHandle',
          name: 'queryWaitHandle',
          component: () => import('../views/components/queryWaitHandle.vue')
         },
         {
          path: '/addSupport',
          name: 'addSupport',
          component: () => import('../views/components/addSupport.vue')
         },
         {
          path: '/advocacyInfoList',
          name: 'advocacyInfoList',
          component: () => import('../views/components/advocacyInfoList.vue')
         }
        ]
    }
  ],
})

export default router
