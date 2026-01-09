<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: "" });
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <header v-if="title" class="mb-3">
      <h2 class="text-sm font-semibold text-slate-900">
        {{ title }}
      </h2>
    </header>
    <slot />
  </section>
</template>
