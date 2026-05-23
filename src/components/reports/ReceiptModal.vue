<template>
  <ModalVue :title="$t('Receipt.receipt')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <SpanReceipt :receipt="receipt" />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import type { MoneyflowReceipt } from "@/model/moneyflow/MoneyflowReceipt";
import MoneyflowReceiptService from "@/service/MoneyflowReceiptService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { ref, useTemplateRef } from "vue";
import DivError from "../common/DivError.vue";
import ModalVue from "../common/Modal.vue";
import SpanReceipt from "../common/SpanReceipt.vue";

const serverErrors = ref(new Array<string>());

const receipt = ref({} as MoneyflowReceipt);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");

const _show = (moneyflowId: number) => {
  serverErrors.value = new Array<string>();

  MoneyflowReceiptService.fetchReceipt(moneyflowId)
    .then((response) => {
      receipt.value = response;
      modalComponent.value?._show();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
      modalComponent.value?._show();
    });
};
defineExpose({ _show });
</script>
