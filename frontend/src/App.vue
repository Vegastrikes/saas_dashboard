<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth";

const auth = useAuthStore();
const router = useRouter();

import AppButton from "./components/ui/AppButton.vue";

const isAuthed = computed(() => auth.isAuthenticated);

async function logout() {
  await auth.logout();
  await router.replace("/login");
}
</script>

<template>
  <div>
    <nav style="display:flex; gap:12px; padding:12px; border-bottom:1px solid #ddd; align-items:center;">
      <RouterLink v-if="isAuthed" to="/dashboard">Dashboard</RouterLink>
      <RouterLink v-if="isAuthed" to="/projects">Projects</RouterLink>

      <span style="flex:1;"></span>

      <template v-if="!isAuthed">
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
      </template>

      <template v-else>
        <span style="font-size: 14px; opacity: 0.8;">{{ auth.user?.email }}</span>
        <AppButton variant="ghost" @click="logout">Logout</AppButton>
      </template>
    </nav>

    <RouterView />
  </div>
</template>
