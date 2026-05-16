<template>
  <div class="flex flex-col rounded-md border">
    <Table>
      <TableBody>
        <TableRow>
          <TableHead
            class="font-bold border-r text-foreground text-center w-40"
            >{{ $t("ETFPreliminaryLumpSum.price") }}</TableHead
          >
          <TableCell class="text-right"
            ><SpanAmount :amount="mep.amountPerPiece" :decimal-places="8"
          /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from "vue";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@/components/ui/table";

import SpanAmount from "../SpanAmount.vue";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";

const props = defineProps({
  mep: {
    type: Object as PropType<EtfPreliminaryLumpSum>,
    required: true,
  },
});
</script>
