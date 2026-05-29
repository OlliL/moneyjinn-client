<script lang="ts" setup>
import { RouterView } from "vue-router";
import { Toaster } from "vue-sonner";
</script>

<template>
  <router-view />
  <Toaster position="bottom-center" rich-colors />
</template>

<style>
ul.month-selection {
  margin: 0 !important;
}
span.link-primary:hover {
  cursor: pointer;
}
</style>
