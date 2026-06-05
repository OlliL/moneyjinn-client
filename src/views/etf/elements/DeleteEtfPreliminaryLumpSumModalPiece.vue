<template>
  <ModalDelete
    :title="$t('ETFPreliminaryLumpSum.title.delete')"
    :server-errors="serverErrors"
    v-model:open="open"
    id-suffix="DeleteEtfPreliminaryLumpSumPiece"
    @confirm="deleteEtfPreliminaryLumpSum"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.etf')">
        {{ etfName }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.year')" highlight-value>
        {{ lumpSum.year }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('ETFPreliminaryLumpSum.price')">
        <SpanAmount :amount="lumpSum.amountPerPiece" />
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
import { computed, ref, watch } from "vue";
import useDeleteEtfPreliminaryLumpSumModalPieceStore from "./DeleteEtfPreliminaryLumpSumModalPiece.store";

const { getEtf } = useEtfStore();

const serverErrors = ref(new Array<string>());
const etfName = computed(() => getEtf(lumpSum.value.etfId)?.name ?? "");

const { open, lumpSum, onDone } = storeToRefs(
  useDeleteEtfPreliminaryLumpSumModalPieceStore(),
);

watch(open, (newVal) => {
  if (newVal) {
    serverErrors.value = new Array<string>();
  }
});

const deleteEtfPreliminaryLumpSum = () => {
  serverErrors.value = new Array<string>();

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
