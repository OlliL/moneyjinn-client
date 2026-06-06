<template>
  <ModalDelete
    :title="$t('ETFPreliminaryLumpSum.title.delete')"
    id-suffix="DeleteEtfPreliminaryLumpSumMonthly"
    v-model:open="open"
    :delete-action="
      () =>
        CrudEtfPreliminaryLumpSumService.deleteEtfPreliminaryLumpSum(lumpSum.id)
    "
    :delete-success-action="() => onDone?.(lumpSum)"
  >
    <template #body>
      <div class="space-y-4">
        <div
          class="icon-mediumflex flex-col rounded-xl border bg-card overflow-hidden"
        >
          <Table>
            <TableBody>
              <ModalDeleteRow :label="$t('General.etf')">
                {{ etfName }}
              </ModalDeleteRow>

              <ModalDeleteRow :label="$t('General.year')" highlight-value>
                {{ lumpSum.year }}
              </ModalDeleteRow>
            </TableBody>
          </Table>
        </div>

        <div class="p-4 rounded-xl border bg-card">
          <div
            class="flex items-center space-x-2 border-b border-border/40 pb-2"
          >
            <span class="form-section-title">
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
  </ModalDelete>
</template>

<script lang="ts" setup>
import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import SpanAmount from "@/components/common/SpanAmount.vue";
import { Table, TableBody } from "@/components/ui/table";
import CrudEtfPreliminaryLumpSumService from "@/service/CrudEtfPreliminaryLumpSumService";
import { useEtfStore } from "@/stores/EtfStore";
import { getMonthName } from "@/tools/views/MonthName";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import useDeleteEtfPreliminaryLumpSumModalMonthlyStore from "./DeleteEtfPreliminaryLumpSumModalMonthly.store";

type RowData = {
  month: string;
  amount: number | undefined;
};

const { getEtf } = useEtfStore();
const dataArray = ref([] as Array<RowData>);
const etfName = computed(() => getEtf(lumpSum.value.etfId)?.name ?? "");

const {
  open,
  entity: lumpSum,
  onDone,
} = storeToRefs(useDeleteEtfPreliminaryLumpSumModalMonthlyStore());

watch(open, (newVal) => {
  if (newVal) {
    const amounts = [
      lumpSum.value.amountJanuary,
      lumpSum.value.amountFebruary,
      lumpSum.value.amountMarch,
      lumpSum.value.amountApril,
      lumpSum.value.amountMay,
      lumpSum.value.amountJune,
      lumpSum.value.amountJuly,
      lumpSum.value.amountAugust,
      lumpSum.value.amountSeptember,
      lumpSum.value.amountOctober,
      lumpSum.value.amountNovember,
      lumpSum.value.amountDecember,
    ];
    dataArray.value = amounts.map(
      (amount, i) =>
        ({ month: getMonthName(i + 1), amount: amount }) as RowData,
    );
  }
});
</script>
