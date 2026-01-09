<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getDashboardStats } from "../services/stats";
import type { DashboardStats } from "../types/stats";

const loading = ref(true);
const error = ref<string | null>(null);
const stats = ref<DashboardStats | null>(null);

async function load() {
  loading.value = true;
  error.value = null;
  try {
    stats.value = await getDashboardStats();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to load stats";
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <main style="padding: 24px;">
    <h1 style="margin-bottom: 16px;">Dashboard</h1>

    <p v-if="loading">Loading…</p>
    <p v-else-if="error" style="color:#b00020;">{{ error }}</p>

    <section
      v-else-if="stats"
      style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:16px;"
    >
      <div style="border:1px solid #ddd; border-radius:12px; padding:16px;">
        <strong>Total projects</strong>
        <div style="font-size:32px;">{{ stats.total }}</div>
      </div>

      <div style="border:1px solid #ddd; border-radius:12px; padding:16px;">
        <strong>Active</strong>
        <div style="font-size:32px;">{{ stats.active }}</div>
      </div>

      <div style="border:1px solid #ddd; border-radius:12px; padding:16px;">
        <strong>Paused</strong>
        <div style="font-size:32px;">{{ stats.paused }}</div>
      </div>

      <div style="border:1px solid #ddd; border-radius:12px; padding:16px;">
        <strong>Completed</strong>
        <div style="font-size:32px;">{{ stats.completed }}</div>
      </div>
    </section>

    <p v-else style="opacity:.7;">No stats available.</p>
  </main>
</template>
