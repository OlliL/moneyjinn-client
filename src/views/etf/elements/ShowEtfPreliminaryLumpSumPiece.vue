<template>
  <div class="flex flex-col rounded-md border">
    <Table>
      <TableBody>
        <TableRow>
          <TableHead class="table-head-cell w-40 border-b-0">{{
            $t("ETFPreliminaryLumpSum.price")
          }}</TableHead>
          <TableCell class="text-right"
            ><SpanAmount :amount="mep.amountPerPiece" :decimal-places="8"
          /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import SpanAmount from "@/components/common/SpanAmount.vue";
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
