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
            <colgroup>
              <col span="1" style="background-color: #f2f2f2" width="40%" />
            </colgroup>
            <tbody>
              <tr>
                <th>{{ $t("General.etf") }}</th>
                <td>{{ etfName }}</td>
              </tr>
              <tr>
                <th>{{ $t("General.year") }}</th>
                <td>{{ etfPreliminaryLumpSum.year }}</td>
              </tr>
              <tr>
                <th>{{ $t("ETFPreliminaryLumpSum.price") }}</th>
                <td>
                  <SpanAmount :amount="etfPreliminaryLumpSum.amountPerPiece" />
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
import { ref } from "vue";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import SpanAmount from "../SpanAmount.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { Etf } from "@/model/etf/Etf";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";

import CrudEtfPreliminaryLumpSumControllerHandler from "@/handler/CrudEtfPreliminaryLumpSumControllerHandler";

const serverErrors = ref(new Array<string>());

const etfPreliminaryLumpSum = ref({} as EtfPreliminaryLumpSum);
const etfName = ref("");
const modalComponent = ref();
const emit = defineEmits(["etfPreliminaryLumpSumDeleted"]);

const _show = (_etfs: Array<Etf>, _mep: EtfPreliminaryLumpSum) => {
  serverErrors.value = new Array<string>();
  for (let etf of _etfs) {
    if (etf.id == _mep.etfId) {
      etfName.value = etf.name;
      break;
    }
  }

  etfPreliminaryLumpSum.value = _mep;
  modalComponent.value._show();
};
const deleteEtfPreliminaryLumpSum = () => {
  serverErrors.value = new Array<string>();

  CrudEtfPreliminaryLumpSumControllerHandler.deleteEtfPreliminaryLumpSum(
    etfPreliminaryLumpSum.value.id,
  )
    .then(() => {
      modalComponent.value._hide();
      emit("etfPreliminaryLumpSumDeleted", etfPreliminaryLumpSum.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
