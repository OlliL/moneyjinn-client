<template>
  <ModalVue :title="$t('ETF.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row d-flex justify-content-center mt-3">
        <div class="col-11">
          <table class="table table-bordered table-hover">
            <colgroup>
              <col span="1" style="background-color: #f2f2f2" width="35%" />
            </colgroup>
            <tbody>
              <tr>
                <th>{{ $t("General.name") }}</th>
                <td>{{ etf.name }}</td>
              </tr>
              <tr>
                <th>{{ $t("ETF.isin") }}</th>
                <td>{{ etf.isin }}</td>
              </tr>
              <tr>
                <th>{{ $t("ETF.wkn") }}</th>
                <td>{{ etf.wkn }}</td>
              </tr>
              <tr>
                <th>{{ $t("ETF.ticker") }}</th>
                <td>{{ etf.ticker }}</td>
              </tr>
              <tr>
                <th>{{ $t("ETF.chartUrl") }}</th>
                <td>{{ etf.chartUrl }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-danger" @click="deleteEtf">
        {{ $t("General.delete") }}
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { Etf } from "@/model/etf/Etf";

import CrudEtfControllerHandler from "@/handler/CrudEtfControllerHandler";

const serverErrors = ref(new Array<string>());

const etf = ref({} as Etf);
const modalComponent = ref();
const emit = defineEmits(["etfDeleted"]);

const _show = (_etf: Etf) => {
  etf.value = _etf;
  serverErrors.value = new Array<string>();
  modalComponent.value._show();
};

const deleteEtf = () => {
  serverErrors.value = new Array<string>();

  CrudEtfControllerHandler.deleteEtf(etf.value.id)
    .then(() => {
      modalComponent.value._hide();
      emit("etfDeleted", etf.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
