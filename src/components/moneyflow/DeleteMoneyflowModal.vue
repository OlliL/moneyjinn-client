<template>
  <ModalDelete
    :title="$t('Moneyflow.title.delete')"
    :server-errors="serverErrors"
    ref="modalComponent"
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
import { ref, useTemplateRef } from "vue";

import ModalDelete from "../ModalDelete.vue";
import ModalDeleteRow from "../ModalDeleteRow.vue";
import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

import MoneyflowService from "@/service/MoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";

const serverErrors = ref(new Array<string>());

const mmf = ref({} as Moneyflow);
const modalComponent = useTemplateRef<typeof ModalDelete>("modalComponent");
const emit = defineEmits(["moneyflowDeleted"]);

const _show = (_mmf: Moneyflow) => {
  mmf.value = _mmf;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteMoneyflow = () => {
  serverErrors.value = new Array<string>();

  MoneyflowService.deleteMoneyflow(mmf.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("moneyflowDeleted", mmf.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
defineExpose({ _show });
</script>
