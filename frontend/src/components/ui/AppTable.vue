<script setup lang="ts">
const wrapStyle = "border:1px solid #ddd; border-radius:12px; overflow:hidden;";
const tableStyle = "width:100%; border-collapse:collapse;";
</script>

<template>
  <section :style="wrapStyle">
    <slot name="top" />
    <table :style="tableStyle">
      <slot />
    </table>
  </section>
</template>
