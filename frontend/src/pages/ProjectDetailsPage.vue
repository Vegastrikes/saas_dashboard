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
  <main class="mx-auto max-w-5xl px-6 py-6">
    <header class="flex justify-between items-center gap-3 mb-4">
      <h1 class="m-0">Project</h1>
      <div class="flex gap-2">
        <AppButton variant="ghost" @click="goBack">Back</AppButton>
        <AppButton variant="primary" @click="goEdit" :disabled="loading || !project">Edit</AppButton>
        <AppButton variant="danger" @click="remove" :disabled="loading || !project || deleting">
          {{ deleting ? "Deleting…" : "Delete" }}
        </AppButton>
      </div>
    </header>

    <p v-if="loading">Loading…</p>
    <p v-else-if="error" class="text-rose-600">{{ error }}</p>

    <div v-else-if="project" class="flex flex-col gap-4">
      <AppCard title="Overview">
        <div class="grid grid-cols-[auto_1fr] gap-y-[2.5] gap-x-4">
          <div class="opacity-70">Name</div>
          <div>{{ project.name }}</div>

          <div class="opacity-70">Status</div>
          <div>{{ project.status }}</div>

          <div class="opacity-70">Created</div>
          <div>{{ new Date(project.created_at).toLocaleString() }}</div>

          <div class="opacity-70">Updated</div>
          <div>{{ new Date(project.updated_at).toLocaleString() }}</div>
        </div>
      </AppCard>
    </div>
  </main>
</template>
