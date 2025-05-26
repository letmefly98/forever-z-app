import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const { BASE_PATH } = process.env

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/components/Layouts/NormalLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard.vue'),
      },
      {
        path: '/map-editor',
        name: 'MapEditor',
        component: () => import('@/pages/MapEditor.vue'),
      },
    ],
  },
  {
    path: '/poster',
    name: 'Poster',
    component: () => import('@/components/Layouts/NormalLayout.vue'),
    redirect: '/poster/builder',
    children: [
      {
        path: 'builder',
        name: 'PosterBuilder',
        component: () => import('@/pages/poster/builder/index.vue'),
      },
      {
        path: 'preview',
        name: 'PosterPreview',
        component: () => import('@/pages/poster/preview/index.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(BASE_PATH),
  routes,
})

export default router
