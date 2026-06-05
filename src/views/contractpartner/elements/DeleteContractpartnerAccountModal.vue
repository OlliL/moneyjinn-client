<template>
  <ModalDelete
    :title="$t('ContractpartnerAccount.title.delete')"
    z-index="2001"
    id-suffix="DeleteContractpartnerAccount"
    v-model:open="open"
    :delete-action="
      () =>
        ContractpartnerAccountService.deleteContractpartnerAccount(
          account?.id ?? 0,
        )
    "
    :delete-success-action="onDone"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.iban')" highlight-value>
        <SpanIban :iban="account?.accountNumber" />
      </ModalDeleteRow>
      <ModalDeleteRow :label="$t('General.bic')">
        {{ account?.bankCode }}
      </ModalDeleteRow>
      <ModalDeleteRow :label="$t('General.lastUsed')">
        <SpanDate :date="account?.lastUsed" />
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import SpanIban from "@/components/common/SpanIban.vue";
import ContractpartnerAccountService from "@/service/ContractpartnerAccountService";
import { storeToRefs } from "pinia";
import useDeleteContractpartnerAccountModalStore from "./DeleteContractpartnerAccountModal.store";

const { open, account, onDone } = storeToRefs(
  useDeleteContractpartnerAccountModalStore(),
);
</script>
