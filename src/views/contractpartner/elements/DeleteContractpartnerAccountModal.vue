<template>
  <ModalDelete
    :title="$t('ContractpartnerAccount.title.delete')"
    :server-errors="serverErrors"
    z-index="2001"
    id-suffix="DeleteContractpartnerAccount"
    v-model:open="open"
    @confirm="deleteContractpartnerAccount"
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
import useDeleteContractpartnerAccountModalStore from "./DeleteContractpartnerAccountModal.store";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const {
  open,
  account,
  onDone,
} = storeToRefs(useDeleteContractpartnerAccountModalStore());

const serverErrors = ref(new Array<string>());

watch(open, (newVal) => {
  if (newVal) serverErrors.value = new Array<string>();
});

const deleteContractpartnerAccount = () => {
  serverErrors.value = new Array<string>();

  ContractpartnerAccountService.deleteContractpartnerAccount(account.value!.id)
    .then(() => {
      open.value = false;
      onDone.value?.();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
