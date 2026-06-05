<template>
  <ModalDelete
    :title="$t('Moneyflow.title.delete')"
    :server-errors="serverErrors"
    id-suffix="DeleteMoneyflow"
    v-model:open="open"
    @confirm="deleteMoneyflow"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.amount')" highlight-value>
        <SpanAmount :amount="mmf.amount" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('Moneyflow.bookingdate')">
        <SpanDate :date="mmf.bookingDate" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('Moneyflow.invoicedate')">
        <SpanDate :date="mmf.invoiceDate" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.contractpartner')">
        {{ mmf.contractpartnerName }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.capitalsource')">
        {{ mmf.capitalsourceComment }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.comment')">
        {{ mmf.comment }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.postingAccount')">
        {{ mmf.postingAccountName }}
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import useDeleteMoneyflowModalStore from "./DeleteMoneyflowModal.store";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

import ModalDelete from "../common/ModalDelete.vue";
import ModalDeleteRow from "../common/ModalDeleteRow.vue";
import SpanAmount from "../common/SpanAmount.vue";
import SpanDate from "../common/SpanDate.vue";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

import MoneyflowService from "@/service/MoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";

const serverErrors = ref(new Array<string>());

const mmf = ref({} as Moneyflow);
const { open, moneyflow, onDone } = storeToRefs(
  useDeleteMoneyflowModalStore(),
);

watch(
  [open, moneyflow],
  ([isVisible, entry]) => {
    if (!isVisible || !entry) return;
    mmf.value = entry;
    serverErrors.value = new Array<string>();
  },
  { immediate: true },
);

const deleteMoneyflow = () => {
  serverErrors.value = new Array<string>();

  MoneyflowService.deleteMoneyflow(mmf.value.id)
    .then(() => {
      open.value = false;
      onDone.value?.(mmf.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
