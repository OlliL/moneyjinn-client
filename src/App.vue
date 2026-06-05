<script lang="ts" setup>
import GlobalModals from "@/components/common/GlobalModals.vue";
import { Toaster } from "@/components/ui/sonner";
import { RouterView } from "vue-router";
</script>

<template>
  <router-view />
  <GlobalModals />
  <Toaster position="top-center" rich-colors close-button />
</template>

<style>
ul.month-selection {
  margin: 0 !important;
}
span.link-primary:hover {
  cursor: pointer;
}
</style>
