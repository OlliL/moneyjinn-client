<template>
  <ModalDelete
    :title="$t('Contractpartner.title.delete')"
    :server-errors="serverErrors"
    ref="modalComponent"
    @confirm="deleteContractpartner"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.name')" highlight-value>
        {{ mcp.name }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('Contractpartner.street')">
        {{ mcp.street }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('Contractpartner.postcode')">
        {{ mcp.postcode }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('Contractpartner.town')">
        {{ mcp.town }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.validFrom')">
        <SpanDate :date="mcp.validFrom" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.validTil')">
        <SpanDate :date="mcp.validTil" />
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from "vue";

import ModalDelete from "@/components/ModalDelete.vue";
import ModalDeleteRow from "@/components/ModalDeleteRow.vue";
import SpanDate from "@/components/SpanDate.vue";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import ContractpartnerService from "@/service/ContractpartnerService";
import { handleBackendError } from "@/tools/views/HandleBackendError";

const serverErrors = ref(new Array<string>());
const mcp = ref({} as Contractpartner);
const modalComponent = useTemplateRef<typeof ModalDelete>("modalComponent");
const emit = defineEmits(["contractpartnerDeleted"]);

const _show = (_mcp: Contractpartner) => {
  mcp.value = _mcp;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteContractpartner = () => {
  serverErrors.value = new Array<string>();

  ContractpartnerService.deleteContractpartner(mcp.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("contractpartnerDeleted", mcp.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
