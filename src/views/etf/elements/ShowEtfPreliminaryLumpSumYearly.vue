<template>
  <div class="flex flex-col rounded-md border">
    <Table>
      <TableBody>
        <TableRow>
          <TableHead
            class="font-bold border-r text-foreground text-center w-40"
            >{{ $t("ETFPreliminaryLumpSum.yearlySum") }}</TableHead
          >
          <TableCell class="text-right"
            ><SpanAmount :amount="mep.amountDecember" :decimal-places="2"
          /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import SpanAmount from "@/components/SpanAmount.vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import { type PropType } from "vue";

const props = defineProps({
  mep: {
    type: Object as PropType<EtfPreliminaryLumpSum>,
    required: true,
  },
});
</script>
