<template>
  <ModalDelete
    :title="$t('Moneyflow.title.delete')"
    id-suffix="DeleteMoneyflow"
    v-model:server-errors="serverErrors"
    v-model:open="open"
    @confirm="deleteMoneyflow"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.amount')" highlight-value>
        <SpanAmount :amount="moneyflow.amount" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('Moneyflow.bookingdate')">
        <SpanDate :date="moneyflow.bookingDate" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('Moneyflow.invoicedate')">
        <SpanDate :date="moneyflow.invoiceDate" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.contractpartner')">
        {{ moneyflow.contractpartnerName }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.capitalsource')">
        {{ moneyflow.capitalsourceComment }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.comment')">
        {{ moneyflow.comment }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.postingAccount')">
        {{ moneyflow.postingAccountName }}
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import useDeleteMoneyflowModalStore from "./DeleteMoneyflowModal.store";

import ModalDelete from "../common/ModalDelete.vue";
import ModalDeleteRow from "../common/ModalDeleteRow.vue";
import SpanAmount from "../common/SpanAmount.vue";
import SpanDate from "../common/SpanDate.vue";

import MoneyflowService from "@/service/MoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";

const serverErrors = ref(new Array<string>());

const { open, moneyflow, onDone } = storeToRefs(useDeleteMoneyflowModalStore());

const deleteMoneyflow = () => {
  MoneyflowService.deleteMoneyflow(moneyflow.value.id)
    .then(() => {
      open.value = false;
      onDone.value?.(moneyflow.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
