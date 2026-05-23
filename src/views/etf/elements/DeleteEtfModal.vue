<template>
  <ModalDelete
    :title="$t('ETF.title.delete')"
    :server-errors="serverErrors"
    ref="modalComponent"
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
import type { Etf } from "@/model/etf/Etf";
import CrudEtfService from "@/service/CrudEtfService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { ref, useTemplateRef } from "vue";

const serverErrors = ref(new Array<string>());

const etf = ref({} as Etf);
const modalComponent = useTemplateRef<typeof ModalDelete>("modalComponent");
const emit = defineEmits(["etfDeleted"]);

const _show = (_etf: Etf) => {
  etf.value = _etf;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteEtf = () => {
  serverErrors.value = new Array<string>();

  CrudEtfService.deleteEtf(etf.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("etfDeleted", etf.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
