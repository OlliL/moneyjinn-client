<template>
  <ModalDelete
    :title="$t('Contractpartner.title.delete')"
    id-suffix="DeleteContractpartner"
    v-model:open="open"
    :delete-action="
      () =>
        ContractpartnerService.deleteContractpartner(contractpartner?.id ?? 0)
    "
    :delete-success-action="onDone"
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
import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import SpanDate from "@/components/common/SpanDate.vue";

import ContractpartnerService from "@/service/ContractpartnerService";
import { storeToRefs } from "pinia";
import useDeleteContractpartnerModalStore from "./DeleteContractpartnerModal.store";

const {
  open,
  entity: contractpartner,
  onDone,
} = storeToRefs(useDeleteContractpartnerModalStore());
</script>
