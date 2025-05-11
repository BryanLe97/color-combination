import Vue from 'vue'
import VueRouter from 'vue-router'
import ColorCombination from '../views/ColorCombination.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'colorCombination',
      component: ColorCombination
    },
  ]
})

export default router
