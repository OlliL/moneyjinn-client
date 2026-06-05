<template>
  <ModalDelete
    :title="$t('ETFPreliminaryLumpSum.title.delete')"
    id-suffix="DeleteEtfPreliminaryLumpSumYearly"
    v-model:server-errors="serverErrors"
    v-model:open="open"
    @confirm="deleteEtfPreliminaryLumpSum"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.etf')">
        {{ etfName }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.year')" highlight-value>
        {{ lumpSum.year }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('ETFPreliminaryLumpSum.yearlySum')">
        <SpanAmount :amount="lumpSum.amountDecember" />
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import SpanAmount from "@/components/common/SpanAmount.vue";
import CrudEtfPreliminaryLumpSumService from "@/service/CrudEtfPreliminaryLumpSumService";
import { useEtfStore } from "@/stores/EtfStore";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import useDeleteEtfPreliminaryLumpSumModalYearlyStore from "./DeleteEtfPreliminaryLumpSumModalYearly.store";

const { getEtf } = useEtfStore();

const serverErrors = ref(new Array<string>());
const etfName = computed(() => getEtf(lumpSum.value.etfId)?.name ?? "");

const { open, lumpSum, onDone } = storeToRefs(
  useDeleteEtfPreliminaryLumpSumModalYearlyStore(),
);

const deleteEtfPreliminaryLumpSum = () => {
  CrudEtfPreliminaryLumpSumService.deleteEtfPreliminaryLumpSum(lumpSum.value.id)
    .then(() => {
      open.value = false;
      onDone.value?.(lumpSum.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
