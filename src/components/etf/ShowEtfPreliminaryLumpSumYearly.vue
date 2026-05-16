<template>
  <div class="flex flex-col rounded-md border">
    <Table>
      <TableBody>
        <TableRow>
          <TableCell class="font-bold bg-primary/10 w-40 whitespace-normal text-foreground border-r">{{ $t("ETFPreliminaryLumpSum.yearlySum") }}</TableCell>
          <TableCell class="text-right"><SpanAmount :amount="mep.amountDecember" :decimal-places="2" /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from "vue";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import SpanAmount from "../SpanAmount.vue";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";

const props = defineProps({
  mep: {
    type: Object as PropType<EtfPreliminaryLumpSum>,
    required: true,
  },
});
</script>
