<template>
  <tr>
    <td class="text-start">
      <a :href="etf.chartUrl">{{ etf.name }}</a>
    </td>
    <td class="text-start">{{ etf.isin }}</td>
    <td class="text-start">{{ etf.wkn }}</td>
    <td class="text-start">{{ etf.ticker }}</td>
    <td class="db text-end">
      <SpanAmount :amount="etf.transactionCostsAbsolute" />
    </td>
    <td class="db text-end">{{ relativeString }}</td>
    <td class="db text-end">
      <SpanAmount :amount="etf.transactionCostsMaximum" />
    </td>
    <td class="db text-end">{{ taxExemptionString }}</td>
    <td class="text-center" v-if="etf.isFavorite">
      <i class="bi bi-star-fill text-warning"></i>
    </td>
    <td class="text-start" v-if="!etf.isFavorite">&nbsp;</td>
    <td class="text-center">
      <span class="link-primary" @click="editEtf"
        ><i class="bi bi-pencil-square"></i
      ></span>
    </td>
    <td class="text-center">
      <span class="link-primary" @click="deleteEtf"
        ><i class="bi bi-trash"></i
      ></span>
    </td>
  </tr>
</template>
<script lang="ts" setup>
import { computed, type PropType } from "vue";

import type { Etf } from "@/model/etf/Etf";
import SpanAmount from "../SpanAmount.vue";
import { formatNumber } from "@/tools/views/FormatNumber";

const props = defineProps({
  etf: {
    type: Object as PropType<Etf>,
    required: true,
  },
});
const emit = defineEmits(["deleteEtf", "editEtf"]);

const relativeString = computed(() => {
  return props.etf.transactionCostsRelative !== undefined
    ? formatNumber(props.etf.transactionCostsRelative, 2) + " %"
    : "";
});

const taxExemptionString = computed(() => {
  return props.etf.partialTaxExemption !== undefined
    ? formatNumber(props.etf.partialTaxExemption, 2) + " %"
    : "";
});

const deleteEtf = () => {
  emit("deleteEtf", props.etf);
};
const editEtf = () => {
  emit("editEtf", props.etf);
};
</script>
