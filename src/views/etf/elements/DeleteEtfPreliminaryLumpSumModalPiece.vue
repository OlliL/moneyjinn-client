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
        {{ etfPreliminaryLumpSum.year }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('ETFPreliminaryLumpSum.price')">
        <SpanAmount :amount="etfPreliminaryLumpSum.amountPerPiece" />
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
import useDeleteEtfPreliminaryLumpSumModalPieceStore from "./DeleteEtfPreliminaryLumpSumModalPiece.store";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

const serverErrors = ref(new Array<string>());
const etfStore = useEtfStore();

const etfName = computed(
  () => etfStore.getEtf(etfPreliminaryLumpSum.value.etfId)?.name ?? "",
);

const {
  open,
  lumpSum: etfPreliminaryLumpSum,
  onDone,
} = storeToRefs(useDeleteEtfPreliminaryLumpSumModalPieceStore());

watch(open, (newVal) => {
  if (newVal) {
    serverErrors.value = new Array<string>();
  }
});

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
</script>
