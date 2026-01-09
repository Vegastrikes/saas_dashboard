<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getProject, updateProject } from "../services/projects";
import type { ProjectStatus } from "../types/projects";

import AppCard from "../components/ui/AppCard.vue";
import AppButton from "../components/ui/AppButton.vue";
import AppInput from "../components/ui/AppInput.vue";

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const saving = ref(false);
const error = ref<string | null>(null);

const id = Number(route.params.id);

const name = ref("");
const status = ref<ProjectStatus>("active");

function validate(): string | null {
  const n = name.value.trim();
  if (Number.isNaN(id) || id <= 0) return "Invalid project id";
  if (n.length < 2) return "Name must be at least 2 characters";
  if (n.length > 200) return "Name is too long";
  return null;
}

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const res = await getProject(id);
    name.value = res.project.name;
    status.value = res.project.status;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to load project";
  } finally {
    loading.value = false;
  }
}

async function save() {
  error.value = validate();
  if (error.value) return;

  saving.value = true;
  try {
    await updateProject({ id, name: name.value.trim(), status: status.value });
    await router.push({ name: "projects" });
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to save";
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <main class="mx-auto max-w-5xl px-6 py-6">
    <header class="flex justify-between items-center mb-4">
      <h1 class="m-0">Edit project</h1>
      <AppButton variant="ghost" @click="$router.push({ name: 'projects' })">Back</AppButton>
    </header>

    <p v-if="loading">Loading…</p>
    <p v-else-if="error" class="text-rose-600">{{ error }}</p>

    <AppCard v-else>
      <form @submit.prevent="save" class="flex flex-col gap-3">
        <label class="flex flex-col gap-1.5">
          <span>Name</span>
          <AppInput v-model="name" :disabled="saving" />
        </label>
  
        <label class="flex flex-col gap-3">
          <span>Status</span>
          <select
            v-model="status"
            :disabled="saving"
            class="p-2.5 border border-slate-300 rounded-lg opacity-70"
          >
            <option value="active">active</option>
            <option value="paused">paused</option>
            <option value="completed">completed</option>
          </select>
        </label>
  
        <div class="flex gap-2.5">
          <AppButton type="submit" :disabled="saving || !name || !status">
            {{ loading ? "Saving…..." : "Save" }}
          </AppButton>
        </div>
      </form>
    </AppCard>
  </main>
</template>
