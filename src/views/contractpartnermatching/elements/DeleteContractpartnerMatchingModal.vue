<template>
  <ModalDelete
    :title="$t('ContractpartnerMatching.title.delete')"
    id-suffix="DeleteContractpartnerMatching"
    v-model:server-errors="serverErrors"
    v-model:open="open"
    @confirm="deleteContractpartnerMatching"
  >
    <template #details>
      <ModalDeleteRow
        :label="$t('ContractpartnerMatching.matchingText')"
        highlight-value
      >
        {{ matching.matchingText }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.contractpartner')">
        {{ matching.contractpartnerName }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('Contractpartner.moneyflowComment')">
        {{ matching.moneyflowComment }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.postingAccount')">
        {{ matching.postingAccountName }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.lastUsed')">
        <SpanDate :date="matching.lastUsed" />
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import ContractpartnerMatchingService from "@/service/ContractpartnerMatchingService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import useDeleteContractpartnerMatchingModalStore from "./DeleteContractpartnerMatchingModal.store";

const serverErrors = ref(new Array<string>());
const { open, matching, onDone } = storeToRefs(
  useDeleteContractpartnerMatchingModalStore(),
);

const deleteContractpartnerMatching = () => {
  ContractpartnerMatchingService.deleteContractpartnerMatching(
    matching.value.id,
  )
    .then(() => {
      open.value = false;
      onDone.value?.();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
