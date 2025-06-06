<template>
  <ModalVue :title="$t('Receipt.receipt')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <img
        v-if="isJpeg"
        :src="`data:image/png;base64,${receiptBase64}`"
        style="max-width: 100%; max-height: 100%"
        alt="receipt"
      />
      <object
        style="height: 75vh; width: 100%"
        v-if="isPdf"
        id="pdf"
        :data="`data:application/pdf;base64,${receiptBase64}`"
        type="application/pdf"
      >
        receipt
      </object>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from "vue";

import ModalVue from "../Modal.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import { MoneyflowReceiptType } from "@/model/moneyflow/MoneyflowReceiptType";

import MoneyflowReceiptService from "@/service/MoneyflowReceiptService";
import DivError from "../DivError.vue";

const serverErrors = ref(new Array<string>());

const receiptBase64 = ref("");
const isJpeg = ref(false);
const isPdf = ref(false);
const modalComponent = useTemplateRef<typeof ModalVue>('modalComponent');

const _show = (moneyflowId: number) => {
  serverErrors.value = new Array<string>();

  MoneyflowReceiptService.fetchReceipt(moneyflowId)
    .then((response) => {
      receiptBase64.value = response.receipt;

      if (response.receiptType === MoneyflowReceiptType.JPEG) {
        isJpeg.value = true;
      } else if (response.receiptType === MoneyflowReceiptType.PDF) {
        isJpeg.value = false;
      }
      isPdf.value = !isJpeg.value;

      modalComponent.value?._show();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
      modalComponent.value?._show();
    });
};
defineExpose({ _show });
</script>
