<template>
  <TableRow>
    <TableCell class="text-left"
      ><a :href="etf.chartUrl">{{ etf.name }}</a></TableCell
    >
    <TableCell class="text-left">{{ etf.isin }}</TableCell>
    <TableCell class="text-left">{{ etf.wkn }}</TableCell>
    <TableCell class="text-left">{{ etf.ticker }}</TableCell>
    <TableCell class="text-right"
      ><SpanAmount :amount="etf.transactionCostsAbsolute"
    /></TableCell>
    <TableCell class="text-right">{{ relativeString }}</TableCell>
    <TableCell class="text-right"
      ><SpanAmount :amount="etf.transactionCostsMaximum"
    /></TableCell>
    <TableCell class="text-right">{{ taxExemptionString }}</TableCell>
    <TableCell class="text-center" v-if="etf.isFavorite">
      <Star class="h-5 w-5 transition-all fill-primary text-primary"
    /></TableCell>
    <TableCell class="text-start" v-if="!etf.isFavorite"></TableCell>
    <TableCell class="w-0 border whitespace-nowrap text-center p-0">
      <Button
        variant="ghost"
        size="icon"
        @click="editEtf"
        :title="$t('General.edit')"
        class="h-8 w-8 cursor-pointer"
      >
        <Pencil class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell class="w-0 border whitespace-nowrap text-center p-0">
      <Button
        variant="ghost"
        size="icon"
        @click="deleteEtf"
        :title="$t('General.delete')"
        class="h-8 w-8 cursor-pointer"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </TableCell>
  </TableRow>
</template>
<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { Pencil, Star, Trash2 } from "lucide-vue-next";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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
  if (props.etf.transactionCostsRelative === undefined) {
    return "";
  }
  return formatNumber(props.etf.transactionCostsRelative, 2) + " %";
});

const taxExemptionString = computed(() => {
  if (props.etf.partialTaxExemption === undefined) {
    return "";
  }
  return formatNumber(props.etf.partialTaxExemption, 2) + " %";
});

const deleteEtf = () => {
  emit("deleteEtf", props.etf);
};
const editEtf = () => {
  emit("editEtf", props.etf);
};
</script>
