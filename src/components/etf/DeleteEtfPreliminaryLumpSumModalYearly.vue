<template>
  <ModalVue
    :title="$t('ETFPreliminaryLumpSum.title.delete')"
    ref="modalComponent"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row d-flex justify-content-center mt-3">
        <div class="col-11">
          <table class="table table-bordered table-hover">
            <tbody>
              <tr>
                <th scope="row">{{ $t("General.etf") }}</th>
                <td>{{ etfName }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("General.year") }}</th>
                <td>{{ etfPreliminaryLumpSum.year }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("ETFPreliminaryLumpSum.yearlySum") }}</th>
                <td>
                  <SpanAmount :amount="etfPreliminaryLumpSum.amountDecember" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-danger"
        @click="deleteEtfPreliminaryLumpSum"
      >
        {{ $t("General.delete") }}
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
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
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
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

<style scoped>
th {
  background-color: #f2f2f2;
}
</style>
