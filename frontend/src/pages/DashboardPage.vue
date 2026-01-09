<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getDashboardStats } from "../services/stats";
import type { DashboardStats } from "../types/stats";

import AppCard from "../components/ui/AppCard.vue";

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
  <main class="mx-auto max-w-5xl px-6 py-6">
    <h1 class="mb-4">Dashboard</h1>

    <p v-if="loading">Loading…</p>
    <p v-else-if="error" class="text-rose-500">{{ error }}</p>

    <section
      v-else-if="stats" class="grid grid-cols-4 gap-4"
    >
      <AppCard title="Total projects">
        <div class="text-3xl">{{ stats.total }}</div>
      </AppCard>

      <AppCard title="Active projects">
        <div class="text-3xl">{{ stats.active }}</div>
      </AppCard>
      
      <AppCard title="Paused projects">
        <div class="text-3xl">{{ stats.paused }}</div>
      </AppCard>

      <AppCard title="Completed projects">
        <div class="text-3xl">{{ stats.completed }}</div>
      </AppCard>
    </section>

    <p v-else>No stats available.</p>
  </main>
</template>
