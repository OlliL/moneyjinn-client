<template>
  <ModalVue
    :title="$t('ETFPreliminaryLumpSum.title.delete')"
    ref="modalComponent"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row d-flex justify-content-center mt-3">
        <div class="col-11">
          <table class="table table-bordered table-hover">
            <tbody>
              <tr>
                <th scope="row">{{ $t("General.etf") }}</th>
                <td>{{ etfName }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("General.year") }}</th>
                <td>{{ etfPreliminaryLumpSum.year }}</td>
              </tr>
              <tr v-for="month in dataArray" :key="month.month">
                <th scope="row">
                  {{
                    $t("ETFPreliminaryLumpSum.monthlyAmount", {
                      month: month.month,
                    })
                  }}
                </th>
                <td>
                  <SpanAmount :amount="month.amount" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-danger"
        @click="deleteEtfPreliminaryLumpSum"
      >
        {{ $t("General.delete") }}
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from "vue";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import SpanAmount from "../SpanAmount.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";
import { getMonthName } from "@/tools/views/MonthName";

import type { Etf } from "@/model/etf/Etf";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";

import CrudEtfPreliminaryLumpSumService from "@/service/CrudEtfPreliminaryLumpSumService";

type RowData = {
  month: string;
  amount: number | undefined;
};

const serverErrors = ref(new Array<string>());

const etfPreliminaryLumpSum = ref({} as EtfPreliminaryLumpSum);
const etfName = ref("");
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["etfPreliminaryLumpSumDeleted"]);
const dataArray = ref({} as Array<RowData>);

const _show = (_etfs: Array<Etf>, _mep: EtfPreliminaryLumpSum) => {
  serverErrors.value = new Array<string>();
  for (let etf of _etfs) {
    if (etf.id == _mep.etfId) {
      etfName.value = etf.name;
      break;
    }
  }

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

<style scoped>
th {
  background-color: #f2f2f2;
  white-space: nowrap;
}
</style>
