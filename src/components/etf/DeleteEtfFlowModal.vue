<template>
  <ModalVue :title="$t('ETF.title.delete')" ref="modalComponent">
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
                <th>{{ $t("ETF.etf") }}</th>
                <td>{{ etfName }}</td>
              </tr>
              <tr>
                <th>{{ $t("ETF.bookingdate") }}</th>
                <td>{{ timestampString }}</td>
              </tr>
              <tr>
                <th>{{ $t("ETF.amount") }}</th>
                <td>{{ amountString }}</td>
              </tr>
              <tr>
                <th>{{ $t("ETF.price") }}</th>
                <td><SpanAmount :amount="etfFlow.price" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-danger" @click="deleteEtfFlow">
        {{ $t("General.delete") }}
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import SpanAmount from "../SpanAmount.vue";

import { formatDateWithTime } from "@/tools/views/FormatDate";
import { formatNumber, redIfNegative } from "@/tools/views/FormatNumber";
import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { EtfFlow } from "@/model/etf/EtfFlow";

import EtfFlowControllerHandler from "@/handler/EtfControllerHandler";

const serverErrors = ref(new Array<string>());

const etfFlow = ref({} as EtfFlow);
const etfName = ref("");
const modalComponent = ref();
const emit = defineEmits(["etfFlowDeleted"]);

const amountClass = computed(() => {
  return redIfNegative(etfFlow.value.amount);
});
const amountString = computed(() => {
  return formatNumber(etfFlow.value.amount, 3);
});

const timestampString = computed(() => {
  return (
    formatDateWithTime(etfFlow.value.timestamp) +
    ":" +
    String(etfFlow.value.nanoseconds + 1000000000).substring(1, 4) //80000000 -> 1080000000 -> 080
  );
});

const _show = (_etfFlow: EtfFlow, _etfName: string) => {
  etfFlow.value = _etfFlow;
  etfName.value = _etfName;
  serverErrors.value = new Array<string>();
  modalComponent.value._show();
};
const deleteEtfFlow = () => {
  serverErrors.value = new Array<string>();

  EtfFlowControllerHandler.deleteEtfFlow(etfFlow.value.etfflowid)
    .then(() => {
      modalComponent.value._hide();
      emit("etfFlowDeleted", etfFlow.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
