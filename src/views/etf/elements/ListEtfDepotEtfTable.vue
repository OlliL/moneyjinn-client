<template>
  <div v-if="etfSummary">
    <EtfTable :etf-summary-array="[etfSummary]" />
  </div>
</template>
<script lang="ts" setup>
import EtfTable from "@/components/etf/EtfTable.vue";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import type { PropType } from "vue";

defineProps({
  etfSummary: {
    type: Object as PropType<EtfSummary>,
    required: false,
  },
});
</script>
