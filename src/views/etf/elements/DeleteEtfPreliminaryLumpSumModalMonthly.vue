<template>
  <ModalDelete
    :title="$t('ETFPreliminaryLumpSum.title.delete')"
    :server-errors="serverErrors"
    ref="modalComponent"
    @confirm="deleteEtfPreliminaryLumpSum"
  >
    <template #body>
      <div class="space-y-4">
        <div class="modal-detail-card">
          <Table>
            <TableBody>
              <ModalDeleteRow :label="$t('General.etf')">
                {{ etfName }}
              </ModalDeleteRow>

              <ModalDeleteRow :label="$t('General.year')" highlight-value>
                {{ etfPreliminaryLumpSum.year }}
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
import ModalDelete from "@/components/ModalDelete.vue";
import ModalDeleteRow from "@/components/ModalDeleteRow.vue";
import SpanAmount from "@/components/SpanAmount.vue";
import { Table, TableBody } from "@/components/ui/table";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import CrudEtfPreliminaryLumpSumService from "@/service/CrudEtfPreliminaryLumpSumService";
import { useEtfStore } from "@/stores/EtfStore";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { getMonthName } from "@/tools/views/MonthName";
import { computed, ref, useTemplateRef } from "vue";

type RowData = {
  month: string;
  amount: number | undefined;
};

const serverErrors = ref(new Array<string>());

const etfPreliminaryLumpSum = ref({} as EtfPreliminaryLumpSum);
const etfName = computed(() => {
  return etfStore.getEtf(etfPreliminaryLumpSum.value.etfId)?.name ?? "";
});
const modalComponent = useTemplateRef<typeof ModalDelete>("modalComponent");
const emit = defineEmits(["etfPreliminaryLumpSumDeleted"]);
const dataArray = ref([] as Array<RowData>);
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
