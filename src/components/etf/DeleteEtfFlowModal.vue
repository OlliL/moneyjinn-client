<template>
  <ModalDelete
    :title="$t('ETFFlow.title.delete')"
    :server-errors="serverErrors"
    ref="modalComponent"
    @confirm="deleteEtfFlow"
  >
    <template #details>
      <ModalDeleteRow :label="$t('ETFFlow.bookingdate')" highlight-value>
        {{ timestampString }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.etf')">
        {{ etfName }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('ETFFlow.amount')">
        <span :class="amountClass">{{ amountString }}</span>
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('ETFFlow.price')">
        <SpanAmount :amount="etfFlow.price" />
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import type { EtfFlow } from "@/model/etf/EtfFlow";
import CrudEtfFlowService from "@/service/CrudEtfFlowService";
import { formatDateWithTime } from "@/tools/views/FormatDate";
import { formatNumber, redIfNegative } from "@/tools/views/FormatNumber";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { computed, ref, useTemplateRef } from "vue";
import ModalDelete from "../ModalDelete.vue";
import ModalDeleteRow from "../ModalDeleteRow.vue";
import SpanAmount from "../SpanAmount.vue";

const serverErrors = ref(new Array<string>());

const etfFlow = ref({} as EtfFlow);
const etfName = ref("");
const modalComponent = useTemplateRef<typeof ModalDelete>("modalComponent");
const emit = defineEmits(["etfFlowDeleted"]);

const amountClass = computed(() => {
  return redIfNegative(etfFlow.value.amount);
});
const amountString = computed(() => {
  return formatNumber(etfFlow.value.amount, 6);
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
  modalComponent.value?._show();
};
const deleteEtfFlow = () => {
  serverErrors.value = new Array<string>();

  CrudEtfFlowService.deleteEtfFlow(etfFlow.value.etfflowid)
    .then(() => {
      modalComponent.value?._hide();
      emit("etfFlowDeleted", etfFlow.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
