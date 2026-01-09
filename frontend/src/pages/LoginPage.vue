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
  <main style="padding: 24px; max-width: 420px;">
    <h1 style="margin-bottom: 12px;">Login</h1>

    <AppCard title="Login">
      <form @submit.prevent="submit" style="display:flex; flex-direction:column; gap:12px;">
        <label style="display:flex; flex-direction:column; gap:6px;">
          <span>Email</span>
          <AppInput v-model="email" type="email" autocomplete="email" :disabled="loading" />
        </label>

        <label style="display:flex; flex-direction:column; gap:6px;">
          <span>Password</span>
          <AppInput v-model="password" type="password" autocomplete="current-password" :disabled="loading" />
        </label>

        <AppButton type="submit" :disabled="loading || !email || !password">
          {{ loading ? "Signing in..." : "Sign in" }}
        </AppButton>

        <p v-if="error" style="margin:0; color:#b00020;">{{ error }}</p>

        <p style="margin:0;">
          Don’t have an account?
          <RouterLink to="/register">Create one</RouterLink>
        </p>
      </form>
    </AppCard>
  </main>
</template>
