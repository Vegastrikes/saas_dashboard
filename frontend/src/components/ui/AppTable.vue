<script setup lang="ts"></script>

<template>
  <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <slot name="top" />
    <div class="overflow-x-auto">
      <table class="table-fixed w-full border-collapse text-sm">
        <slot />
      </table>
    </div>
  </section>
</template>
