<script setup lang="ts">
type Variant = "primary" | "ghost" | "danger";

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
  }>(),
  {
    variant: "primary",
    type: "button",
    disabled: false,
  }
);

const variants: Record<Variant, string> = {
  primary:
    "cursor-pointer border border-slate-900 bg-slate-500 text-white hover:bg-blue-500 hover:border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-500",
  ghost:
    "cursor-pointer border border-slate-300 bg-white text-slate-900 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed",
  danger:
    "cursor-pointer border border-rose-600 bg-rose-100 text-slate-900 hover:bg-rose-500 hover:border-rose-500 disabled:opacity-50 disabled:cursor-not-allowed",
};
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    class="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition"
    :class="variants[props.variant]"
  >
    <slot />
  </button>
</template>
