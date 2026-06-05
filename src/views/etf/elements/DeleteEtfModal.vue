<template>
  <ModalDelete
    :title="$t('ETF.title.delete')"
    :server-errors="serverErrors"
    id-suffix="DeleteEtf"
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
import useDeleteEtfModalStore from "./DeleteEtfModal.store";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const { open, etf, onDone } = storeToRefs(useDeleteEtfModalStore());

const serverErrors = ref(new Array<string>());

watch(open, (newVal) => {
  if (newVal) serverErrors.value = new Array<string>();
});

const deleteEtf = () => {
  serverErrors.value = new Array<string>();

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
