<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "./stores/auth";

const auth = useAuthStore();

import UserCircle from "./components/UserCircle.vue";

const isAuthed = computed(() => auth.isAuthenticated);
</script>

<template>
  <div>
    <nav class="flex items-center gap-4 border-b border-slate-200 px-6 py-3">
      <RouterLink v-if="isAuthed" to="/dashboard" class="router-link">Dashboard</RouterLink>
      <RouterLink v-if="isAuthed" to="/projects" class="router-link">Projects</RouterLink>

      <span class="flex-1"></span>

      <template v-if="!isAuthed">
        <RouterLink to="/login" class="router-link">Login</RouterLink>
        <RouterLink to="/register" class="router-link">Register</RouterLink>
      </template>

      <template v-else>
        <UserCircle></UserCircle>
      </template>
    </nav>

    <RouterView />
  </div>
</template>
