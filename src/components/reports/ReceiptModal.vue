<template>
  <ModalVue title="Beleg" ref="modalComponent">
    <template #body>
      <img
        v-if="isJpeg"
        :src="`data:image/png;base64,${receiptBase64}`"
        style="max-width: 100%; max-height: 100%"
      />
      <object
        style="height: 75vh; width: 100%"
        v-if="isPdf"
        id="pdf"
        :data="`data:application/pdf;base64,${receiptBase64}`"
        type="application/pdf"
      ></object>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import ModalVue from "../Modal.vue";

import { MoneyflowReceiptType } from "@/model/moneyflow/MoneyflowReceiptType";

import MoneyflowReceiptControllerHandler from "@/handler/MoneyflowReceiptControllerHandler";

const receiptBase64 = ref("");
const isJpeg = ref(false);
const isPdf = ref(false);
const modalComponent = ref();

const _show = (moneyflowId: number) => {
  MoneyflowReceiptControllerHandler.fetchReceipt(moneyflowId).then(
    (response) => {
      receiptBase64.value = response.receipt;

      if (response.receiptType === MoneyflowReceiptType.JPEG) {
        isJpeg.value = true;
      } else if (response.receiptType === MoneyflowReceiptType.PDF) {
        isJpeg.value = false;
      }
      isPdf.value = !isJpeg.value;

      modalComponent.value._show();
    }
  );
};
defineExpose({ _show });
</script>
