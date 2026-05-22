<template>
  <div v-if="etfSummary">
    <EtfTableContainer :etf-summary-array="[etfSummary]" />
  </div>
</template>
<script lang="ts" setup>
import type { EtfSummary } from "@/model/etf/EtfSummary";
import type { PropType } from "vue";
import EtfTableContainer from "./EtfTableContainer.vue";

defineProps({
  etfSummary: {
    type: Object as PropType<EtfSummary>,
    required: false,
  },
});
</script>
