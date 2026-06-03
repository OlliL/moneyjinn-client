<template>
  <ModalDelete
    :title="$t('ContractpartnerAccount.title.delete')"
    :server-errors="serverErrors"
    z-index="2001"
    ref="modalComponent"
    @confirm="deleteContractpartnerAccount"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.iban')" highlight-value>
        <SpanIban :iban="mca.accountNumber" />
      </ModalDeleteRow>
      <ModalDeleteRow :label="$t('General.bic')">
        {{ mca.bankCode }}
      </ModalDeleteRow>
      <ModalDeleteRow :label="$t('General.lastUsed')">
        <SpanDate :date="mca.lastUsed" />
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import SpanIban from "@/components/common/SpanIban.vue";
import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import ContractpartnerAccountService from "@/service/ContractpartnerAccountService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { ref, useTemplateRef } from "vue";

const serverErrors = ref(new Array<string>());
const mca = ref({} as ContractpartnerAccount);
const modalComponent = useTemplateRef<typeof ModalDelete>("modalComponent");
const emit = defineEmits<{
  contractpartnerAccountDeleted: [
    contractpartnerAccount: ContractpartnerAccount,
  ];
}>();

const _show = (_mca: ContractpartnerAccount) => {
  mca.value = _mca;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteContractpartnerAccount = () => {
  serverErrors.value = new Array<string>();

  ContractpartnerAccountService.deleteContractpartnerAccount(mca.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("contractpartnerAccountDeleted", mca.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
