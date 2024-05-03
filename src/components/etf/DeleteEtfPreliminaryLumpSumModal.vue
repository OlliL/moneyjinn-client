<template>
  <ModalVue :title="$t('ETFFlow.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row d-flex justify-content-center mt-3">
        <div class="col-11">
          <table class="table table-bordered table-hover">
            <colgroup>
              <col span="1" style="background-color: #f2f2f2" width="35%" />
            </colgroup>
            <tbody>
              <tr>
                <th>{{ $t("General.etf") }}</th>
                <td>{{ etfName }}</td>
              </tr>
              <tr>
                <th>{{ $t("ETFFlow.bookingdate") }}</th>
                <td>{{ etfPreliminaryLumpSum.year }}</td>
              </tr>
              <tr>
                <th>{{ $t("ETFFlow.price") }}</th>
                <td>
                  <SpanAmount :amount="etfPreliminaryLumpSum.amountJanuary" />
                </td>
              </tr>
              <tr>
                <th>{{ $t("ETFFlow.price") }}</th>
                <td>
                  <SpanAmount :amount="etfPreliminaryLumpSum.amountMarch" />
                </td>
              </tr>
              <tr>
                <th>{{ $t("ETFFlow.price") }}</th>
                <td>
                  <SpanAmount :amount="etfPreliminaryLumpSum.amountApril" />
                </td>
              </tr>
              <tr>
                <th>{{ $t("ETFFlow.price") }}</th>
                <td>
                  <SpanAmount :amount="etfPreliminaryLumpSum.amountMay" />
                </td>
              </tr>
              <tr>
                <th>{{ $t("ETFFlow.price") }}</th>
                <td>
                  <SpanAmount :amount="etfPreliminaryLumpSum.amountJune" />
                </td>
              </tr>
              <tr>
                <th>{{ $t("ETFFlow.price") }}</th>
                <td>
                  <SpanAmount :amount="etfPreliminaryLumpSum.amountJuly" />
                </td>
              </tr>
              <tr>
                <th>{{ $t("ETFFlow.price") }}</th>
                <td>
                  <SpanAmount :amount="etfPreliminaryLumpSum.amountAugust" />
                </td>
              </tr>
              <tr>
                <th>{{ $t("ETFFlow.price") }}</th>
                <td>
                  <SpanAmount :amount="etfPreliminaryLumpSum.amountSeptember" />
                </td>
              </tr>
              <tr>
                <th>{{ $t("ETFFlow.price") }}</th>
                <td>
                  <SpanAmount :amount="etfPreliminaryLumpSum.amountOctober" />
                </td>
              </tr>
              <tr>
                <th>{{ $t("ETFFlow.price") }}</th>
                <td>
                  <SpanAmount :amount="etfPreliminaryLumpSum.amountNovember" />
                </td>
              </tr>
              <tr>
                <th>{{ $t("ETFFlow.price") }}</th>
                <td>
                  <SpanAmount :amount="etfPreliminaryLumpSum.amountDecember" />
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

import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";

import CrudEtfPreliminaryLumpSumControllerHandler from "@/handler/CrudEtfPreliminaryLumpSumControllerHandler";
import type { Etf } from "@/model/etf/Etf";

const serverErrors = ref(new Array<string>());

const etfPreliminaryLumpSum = ref({} as EtfPreliminaryLumpSum);
const etfName = ref("");
const modalComponent = ref();
const emit = defineEmits(["etfPreliminaryLumpSumDeleted"]);

const _show = (_etfs: Array<Etf>, _etfId: number, _year: number) => {
  serverErrors.value = new Array<string>();
  for (let etf of _etfs) {
    if (etf.id == _etfId) {
      etfName.value = etf.name;
      break;
    }
  }

  CrudEtfPreliminaryLumpSumControllerHandler.fetchEtfPreliminaryLumpSum(
    _etfId,
    _year,
  )
    .then((response) => {
      etfPreliminaryLumpSum.value = response;
      modalComponent.value._show();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
const deleteEtfPreliminaryLumpSum = () => {
  serverErrors.value = new Array<string>();

  CrudEtfPreliminaryLumpSumControllerHandler.deleteEtfPreliminaryLumpSum(
    etfPreliminaryLumpSum.value.etfId,
    etfPreliminaryLumpSum.value.year,
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
