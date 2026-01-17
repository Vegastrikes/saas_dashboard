<script setup lang="ts">
    import { computed, useAttrs } from 'vue';
    type Orientation = "left" | "right";

    const props = withDefaults(
        defineProps<{
            orientation?: Orientation;
        }>(),
        {
            orientation: "left",
        }
    );

    const emit = defineEmits<{
        (e: "close"): void;
    }>();

    const attrs = useAttrs();
    const orientation = computed(() => props.orientation === "right" ? "right-0" : "left-0");
    const passedClass = computed(() => attrs.class);
</script>

<template>
    <div
        @click="emit('close')"
        class="fixed inset-0 bg-gray-200/50"
    ></div>
    <ul
        class="absolute mt-1 p-2 space-y-2 bg-white border border-slate-300 rounded-2xl max-w-2xs lg:max-w-xl"
        :class="[orientation, passedClass]"
    >
        <slot />
    </ul>
</template>
