<template>
  <ModalDelete
    :title="$t('Moneyflow.title.delete')"
    id-suffix="DeleteMoneyflow"
    v-model:open="open"
    :delete-action="() => MoneyflowService.deleteMoneyflow(moneyflow.id)"
    :delete-success-action="() => onDone?.(moneyflow)"
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
import MoneyflowService from "@/service/MoneyflowService";
import { storeToRefs } from "pinia";
import ModalDelete from "../common/ModalDelete.vue";
import ModalDeleteRow from "../common/ModalDeleteRow.vue";
import SpanAmount from "../common/SpanAmount.vue";
import SpanDate from "../common/SpanDate.vue";
import { useDeleteMoneyflowModalStore } from "./DeleteMoneyflowModal.store";

const {
  open,
  entity: moneyflow,
  onDone,
} = storeToRefs(useDeleteMoneyflowModalStore());
</script>
