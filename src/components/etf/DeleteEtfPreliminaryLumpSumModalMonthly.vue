<template>
  <ModalVue
    :title="$t('ETFPreliminaryLumpSum.title.delete')"
    ref="modalComponent"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />

      <div class="space-y-4">
        <div class="flex flex-col rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableBody>
              <TableRow class="hover:bg-transparent border-b last:border-0">
                <TableCell
                  class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
                >
                  {{ $t("General.etf") }}
                </TableCell>
                <TableCell class="font-medium text-foreground pr-4 py-3">
                  {{ etfName }}
                </TableCell>
              </TableRow>

              <TableRow class="hover:bg-transparent border-b last:border-0">
                <TableCell
                  class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
                >
                  {{ $t("General.year") }}
                </TableCell>
                <TableCell
                  class="font-semibold text-foreground pr-4 py-3 text-base"
                >
                  {{ etfPreliminaryLumpSum.year }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div class="p-4 rounded-xl border bg-card">
          <div
            class="flex items-center space-x-2 border-b border-border/40 pb-2"
          >
            <span
              class="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-0"
            >
              {{ $t("ETFPreliminaryLumpSum.amounts") }}
            </span>
          </div>
          <div class="grid grid-cols-4 gap-x-4 gap-y-3 text-sm">
            <div
              v-for="month in dataArray"
              :key="month.month"
              class="flex flex-col space-y-1 p-2 rounded-lg bg-muted/30 border border-border/40"
            >
              <span
                class="text-xs font-normal text-muted-foreground block truncate text-center"
              >
                {{ month.month }}
              </span>
              <span class="font-medium text-foreground block text-end">
                <SpanAmount :amount="month.amount" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <Button
        variant="destructive"
        class="flex items-center gap-2 rounded-md px-6"
        @click="deleteEtfPreliminaryLumpSum"
      >
        <Trash2 class="h-4 w-4" />
        {{ $t("General.delete") }}
      </Button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import CrudEtfPreliminaryLumpSumService from "@/service/CrudEtfPreliminaryLumpSumService";
import { useEtfStore } from "@/stores/EtfStore";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { getMonthName } from "@/tools/views/MonthName";
import { Trash2 } from "lucide-vue-next";
import { computed, ref, useTemplateRef } from "vue";
import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import SpanAmount from "../SpanAmount.vue";

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
