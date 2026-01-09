import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";
import ProjectsPage from "../pages/ProjectsPage.vue";
import ProjectDetailsPage from "../pages/ProjectDetailsPage.vue";
import ProjectEditPage from "../pages/ProjectEditPage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", name: "login", component: LoginPage, meta: { public: true } },
    { path: "/register", name: "register", component: RegisterPage, meta: { public: true } },

    { path: "/dashboard", name: "dashboard", component: DashboardPage },

    { path: "/projects", name: "projects", component: ProjectsPage },
    { path: "/projects/:id", name: "project-details", component: ProjectDetailsPage },
    { path: "/projects/:id/edit", name: "project-edit", component: ProjectEditPage },

    { path: "/", redirect: "/dashboard" },
    { path: "/:pathMatch(.*)*", redirect: "/dashboard" },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // Ensure auth state is settled before deciding navigation.
  if (!auth.isReady) {
    await auth.hydrate();
  }

  const isPublic = to.meta.public === true;

  if (!isPublic && !auth.isAuthenticated) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }

  if (isPublic && auth.isAuthenticated && (to.name === "login" || to.name === "register")) {
    return { name: "dashboard" };
  }

  return true;
});
