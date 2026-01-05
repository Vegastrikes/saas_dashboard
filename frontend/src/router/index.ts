import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "../pages/LoginPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";
import ProjectsPage from "../pages/ProjectsPage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", component: LoginPage },
    { path: "/dashboard", component: DashboardPage },
    { path: "/projects", component: ProjectsPage },
    { path: "/", redirect: "/dashboard" },
  ],
});
