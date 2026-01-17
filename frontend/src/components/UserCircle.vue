<script setup lang="ts">
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import { useAuthStore } from "../stores/auth";
    
    import AppButton from "./ui/AppButton.vue";
    import AppDropdown from "./ui/AppDropdown.vue";
    import AppDropdownItem from "./ui/AppDropdownItem.vue";
    
    const router = useRouter();
    const auth = useAuthStore();

    const src = new URL("../assets/default_user.png", import.meta.url).href as string;

    const dropdownOn = ref(false);

    function dropdown() {
        dropdownOn.value = !dropdownOn.value;
    }

    async function logout() {
        await auth.logout();
        await router.replace("/login");
    }
</script>

<template>
    <div class="relative">
        <AppButton variant="ghost" class="p-1.5! rounded-xl!" @click="dropdown">
            <img :src="src" class="h-6 w-6 object-cover"/>
        </AppButton>
        <AppDropdown v-if="dropdownOn" orientation="right" class="min-w-40">
            <AppDropdownItem class="truncate bg-slate-200 rounded-2xl">{{ auth.user?.email }}</AppDropdownItem>
            <div class="flex justify-end">
                <AppButton variant="ghost" @click="logout">Logout</AppButton>
            </div>
        </AppDropdown>
    </div>

</template>