import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        title: 'Super Brain Collection'
      },
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/s11e3t1',
      name: 's11e3t1',
      meta: {
        title: 'Tree Planting'
      },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/PlantTree.vue')
    }
  ]
})

export default router
