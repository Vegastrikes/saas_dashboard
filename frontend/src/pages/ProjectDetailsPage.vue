<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getProject, deleteProject } from "../services/projects";
import type { Project } from "../types/projects";

import AppCard from "../components/ui/AppCard.vue";
import AppButton from "../components/ui/AppButton.vue";

const route = useRoute();
const router = useRouter();

const id = Number(route.params.id);

const loading = ref(true);
const error = ref<string | null>(null);
const project = ref<Project | null>(null);
const deleting = ref(false);

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const res = await getProject(id);
    project.value = res.project;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to load project";
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push({ name: "projects" });
}

function goEdit() {
  router.push({ name: "project-edit", params: { id } });
}

async function remove() {
  if (!project.value) return;
  if (!confirm(`Delete "${project.value.name}"?`)) return;

  deleting.value = true;
  error.value = null;
  try {
    await deleteProject(id);
    router.push({ name: "projects" });
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to delete project";
  } finally {
    deleting.value = false;
  }
}

onMounted(load);
</script>

<template>
  <main style="padding:24px; max-width: 820px;">
    <header style="display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom: 16px;">
      <h1 style="margin:0;">Project</h1>
      <div style="display:flex; gap:8px;">
        <AppButton variant="ghost" @click="goBack">Back</AppButton>
        <AppButton variant="ghost" @click="goEdit" :disabled="loading || !project">Edit</AppButton>
        <AppButton variant="danger" @click="remove" :disabled="loading || !project || deleting">
          {{ deleting ? "Deleting…" : "Delete" }}
        </AppButton>
      </div>
    </header>

    <p v-if="loading">Loading…</p>
    <p v-else-if="error" style="color:#b00020;">{{ error }}</p>

    <div v-else-if="project" style="display:flex; flex-direction:column; gap:16px;">
      <AppCard title="Overview">
        <div style="display:grid; grid-template-columns: 140px 1fr; row-gap:10px; column-gap:16px;">
          <div style="opacity:.7;">Name</div>
          <div>{{ project.name }}</div>

          <div style="opacity:.7;">Status</div>
          <div>{{ project.status }}</div>

          <div style="opacity:.7;">Created</div>
          <div>{{ new Date(project.created_at).toLocaleString() }}</div>

          <div style="opacity:.7;">Updated</div>
          <div>{{ new Date(project.updated_at).toLocaleString() }}</div>
        </div>
      </AppCard>

      <AppCard title="Notes">
        <p style="margin:0; opacity:.8;">
          Placeholder section.
        </p>
      </AppCard>
    </div>

    <p v-else style="opacity:.7;">Not found.</p>
  </main>
</template>
