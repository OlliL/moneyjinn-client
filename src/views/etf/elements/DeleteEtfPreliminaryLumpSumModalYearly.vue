<template>
  <ModalDelete
    :title="$t('ETFPreliminaryLumpSum.title.delete')"
    :server-errors="serverErrors"
    v-model:open="open"
    id-suffix="DeleteEtfPreliminaryLumpSumYearly"
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
import { computed, ref, watch } from "vue";

import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import SpanAmount from "@/components/common/SpanAmount.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import CrudEtfPreliminaryLumpSumService from "@/service/CrudEtfPreliminaryLumpSumService";
import { useEtfStore } from "@/stores/EtfStore";
import useDeleteEtfPreliminaryLumpSumModalYearlyStore from "./DeleteEtfPreliminaryLumpSumModalYearly.store";
import { storeToRefs } from "pinia";

const serverErrors = ref(new Array<string>());

const {
  open,
  lumpSum: etfPreliminaryLumpSum,
  onDone,
} = storeToRefs(useDeleteEtfPreliminaryLumpSumModalYearlyStore());
const etfName = computed(
  () => etfStore.getEtf(etfPreliminaryLumpSum.value.etfId)?.name ?? "",
);
const etfStore = useEtfStore();

const deleteEtfPreliminaryLumpSum = () => {
  serverErrors.value = new Array<string>();

  CrudEtfPreliminaryLumpSumService.deleteEtfPreliminaryLumpSum(
    etfPreliminaryLumpSum.value.id,
  )
    .then(() => {
      open.value = false;
      onDone.value?.(etfPreliminaryLumpSum.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

watch(open, (newVal) => {
  if (newVal) serverErrors.value = new Array<string>();
});
</script>
