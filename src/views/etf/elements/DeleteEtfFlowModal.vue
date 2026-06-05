<template>
  <ModalDelete
    :title="$t('ETFFlow.title.delete')"
    id-suffix="DeleteEtfFlow"
    v-model:server-errors="serverErrors"
    v-model:open="open"
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
        <SpanAmount :amount="flow.price" />
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import SpanAmount from "@/components/common/SpanAmount.vue";
import CrudEtfFlowService from "@/service/CrudEtfFlowService";
import { formatDateWithTime } from "@/tools/views/FormatDate";
import { formatNumber, redIfNegative } from "@/tools/views/FormatNumber";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import useDeleteEtfFlowModalStore from "./DeleteEtfFlowModal.store";

const { open, flow, etfName, onDone } = storeToRefs(
  useDeleteEtfFlowModalStore(),
);

const serverErrors = ref(new Array<string>());

const amountClass = computed(() => {
  return redIfNegative(flow.value.amount);
});
const amountString = computed(() => {
  return formatNumber(flow.value.amount, 6);
});

const timestampString = computed(() => {
  return (
    formatDateWithTime(flow.value.timestamp) +
    ":" +
    String(flow.value.nanoseconds + 1000000000).substring(1, 4) //80000000 -> 1080000000 -> 080
  );
});

const deleteEtfFlow = () => {
  CrudEtfFlowService.deleteEtfFlow(flow.value.etfflowid)
    .then(() => {
      open.value = false;
      onDone.value?.(flow.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
