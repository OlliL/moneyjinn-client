<script lang="ts" setup>
import GlobalModals from "@/components/common/GlobalModals.vue";
import { Toaster } from "@/components/ui/sonner";
import { RouterView } from "vue-router";
</script>

<template>
  <router-view />
  <GlobalModals />
  <Toaster
    position="top-center"
    rich-colors
    close-button
    :toastOptions="{
      classes: {
        toast:
          'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:pointer-events-auto',
        closeButton: 'toast-close-button',
      },
    }"
  />
</template>

<style>
.toast-close-button:hover {
  background-color: var(--secondary) !important;
}
</style>
