<template>
  <ModalDelete
    :title="$t('Contractpartner.title.delete')"
    :server-errors="serverErrors"
    id-suffix="DeleteContractpartner"
    v-model:open="open"
    @confirm="deleteContractpartner"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.name')" highlight-value>
        {{ contractpartner.name }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('Contractpartner.street')">
        {{ contractpartner.street }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('Contractpartner.postcode')">
        {{ contractpartner.postcode }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('Contractpartner.town')">
        {{ contractpartner.town }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.validFrom')">
        <SpanDate :date="contractpartner.validFrom" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.validTil')">
        <SpanDate :date="contractpartner.validTil" />
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import SpanDate from "@/components/common/SpanDate.vue";

import ContractpartnerService from "@/service/ContractpartnerService";
import useDeleteContractpartnerModalStore from "./DeleteContractpartnerModal.store";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { storeToRefs } from "pinia";

const {
  open,
  contractpartner,
  onDone,
} = storeToRefs(useDeleteContractpartnerModalStore());

const serverErrors = ref(new Array<string>());

watch(open, (newVal) => {
  if (newVal) serverErrors.value = new Array<string>();
});

const deleteContractpartner = () => {
  serverErrors.value = new Array<string>();

  ContractpartnerService.deleteContractpartner(contractpartner.value!.id)
    .then(() => {
      open.value = false;
      onDone.value?.();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
