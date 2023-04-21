<template>
  <ModalVue :title="$t('ETF.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("ETF.etf") }}
        </div>
        <div class="text-start col-sm-9">{{ etfName }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("ETF.bookingdate") }}
        </div>
        <div class="text-start col-sm-9">{{ timestampString }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("ETF.amount") }}
        </div>
        <div class="col-sm-9 text-start">
          <span :class="amountClass">{{ amountString }}</span>
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("ETF.price") }}
        </div>
        <div class="col-sm-9 text-start">
          <SpanAmount :amount="etfFlow.price" />
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
