<template>
  <ModalDelete
    :title="$t('ContractpartnerMatching.title.delete')"
    :server-errors="serverErrors"
    id-suffix="DeleteContractpartnerMatching"
    v-model:open="open"
    @confirm="deleteContractpartnerMatching"
  >
    <template #details>
      <ModalDeleteRow
        :label="$t('ContractpartnerMatching.matchingText')"
        highlight-value
      >
        {{ mcmData.matchingText }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.contractpartner')">
        {{ mcmData.contractpartnerName }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('Contractpartner.moneyflowComment')">
        {{ mcmData.moneyflowComment }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.postingAccount')">
        {{ mcmData.postingAccountName }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.lastUsed')">
        <SpanDate :date="mcmData.lastUsed" />
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";
import ContractpartnerMatchingService from "@/service/ContractpartnerMatchingService";
import useDeleteContractpartnerMatchingModalStore from "./DeleteContractpartnerMatchingModal.store";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const serverErrors = ref(new Array<string>());
const { open, matching: selectedForDelete, onDone } = storeToRefs(
  useDeleteContractpartnerMatchingModalStore(),
);
const mcmData = ref({} as ContractpartnerMatching);

watch(
  selectedForDelete,
  (entry) => {
    if (entry) {
      mcmData.value = entry;
    }
  },
  { immediate: true },
);

watch(open, (newVal) => {
  if (newVal) {
    serverErrors.value = new Array<string>();
  }
});

const deleteContractpartnerMatching = () => {
  serverErrors.value = new Array<string>();

  ContractpartnerMatchingService.deleteContractpartnerMatching(mcmData.value.id)
    .then(() => {
      open.value = false;
      onDone.value?.();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
