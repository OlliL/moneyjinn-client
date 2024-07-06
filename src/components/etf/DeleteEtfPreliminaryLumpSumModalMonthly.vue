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
                <th>{{ $t("General.etf") }}</th>
                <td>{{ etfName }}</td>
              </tr>
              <tr>
                <th>{{ $t("General.year") }}</th>
                <td>{{ etfPreliminaryLumpSum.year }}</td>
              </tr>
              <tr v-for="month in dataArray" :key="month.month">
                <th>
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
import { ref } from "vue";

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
const modalComponent = ref();
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
  dataArray.value = new Array<RowData>();
  for (let i: number = 1; i <= 12; i++) {
    let amount: number | undefined = 0;
    switch (i) {
      case 1:
        amount = etfPreliminaryLumpSum.value.amountJanuary;
        break;
      case 2:
        amount = etfPreliminaryLumpSum.value.amountFebruary;
        break;
      case 3:
        amount = etfPreliminaryLumpSum.value.amountMarch;
        break;
      case 4:
        amount = etfPreliminaryLumpSum.value.amountApril;
        break;
      case 5:
        amount = etfPreliminaryLumpSum.value.amountMay;
        break;
      case 6:
        amount = etfPreliminaryLumpSum.value.amountJune;
        break;
      case 7:
        amount = etfPreliminaryLumpSum.value.amountJuly;
        break;
      case 8:
        amount = etfPreliminaryLumpSum.value.amountAugust;
        break;
      case 9:
        amount = etfPreliminaryLumpSum.value.amountSeptember;
        break;
      case 10:
        amount = etfPreliminaryLumpSum.value.amountOctober;
        break;
      case 11:
        amount = etfPreliminaryLumpSum.value.amountNovember;
        break;
      case 12:
        amount = etfPreliminaryLumpSum.value.amountDecember;
        break;
    }
    dataArray.value.push({ month: getMonthName(i), amount: amount });
    modalComponent.value._show();
  }
};
const deleteEtfPreliminaryLumpSum = () => {
  serverErrors.value = new Array<string>();

  CrudEtfPreliminaryLumpSumService.deleteEtfPreliminaryLumpSum(
    etfPreliminaryLumpSum.value.id,
  )
    .then(() => {
      modalComponent.value._hide();
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
}
</style>
