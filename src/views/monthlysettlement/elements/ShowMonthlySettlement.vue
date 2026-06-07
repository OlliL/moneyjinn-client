<template>
  <div class="flex justify-center">
    <div class="w-full max-w-md">
      <div class="px-14 md:px-0">
        <div
          class="rounded-md border mb-4"
          v-if="monthlySettlementsNoCredit.length"
        >
          <Table class="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead class="table-head-cell w-2/3">
                  {{ $t("General.capitalsource") }}
                </TableHead>
                <TableHead
                  class="table-head-cell w-1/3 whitespace-nowrap text-right"
                >
                  {{ $t("General.amount") }}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="mms in monthlySettlementsNoCredit" :key="mms.id">
                <TableCell
                  class="border-r text-left truncate"
                  :title="mms.capitalsourceComment"
                >
                  {{ mms.capitalsourceComment }}
                </TableCell>
                <TableCell class="text-right whitespace-nowrap">
                  <SpanAmount :amount="mms.amount" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell class="text-right border-r font-bold"
                  >&sum;</TableCell
                >
                <TableCell class="text-right whitespace-nowrap underline">
                  <SpanAmount :amount="monthlySettlementNoCreditSum" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div class="rounded-md border" v-if="monthlySettlementsCredit.length">
          <Table class="table-fixed w-full">
            <TableHeader v-if="monthlySettlementsNoCredit.length">
              <TableRow>
                <TableHead class="table-head-cell w-2/3">
                  {{ $t("General.capitalsource") }}
                </TableHead>
                <TableHead
                  class="table-head-cell w-1/3 whitespace-nowrap text-right"
                >
                  {{ $t("General.amount") }}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="mms in monthlySettlementsCredit" :key="mms.id">
                <TableCell
                  class="border-r text-left truncate"
                  :title="mms.capitalsourceComment"
                >
                  {{ mms.capitalsourceComment }}
                </TableCell>
                <TableCell class="text-right whitespace-nowrap">
                  <SpanAmount :amount="mms.amount" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell class="text-right border-r font-bold"
                  >&sum;</TableCell
                >
                <TableCell class="text-right whitespace-nowrap underline">
                  <SpanAmount :amount="monthlySettlementCreditSum" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SpanAmount from "@/components/common/SpanAmount.vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";
import { computed } from "vue";

const props = defineProps<{
  monthlySettlements: Array<MonthlySettlement>;
}>();

const monthlySettlementsNoCredit = computed(() =>
  props.monthlySettlements.filter(
    (mms) => mms.capitalsourceType !== CapitalsourceType.CREDIT,
  ),
);
const monthlySettlementsCredit = computed(() =>
  props.monthlySettlements.filter(
    (mms) => mms.capitalsourceType === CapitalsourceType.CREDIT,
  ),
);

const monthlySettlementNoCreditSum = computed(() =>
  monthlySettlementsNoCredit.value.reduce((sum, mms) => sum + mms.amount, 0),
);
const monthlySettlementCreditSum = computed(() =>
  monthlySettlementsCredit.value.reduce((sum, mms) => sum + mms.amount, 0),
);
</script>
