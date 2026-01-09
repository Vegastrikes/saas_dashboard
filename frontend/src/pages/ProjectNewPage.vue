<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createProject } from "../services/projects";
import type { ProjectStatus } from "../types/projects";

import AppCard from "../components/ui/AppCard.vue";
import AppInput from "../components/ui/AppInput.vue";
import AppButton from "../components/ui/AppButton.vue";

const router = useRouter();

const name = ref("");
const status = ref<ProjectStatus>("active");

const saving = ref(false);
const error = ref<string | null>(null);

function validate(): string | null {
  const n = name.value.trim();
  if (n.length < 2) return "Name must be at least 2 characters";
  if (n.length > 200) return "Name is too long";
  return null;
}

async function submit() {
  error.value = validate();
  if (error.value) return;

  saving.value = true;
  try {
    const res = await createProject({ name: name.value.trim(), status: status.value });
    router.push({ name: "project-details", params: { id: res.project.id } });
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to create project";
  } finally {
    saving.value = false;
  }
}

function cancel() {
  router.push({ name: "projects" });
}
</script>

<template>
  <main style="padding:24px; max-width: 720px;">
    <header style="display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom: 16px;">
      <h1 style="margin:0;">New project</h1>
      <AppButton variant="ghost" @click="cancel">Back</AppButton>
    </header>

    <AppCard title="Details">
      <form @submit.prevent="submit" style="display:flex; flex-direction:column; gap:12px;">
        <label style="display:flex; flex-direction:column; gap:6px;">
          <span>Name</span>
          <AppInput v-model="name" :disabled="saving" />
        </label>

        <label style="display:flex; flex-direction:column; gap:6px;">
          <span>Status</span>
          <select
            v-model="status"
            :disabled="saving"
            style="padding:10px; border:1px solid #ccc; border-radius:8px;"
          >
            <option value="active">active</option>
            <option value="paused">paused</option>
            <option value="completed">completed</option>
          </select>
        </label>

        <div style="display:flex; gap:10px; align-items:center; margin-top: 6px;">
          <AppButton type="submit" :disabled="saving">
            {{ saving ? "Creating…" : "Create" }}
          </AppButton>
          <AppButton variant="ghost" type="button" :disabled="saving" @click="cancel">
            Cancel
          </AppButton>
        </div>

        <p v-if="error" style="margin:0; color:#b00020;">{{ error }}</p>
      </form>
    </AppCard>
  </main>
</template>
