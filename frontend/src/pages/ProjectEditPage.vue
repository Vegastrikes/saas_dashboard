<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getProject, updateProject } from "../services/projects";
import type { ProjectStatus } from "../types/projects";

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
  <main style="padding: 24px; max-width: 640px;">
    <header style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 16px;">
      <h1 style="margin:0;">Edit project</h1>
      <button
        type="button"
        @click="$router.push({ name: 'projects' })"
        style="padding:8px 10px; border:1px solid #333; border-radius:8px; background:transparent; cursor:pointer;"
      >
        Back
      </button>
    </header>

    <p v-if="loading">Loading…</p>
    <p v-else-if="error" style="color:#b00020;">{{ error }}</p>

    <form v-else @submit.prevent="save" style="display:flex; flex-direction:column; gap:12px;">
      <label style="display:flex; flex-direction:column; gap:6px;">
        <span>Name</span>
        <input
          v-model="name"
          :disabled="saving"
          style="padding:10px; border:1px solid #ccc; border-radius:8px;"
        />
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

      <div style="display:flex; gap:10px;">
        <button
          type="submit"
          :disabled="saving"
          style="padding:10px 14px; border:1px solid #333; border-radius:8px; cursor:pointer; background:transparent;"
        >
          {{ saving ? "Saving…" : "Save" }}
        </button>
      </div>
    </form>
  </main>
</template>
