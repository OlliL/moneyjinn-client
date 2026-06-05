<template>
  <ModalVue
    :title="$t('Receipt.receipt')"
    max-width="max-w-md"
    id-suffix="Receipt"
    v-model:open="open"
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
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import ButtonDeleteTwoTap from "../common/ButtonDeleteTwoTap.vue";
import DivError from "../common/DivError.vue";
import ModalVue from "../common/Modal.vue";
import SpanReceipt from "../common/SpanReceipt.vue";
import useReceiptModalStore from "./ReceiptModal.store";

const serverErrors = ref(new Array<string>());
const { close } = useReceiptModalStore();
const { open, moneyflowId, importedReceipt } = storeToRefs(
  useReceiptModalStore(),
);

const receipt = ref({} as MoneyflowReceipt);

watch(
  () => open.value,
  (visible) => {
    if (visible && moneyflowId.value !== undefined) {
      const targetMoneyflowId = moneyflowId.value as number;
      const targetImportedReceipt = importedReceipt.value as
        | ImportedMoneyflowReceipt
        | undefined;
      serverErrors.value = new Array<string>();

      MoneyflowReceiptService.fetchReceipt(targetMoneyflowId)
        .then((response) => {
          if (response.receiptType !== undefined) receipt.value = response;
          else if (targetImportedReceipt)
            receipt.value = mapImportedMoneyflowReceiptToMoneyflowReceipt(
              targetImportedReceipt,
            );
        })
        .catch((backendError) => {
          handleBackendError(backendError, serverErrors);
        });
    }
  },
);

const deleteMoneyflowReceipt = () => {
  MoneyflowReceiptService.deleteMoneyflowReceipt(receipt.value.moneyflowId)
    .then(() => {
      close();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
