<template>
  <ModalVue
    :title="$t('ETFPreliminaryLumpSum.title.delete')"
    ref="modalComponent"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="flex flex-col rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell class="font-bold bg-primary/10 w-40 whitespace-nowrap text-foreground border-r">{{ $t("General.etf") }}</TableCell>
              <TableCell>{{ etfName }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-bold bg-primary/10 w-40 whitespace-nowrap text-foreground border-r">{{ $t("General.year") }}</TableCell>
              <TableCell>{{ etfPreliminaryLumpSum.year }}</TableCell>
            </TableRow>
            <TableRow v-for="month in dataArray" :key="month.month">
              <TableCell class="font-bold bg-primary/10 w-40 whitespace-nowrap text-foreground border-r">
                {{
                  $t("ETFPreliminaryLumpSum.monthlyAmount", {
                    month: month.month,
                  })
                }}
              </TableCell>
              <TableCell><SpanAmount :amount="month.amount" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </template>
    <template #footer>
      <Button variant="destructive" class="flex items-center gap-2 rounded-md px-6" @click="deleteEtfPreliminaryLumpSum">
        <Trash2 class="h-4 w-4" />
        {{ $t("General.delete") }}
      </Button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { Trash2 } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import SpanAmount from "../SpanAmount.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";
import { getMonthName } from "@/tools/views/MonthName";

import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";

import CrudEtfPreliminaryLumpSumService from "@/service/CrudEtfPreliminaryLumpSumService";
import { useEtfStore } from "@/stores/EtfStore";

type RowData = {
  month: string;
  amount: number | undefined;
};

const serverErrors = ref(new Array<string>());

const etfPreliminaryLumpSum = ref({} as EtfPreliminaryLumpSum);
const etfName = computed(() => {
  return etfStore.getEtf(etfPreliminaryLumpSum.value.etfId)?.name ?? "";
});
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["etfPreliminaryLumpSumDeleted"]);
const dataArray = ref({} as Array<RowData>);
const etfStore = useEtfStore();

const _show = (_mep: EtfPreliminaryLumpSum) => {
  serverErrors.value = new Array<string>();

  etfPreliminaryLumpSum.value = _mep;
  const amounts = [
    etfPreliminaryLumpSum.value.amountJanuary,
    etfPreliminaryLumpSum.value.amountFebruary,
    etfPreliminaryLumpSum.value.amountMarch,
    etfPreliminaryLumpSum.value.amountApril,
    etfPreliminaryLumpSum.value.amountMay,
    etfPreliminaryLumpSum.value.amountJune,
    etfPreliminaryLumpSum.value.amountJuly,
    etfPreliminaryLumpSum.value.amountAugust,
    etfPreliminaryLumpSum.value.amountSeptember,
    etfPreliminaryLumpSum.value.amountOctober,
    etfPreliminaryLumpSum.value.amountNovember,
    etfPreliminaryLumpSum.value.amountDecember,
  ];
  dataArray.value = amounts.map((amount, i) => {
    return { month: getMonthName(i + 1), amount: amount } as RowData;
  });

  modalComponent.value?._show();
};

const deleteEtfPreliminaryLumpSum = () => {
  serverErrors.value = new Array<string>();

  CrudEtfPreliminaryLumpSumService.deleteEtfPreliminaryLumpSum(
    etfPreliminaryLumpSum.value.id,
  )
    .then(() => {
      modalComponent.value?._hide();
      emit("etfPreliminaryLumpSumDeleted", etfPreliminaryLumpSum.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>

