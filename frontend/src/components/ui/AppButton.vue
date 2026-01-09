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

const base =
  "padding:8px 12px; border-radius:8px; cursor:pointer; background:transparent; border:1px solid #333;";

const variantStyle: Record<Variant, string> = {
  primary: "border:1px solid #333;",
  ghost: "border:1px solid #ccc; opacity:0.9;",
  danger: "border:1px solid #b00020; color:#b00020;",
};

const styleText = `${base} ${variantStyle[props.variant]}`;
</script>

<template>
  <button :type="type" :disabled="disabled" :style="styleText">
    <slot />
  </button>
</template>
