<template>
  <ModalDelete
    :title="$t('ETF.title.delete')"
    id-suffix="DeleteEtf"
    v-model:server-errors="serverErrors"
    v-model:open="open"
    @confirm="deleteEtf"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.name')" highlight-value>
        {{ etf.name }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('ETF.isin')">
        {{ etf.isin }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('ETF.wkn')">
        {{ etf.wkn }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('ETF.ticker')">
        {{ etf.ticker }}
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import CrudEtfService from "@/service/CrudEtfService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import useDeleteEtfModalStore from "./DeleteEtfModal.store";

const { open, etf, onDone } = storeToRefs(useDeleteEtfModalStore());

const serverErrors = ref(new Array<string>());

const deleteEtf = () => {
  CrudEtfService.deleteEtf(etf.value.id)
    .then(() => {
      open.value = false;
      onDone.value?.();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
