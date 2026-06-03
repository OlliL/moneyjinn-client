<template>
  <EtfTable :etf-summary-array="[etfSummary]" />
</template>
<script lang="ts" setup>
import EtfTable from "@/components/etf/EtfTable.vue";
import type { EtfSummary } from "@/model/etf/EtfSummary";

defineProps<{
  etfSummary: EtfSummary;
}>();
</script>
