<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
  }>(),
  { title: "" }
);

const cardStyle = "border:1px solid #ddd; border-radius:12px; padding:16px;";
</script>

<template>
  <section :style="cardStyle">
    <header v-if="title" style="margin-bottom: 12px;">
      <h2 style="margin:0; font-size: 16px;">{{ title }}</h2>
    </header>
    <slot />
  </section>
</template>
