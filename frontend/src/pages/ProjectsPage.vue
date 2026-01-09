<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { deleteProject, listProjects } from "../services/projects";
import type { Project, ProjectStatus } from "../types/projects";

import AppButton from "../components/ui/AppButton.vue";
import AppTable from "../components/ui/AppTable.vue";

const router = useRouter();

const loading = ref(false);
const error = ref<string | null>(null);

const page = ref(1);
const pageSize = ref(10);
const status = ref<ProjectStatus | "">("");

const items = ref<Project[]>([]);
const totalPages = ref(1);

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const res = await listProjects({
      page: page.value,
      pageSize: pageSize.value,
      status: status.value,
    });
    items.value = res.items;
    totalPages.value = res.totalPages || 1;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to load projects";
  } finally {
    loading.value = false;
  }
}

function goNew() {
  router.push({ name: "project-new" });
}

async function remove(p: Project) {
  if (!confirm(`Delete "${p.name}"?`)) return;
  try {
    await deleteProject(p.id);
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to delete project";
  }
}

function edit(p: Project) {
  router.push({ name: "project-edit", params: { id: p.id } });
}

function nextPage() {
  if (page.value < totalPages.value) page.value += 1;
}
function prevPage() {
  if (page.value > 1) page.value -= 1;
}

watch([page, pageSize, status], () => {
  load();
});

onMounted(() => {
  load();
});
</script>

<template>
  <main class="mx-auto max-w-5xl px-6 py-6">
    <header class="flex items-center justify-between gap-3 mb-4">
      <div class="flex gap-3">
        <h1 class="m-0 text-3xl">Projects</h1>
        <AppButton @click="goNew">New project</AppButton>
      </div>

      <div class="flex gap-3 items-center">
        <label class="flex gap-2 items-center">
          <span>Status</span>
          <select v-model="status" :disabled="loading" class="p-2 border border-slate-300 rounded-lg cursor-pointer">
            <option value="">All</option>
            <option value="active">active</option>
            <option value="paused">paused</option>
            <option value="completed">completed</option>
          </select>
        </label>

        <label class="flex gap-2 items-center">
          <span>Page size</span>
          <select v-model.number="pageSize" :disabled="loading" class="p-2 border border-slate-300 rounded-lg cursor-pointer">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
        </label>
      </div>
    </header>

    <section class="border border-slate-200 rounded-3xl overflow-hidden">
      <div class="flex justify-between items-center px-3 py-4">
        <span v-if="loading">Loading…</span>
        <span v-else class="py-4">Page {{ page }} / {{ totalPages }}</span>

        <div class="flex gap-2">
          <AppButton variant="ghost" @click="prevPage" :disabled="loading || page <= 1">Prev</AppButton>
          <AppButton variant="ghost" @click="nextPage" :disabled="loading || page >= totalPages">Next</AppButton>
        </div>
      </div>

      <AppTable>
        <colgroup>
          <col class="w-full" />
          <col class="w-36" />
          <col class="w-50" />
          <col class="w-36" />
        </colgroup>
        <thead>
          <tr class="text-left bg-slate-100">
            <th class="px-2 py-4">Name</th>
            <th class="px-2 py-4 text-left">Status</th>
            <th class="px-2 py-4 text-left">Created</th>
            <th class="px-2 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in items" :key="p.id" class="border-b border-slate-200">
            <td class="px-2 py-2.5">
              <RouterLink :to="{ name: 'project-details', params: { id: p.id } }" class="router-link">
                {{ p.name }}
              </RouterLink>
            </td>
            <td class="px-2 py-2.5 text-left opacity-70">{{ p.status }}</td>
            <td class="px-2 py-2.5 text-left opacity-70">{{ new Date(p.created_at).toLocaleString() }}</td>
            <td class="px-2 py-2.5">
              <div class="flex gap-2">
                <AppButton variant="ghost" class="opacity-70" @click="edit(p)">Edit</AppButton>
                <AppButton variant="danger" class="opacity-70" @click="remove(p)">Delete</AppButton>
              </div>
            </td>
          </tr>

          <tr v-if="!loading && items.length === 0">
            <td colspan="4" class="px-4 py-8">No projects found.</td>
          </tr>
        </tbody>
      </AppTable>
    </section>
  </main>
</template>
