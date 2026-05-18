<template>
  <ModalVue :title="$t('Receipt.receipt')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <img
        v-if="isJpeg"
        :src="`data:image/png;base64,${receiptBase64}`"
        class="max-w-full max-h-full"
        alt="receipt"
      />
      <object
        class="h-[75vh] w-full"
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
import { MoneyflowReceiptType } from "@/model/moneyflow/MoneyflowReceiptType";
import MoneyflowReceiptService from "@/service/MoneyflowReceiptService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { ref, useTemplateRef } from "vue";
import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";

const serverErrors = ref(new Array<string>());

const receiptBase64 = ref("");
const isJpeg = ref(false);
const isPdf = ref(false);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");

const _show = (moneyflowId: number) => {
  serverErrors.value = new Array<string>();

  MoneyflowReceiptService.fetchReceipt(moneyflowId)
    .then((response) => {
      receiptBase64.value = response.receipt;
      isJpeg.value = response.receiptType === MoneyflowReceiptType.JPEG;
      isPdf.value = response.receiptType === MoneyflowReceiptType.PDF;

      modalComponent.value?._show();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
      modalComponent.value?._show();
    });
};
defineExpose({ _show });
</script>
