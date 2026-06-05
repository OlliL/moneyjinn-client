<template>
  <TableRow :data-testid="`etf-row-${etf.id}`">
    <TableCell class="border-r text-left"
      ><a :href="etf.chartUrl">{{ etf.name }}</a></TableCell
    >
    <TableCell class="border-r text-left">{{ etf.isin }}</TableCell>
    <TableCell class="border-r text-left">{{ etf.wkn }}</TableCell>
    <TableCell class="border-r text-left">{{ etf.ticker }}</TableCell>
    <TableCell class="border-r text-right"
      ><SpanAmount :amount="etf.transactionCostsAbsolute"
    /></TableCell>
    <TableCell class="border-r text-right">{{ relativeString }}</TableCell>
    <TableCell class="border-r text-right"
      ><SpanAmount :amount="etf.transactionCostsMaximum"
    /></TableCell>
    <TableCell class="border-r text-right">{{ taxExemptionString }}</TableCell>
    <TableCell class="border-r text-center" v-if="etf.isFavorite">
      <Star class="h-5 w-5 transition-all fill-primary text-primary"
    /></TableCell>
    <TableCell class="border-r text-start" v-if="!etf.isFavorite"></TableCell>
    <ButtonTableIcon
      :title="$t('General.edit')"
      :test-id="`etf-edit-${etf.id}`"
      @click="actions.edit(etf)"
    >
      <Pencil class="icon-medium" />
    </ButtonTableIcon>
    <ButtonTableIcon
      :title="$t('General.delete')"
      :test-id="`etf-delete-${etf.id}`"
      @click="actions.delete(etf)"
    >
      <Trash2 class="icon-medium" />
    </ButtonTableIcon>
  </TableRow>
</template>
<script lang="ts" setup>
import ButtonTableIcon from "@/components/common/ButtonTableIcon.vue";
import SpanAmount from "@/components/common/SpanAmount.vue";
import { TableCell, TableRow } from "@/components/ui/table";
import { EtfActionsKey } from "@/model/CrudActions";
import type { Etf } from "@/model/etf/Etf";
import { formatNumber } from "@/tools/views/FormatNumber";
import { Pencil, Star, Trash2 } from "lucide-vue-next";
import { computed, inject } from "vue";

const props = defineProps<{
  etf: Etf;
}>();

const actions = inject(EtfActionsKey)!;

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
</script>
