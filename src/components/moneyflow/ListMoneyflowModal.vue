<script setup lang="ts">
import ListMoneyflowModalDesktop from "@/components/moneyflow/ListMoneyflowModalDesktop.vue";
import ListMoneyflowModalMobile from "@/components/moneyflow/ListMoneyflowModalMobile.vue";
import { isDesktop } from "@/tools/views/IsDesktop";

const desktop = isDesktop();
</script>

<template>
  <ListMoneyflowModalDesktop v-if="desktop" />
  <ListMoneyflowModalMobile v-else />
</template>

