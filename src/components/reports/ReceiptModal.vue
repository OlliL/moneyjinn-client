<template>
  <ModalVue
    :title="$t('Receipt.receipt')"
    max-width="md:max-w-md w-full"
    id-suffix="Receipt"
    v-model:open="open"
    z-index="2500"
  >
    <template #body>
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
import type { MoneyflowReceipt } from "@/model/moneyflow/MoneyflowReceipt";
import { mapImportedMoneyflowReceiptToMoneyflowReceipt } from "@/service/mapper/ImportedToMoneyflowReceiptMapper";
import MoneyflowReceiptService from "@/service/MoneyflowReceiptService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import ButtonDeleteTwoTap from "../common/ButtonDeleteTwoTap.vue";
import ModalVue from "../common/Modal.vue";
import SpanReceipt from "../common/SpanReceipt.vue";
import useReceiptModalStore from "./ReceiptModal.store";

const { close } = useReceiptModalStore();
const { open, moneyflowId, importedReceipt } = storeToRefs(
  useReceiptModalStore(),
);

const receipt = ref({} as MoneyflowReceipt);

watch(
  () => open.value,
  (visible) => {
    if (visible && moneyflowId.value !== undefined) {
      MoneyflowReceiptService.fetchReceipt(moneyflowId.value)
        .then((response) => {
          if (response.receiptType !== undefined) receipt.value = response;
          else if (importedReceipt.value !== undefined)
            receipt.value = mapImportedMoneyflowReceiptToMoneyflowReceipt(
              importedReceipt.value,
            );
        })
        .catch(handleBackendError);
    } else {
      receipt.value = {} as MoneyflowReceipt;
    }
  },
);

const deleteMoneyflowReceipt = () => {
  MoneyflowReceiptService.deleteMoneyflowReceipt(receipt.value.moneyflowId)
    .then(() => {
      close();
    })
    .catch(handleBackendError);
};
</script>
