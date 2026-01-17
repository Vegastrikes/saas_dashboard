<script setup lang="ts">
    type Orientation = "left" | "right";

    const props = withDefaults(
        defineProps<{
            orientation?: Orientation;
        }>(),
        {
            orientation: "left",
        }
    );

    const orientation = props.orientation === "right" ? "right-0" : "left-0";
    const classes = [orientation].join("");
</script>

<template>
    <ul
        class="absolute mt-1 p-2 space-y-2 bg-white border border-slate-300 rounded-2xl max-w-2xs lg:max-w-xl"
        :class="classes"
    >
        <slot />
    </ul>
</template>
