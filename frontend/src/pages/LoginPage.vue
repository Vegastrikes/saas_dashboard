<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

import AppInput from "../components/ui/AppInput.vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");

const loading = ref(false);
const error = ref<string | null>(null);

function getRedirectTarget(): string {
  const q = route.query.redirect;
  if (typeof q === "string" && q.startsWith("/")) return q;
  return "/dashboard";
}

async function submit() {
  error.value = null;
  loading.value = true;

  try {
    await auth.login(email.value.trim(), password.value);
    await router.replace(getRedirectTarget());
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Login failed";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="mx-auto max-w-5xl px-6 py-6">
    <AppCard title="Login">
      <form @submit.prevent="submit" class="flex flex-col gap-3">
        <label class="flex flex-col gap-1.5">
          <span>Email</span>
          <AppInput v-model="email" type="email" autocomplete="email" :disabled="loading" />
        </label>

        <label class="flex flex-col gap-1.5">
          <span>Password</span>
          <AppInput v-model="password" type="password" autocomplete="current-password" :disabled="loading" />
        </label>

        <AppButton type="submit" :disabled="loading || !email || !password">
          {{ loading ? "Signing in..." : "Sign in" }}
        </AppButton>

        <p v-if="error" class="m-0 text-rose-600">{{ error }}</p>

        <p class="m-0">
          Don’t have an account?
          <RouterLink to="/register" class="router-link">Create one</RouterLink>
        </p>
      </form>
    </AppCard>
  </main>
</template>
