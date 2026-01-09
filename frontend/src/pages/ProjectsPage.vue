<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { createProject, deleteProject, listProjects } from "../services/projects";
import type { Project, ProjectStatus } from "../types/projects";

import AppButton from "../components/ui/AppButton.vue";
import AppInput from "../components/ui/AppInput.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppTable from "../components/ui/AppTable.vue";

const router = useRouter();

const loading = ref(false);
const error = ref<string | null>(null);

const page = ref(1);
const pageSize = ref(10);
const status = ref<ProjectStatus | "">("");

const items = ref<Project[]>([]);
const totalPages = ref(1);

const newName = ref("");
const newStatus = ref<ProjectStatus>("active");
const creating = ref(false);

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

async function submitCreate() {
  const name = newName.value.trim();
  if (name.length < 2) {
    error.value = "Project name must be at least 2 characters";
    return;
  }

  creating.value = true;
  error.value = null;
  try {
    await createProject({ name, status: newStatus.value });
    newName.value = "";
    newStatus.value = "active";
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to create project";
  } finally {
    creating.value = false;
  }
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
  <main style="padding: 24px;">
    <header style="display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom: 16px;">
      <h1 style="margin:0;">Projects</h1>

      <div style="display:flex; gap:12px; align-items:center;">
        <label style="display:flex; gap:8px; align-items:center;">
          <span>Status</span>
          <select v-model="status" :disabled="loading" style="padding:8px; border:1px solid #ccc; border-radius:8px;">
            <option value="">All</option>
            <option value="active">active</option>
            <option value="paused">paused</option>
            <option value="completed">completed</option>
          </select>
        </label>

        <label style="display:flex; gap:8px; align-items:center;">
          <span>Page size</span>
          <select v-model.number="pageSize" :disabled="loading" style="padding:8px; border:1px solid #ccc; border-radius:8px;">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
        </label>
      </div>
    </header>

    <AppCard title="Create project" style="margin-bottom:16px;">
      <form @submit.prevent="submitCreate" style="display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end;">
        <label style="display:flex; flex-direction:column; gap:6px;">
          <span>Name</span>
          <AppInput v-model="newName" :disabled="creating" />
        </label>

        <label style="display:flex; flex-direction:column; gap:6px;">
          <span>Status</span>
          <select v-model="newStatus" :disabled="creating" style="padding:10px; border:1px solid #ccc; border-radius:8px;">
            <option value="active">active</option>
            <option value="paused">paused</option>
            <option value="completed">completed</option>
          </select>
        </label>

        <AppButton type="submit" :disabled="creating">
          {{ creating ? "Creating..." : "Create" }}
        </AppButton>
      </form>

      <p v-if="error" style="margin:12px 0 0; color:#b00020;">{{ error }}</p>
    </AppCard>


    <section style="border:1px solid #ddd; border-radius:12px; overflow:hidden;">
      <div style="padding: 12px 16px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
        <span v-if="loading">Loading…</span>
        <span v-else style="opacity:.8;">Page {{ page }} / {{ totalPages }}</span>

        <div style="display:flex; gap:8px;">
          <button type="button" @click="prevPage" :disabled="loading || page <= 1"
            style="padding:8px 10px; border:1px solid #333; border-radius:8px; background:transparent; cursor:pointer;">
            Prev
          </button>
          <button type="button" @click="nextPage" :disabled="loading || page >= totalPages"
            style="padding:8px 10px; border:1px solid #333; border-radius:8px; background:transparent; cursor:pointer;">
            Next
          </button>
        </div>
      </div>

      <AppTable>
        <thead>
          <tr style="text-align:left; background:#fafafa;">
            <th style="padding:12px 16px; border-bottom:1px solid #eee;">Name</th>
            <th style="padding:12px 16px; border-bottom:1px solid #eee;">Status</th>
            <th style="padding:12px 16px; border-bottom:1px solid #eee;">Created</th>
            <th style="padding:12px 16px; border-bottom:1px solid #eee;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in items" :key="p.id">
            <td style="padding:12px 16px; border-bottom:1px solid #f0f0f0;">{{ p.name }}</td>
            <td style="padding:12px 16px; border-bottom:1px solid #f0f0f0;">{{ p.status }}</td>
            <td style="padding:12px 16px; border-bottom:1px solid #f0f0f0;">{{ new Date(p.created_at).toLocaleString() }}</td>
            <td style="padding:12px 16px; border-bottom:1px solid #f0f0f0;">
              <div style="display:flex; gap:8px;">
                <AppButton variant="ghost" @click="edit(p)">Edit</AppButton>
                <AppButton variant="danger" @click="remove(p)">Delete</AppButton>
              </div>
            </td>
          </tr>

          <tr v-if="!loading && items.length === 0">
            <td colspan="4" style="padding:16px; opacity:.7;">No projects found.</td>
          </tr>
        </tbody>
      </AppTable>
    </section>
  </main>
</template>
