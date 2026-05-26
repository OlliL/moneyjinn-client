<template>
  <ModalVue
    :title="$t('Receipt.receipt')"
    max-width="max-w-md"
    ref="modalComponent"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="w-full md:max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
        <SpanReceipt :receipt="receipt" />
      </div>
    </template>
    <template #footer>
      <ButtonDeleteTwoTap
        v-if="receipt.moneyflowId"
        :button-label="$t('Moneyflow.deleteReceipt')"
        @execute-delete="deleteMoneyflowReceipt"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import type { MoneyflowReceipt } from "@/model/moneyflow/MoneyflowReceipt";
import { mapImportedMoneyflowReceiptToMoneyflowReceipt } from "@/service/mapper/ImportedToMoneyflowReceiptMapper";
import MoneyflowReceiptService from "@/service/MoneyflowReceiptService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { ref, useTemplateRef } from "vue";
import ButtonDeleteTwoTap from "../common/ButtonDeleteTwoTap.vue";
import DivError from "../common/DivError.vue";
import ModalVue from "../common/Modal.vue";
import SpanReceipt from "../common/SpanReceipt.vue";

const serverErrors = ref(new Array<string>());

const receipt = ref({} as MoneyflowReceipt);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");

const _show = (
  moneyflowId: number,
  importedReceipt?: ImportedMoneyflowReceipt,
) => {
  serverErrors.value = new Array<string>();

  MoneyflowReceiptService.fetchReceipt(moneyflowId)
    .then((response) => {
      if (response.receiptType !== undefined) receipt.value = response;
      else if (importedReceipt)
        receipt.value =
          mapImportedMoneyflowReceiptToMoneyflowReceipt(importedReceipt);
      modalComponent.value?._show();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
      modalComponent.value?._show();
    });
};
defineExpose({ _show });

const deleteMoneyflowReceipt = () => {
  MoneyflowReceiptService.deleteMoneyflowReceipt(receipt.value.moneyflowId)
    .then(() => {
      modalComponent.value?._hide();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
