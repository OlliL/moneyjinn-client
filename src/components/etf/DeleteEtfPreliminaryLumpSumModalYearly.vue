<template>
  <ModalDelete
    :title="$t('ETFPreliminaryLumpSum.title.delete')"
    :server-errors="serverErrors"
    ref="modalComponent"
    @confirm="deleteEtfPreliminaryLumpSum"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.etf')">
        {{ etfName }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.year')" highlight-value>
        {{ etfPreliminaryLumpSum.year }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('ETFPreliminaryLumpSum.yearlySum')">
        <SpanAmount :amount="etfPreliminaryLumpSum.amountDecember" />
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";

import ModalDelete from "../ModalDelete.vue";
import ModalDeleteRow from "../ModalDeleteRow.vue";
import SpanAmount from "../SpanAmount.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";

import CrudEtfPreliminaryLumpSumService from "@/service/CrudEtfPreliminaryLumpSumService";
import { useEtfStore } from "@/stores/EtfStore";

const serverErrors = ref(new Array<string>());

const etfPreliminaryLumpSum = ref({} as EtfPreliminaryLumpSum);
const etfName = computed(() => {
  return etfStore.getEtf(etfPreliminaryLumpSum.value.etfId)?.name ?? "";
});
const modalComponent = useTemplateRef<typeof ModalDelete>("modalComponent");
const emit = defineEmits(["etfPreliminaryLumpSumDeleted"]);
const etfStore = useEtfStore();

const _show = (_mep: EtfPreliminaryLumpSum) => {
  serverErrors.value = new Array<string>();
  etfPreliminaryLumpSum.value = _mep;
  modalComponent.value?._show();
};
const deleteEtfPreliminaryLumpSum = () => {
  serverErrors.value = new Array<string>();

  CrudEtfPreliminaryLumpSumService.deleteEtfPreliminaryLumpSum(
    etfPreliminaryLumpSum.value.id,
  )
    .then(() => {
      modalComponent.value?._hide();
      emit("etfPreliminaryLumpSumDeleted", etfPreliminaryLumpSum.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
