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
  <main class="mx-auto max-w-5xl px-6 py-6">
    <header class="mb-4 flex items-center justify-between gap-3">
      <h1 class="m-0 text-xl font-semibold text-slate-900">New project</h1>
      <AppButton variant="ghost" @click="cancel">Back</AppButton>
    </header>

    <AppCard title="Details">
      <form @submit.prevent="submit" class="flex flex-col gap-3">
        <label class="flex flex-col gap-1.5">
          <span class="text-sm font-medium text-slate-700">Name</span>
          <AppInput v-model="name" :disabled="saving" />
        </label>

        <label class="flex flex-col gap-1.5">
          <span class="text-sm font-medium text-slate-700">Status</span>
          <select
            v-model="status"
            :disabled="saving"
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition
                   focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10
                   disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            <option value="active">active</option>
            <option value="paused">paused</option>
            <option value="completed">completed</option>
          </select>
        </label>

        <div class="mt-1.5 flex items-center gap-2.5">
          <AppButton type="submit" :disabled="saving">
            {{ saving ? "Creating…" : "Create" }}
          </AppButton>
          <AppButton variant="ghost" type="button" :disabled="saving" @click="cancel">
            Cancel
          </AppButton>
        </div>

        <p v-if="error" class="m-0 text-sm text-rose-700">
          {{ error }}
        </p>
      </form>
    </AppCard>
  </main>
</template>
