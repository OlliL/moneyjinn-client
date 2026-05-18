<template>
  <ModalDelete
    :title="$t('ContractpartnerMatching.title.delete')"
    :server-errors="serverErrors"
    ref="modalComponent"
    @confirm="deleteContractpartnerMatching"
  >
    <template #details>
      <ModalDeleteRow
        :label="$t('ContractpartnerMatching.matchingText')"
        highlight-value
      >
        {{ mcm.matchingText }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.contractpartner')">
        {{ mcm.contractpartnerName }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('Contractpartner.moneyflowComment')">
        {{ mcm.moneyflowComment }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.postingAccount')">
        {{ mcm.postingAccountName }}
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";
import ContractpartnerMatchingService from "@/service/ContractpartnerMatchingService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { ref, useTemplateRef } from "vue";
import ModalDelete from "../ModalDelete.vue";
import ModalDeleteRow from "../ModalDeleteRow.vue";

const serverErrors = ref(new Array<string>());

const mcm = ref({} as ContractpartnerMatching);
const modalComponent = useTemplateRef<typeof ModalDelete>("modalComponent");
const emit = defineEmits(["contractpartnerMatchingDeleted"]);

const _show = (_mcm: ContractpartnerMatching) => {
  mcm.value = _mcm;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteContractpartnerMatching = () => {
  serverErrors.value = new Array<string>();

  ContractpartnerMatchingService.deleteContractpartnerMatching(mcm.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("contractpartnerMatchingDeleted", mcm.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
