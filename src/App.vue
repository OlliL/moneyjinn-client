<script lang="ts" setup>
import GlobalModals from "@/components/common/GlobalModals.vue";
import { Toaster } from "@/components/ui/sonner";
import { isDesktop } from "@/tools/views/IsDesktop";
import { computed } from "vue";
import { RouterView } from "vue-router";

const position = computed(() =>
  isDesktop().value ? "top-center" : "bottom-center",
);
</script>

<template>
  <router-view />
  <GlobalModals />
  <Toaster :position="position" rich-colors close-button />
</template>

<style>
.toast-close-button:hover {
  background-color: var(--secondary) !important;
}
</style>
