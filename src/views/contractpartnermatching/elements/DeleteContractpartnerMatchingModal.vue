<template>
  <ModalDelete
    :title="$t('ContractpartnerMatching.title.delete')"
    id-suffix="DeleteContractpartnerMatching"
    v-model:open="open"
    :delete-action="
      () =>
        ContractpartnerMatchingService.deleteContractpartnerMatching(
          matching.id,
        )
    "
    :delete-success-action="onDone"
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
import { storeToRefs } from "pinia";
import useDeleteContractpartnerMatchingModalStore from "./DeleteContractpartnerMatchingModal.store";

const { open, matching, onDone } = storeToRefs(
  useDeleteContractpartnerMatchingModalStore(),
);
</script>
