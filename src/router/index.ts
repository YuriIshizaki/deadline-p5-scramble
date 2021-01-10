import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Scramble from "@/views/Scramble.vue";
import Preference from "@/views/Preference.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Scramble",
    component: Scramble
  },
  {
    path: "/preference",
    name: "Preference",
    meta: {
      title: "Preference"
    },
    component: Preference
  }
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
