<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const loading = ref(false);
const error = ref<string | null>(null);

function validate(): string | null {
  const e = email.value.trim();
  if (!e) return "Email is required";
  if (!e.includes("@")) return "Email looks invalid";
  if (password.value.length < 8) return "Password must be at least 8 characters";
  if (password.value !== confirmPassword.value) return "Passwords do not match";
  return null;
}

async function submit() {
  error.value = validate();
  if (error.value) return;

  loading.value = true;
  try {
    await auth.register(email.value.trim(), password.value);
    await router.replace("/dashboard");
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Registration failed";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main style="padding: 24px; max-width: 420px;">
    <h1 style="margin-bottom: 12px;">Create account</h1>

    <form @submit.prevent="submit" style="display:flex; flex-direction:column; gap:12px;">
      <label style="display:flex; flex-direction:column; gap:6px;">
        <span>Email</span>
        <input
          v-model="email"
          type="email"
          autocomplete="email"
          required
          :disabled="loading"
          style="padding:10px; border:1px solid #ccc; border-radius:8px;"
        />
      </label>

      <label style="display:flex; flex-direction:column; gap:6px;">
        <span>Password</span>
        <input
          v-model="password"
          type="password"
          autocomplete="new-password"
          required
          :disabled="loading"
          style="padding:10px; border:1px solid #ccc; border-radius:8px;"
        />
      </label>

      <label style="display:flex; flex-direction:column; gap:6px;">
        <span>Confirm password</span>
        <input
          v-model="confirmPassword"
          type="password"
          autocomplete="new-password"
          required
          :disabled="loading"
          style="padding:10px; border:1px solid #ccc; border-radius:8px;"
        />
      </label>

      <button
        type="submit"
        :disabled="loading"
        style="padding:10px; border:1px solid #333; border-radius:8px; cursor:pointer;"
      >
        {{ loading ? "Creating..." : "Create account" }}
      </button>

      <p v-if="error" style="margin:0; color:#b00020;">
        {{ error }}
      </p>

      <p style="margin:0;">
        Already have an account?
        <RouterLink to="/login">Sign in</RouterLink>
      </p>
    </form>
  </main>
</template>
