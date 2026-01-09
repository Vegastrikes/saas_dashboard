<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  autocomplete?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const baseStyle =
  "padding:10px; border:1px solid #ccc; border-radius:8px; outline:none;";

function onInput(e: Event) {
  const el = e.target as HTMLInputElement | null;
  emit("update:modelValue", el?.value ?? "");
}
</script>

<template>
  <input
    :value="props.modelValue"
    @input="onInput"
    :type="props.type ?? 'text'"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :autocomplete="props.autocomplete"
    :style="baseStyle"
  />
</template>
