<template>
  <ModalVue :title="$t('PreDefMoneyflow.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row d-flex justify-content-center mt-3">
        <div class="col-11">
          <table class="table table-bordered table-hover">
            <tbody>
              <tr>
                <th scope="row">{{ $t("General.amount") }}</th>
                <td><SpanAmount :amount="mpm.amount" /></td>
              </tr>
              <tr>
                <th scope="row">{{ $t("General.contractpartner") }}</th>
                <td>{{ mpm.contractpartnerName }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("General.comment") }}</th>
                <td>{{ mpm.comment }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("General.postingAccount") }}</th>
                <td>{{ mpm.postingAccountName }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("General.capitalsource") }}</th>
                <td>{{ mpm.capitalsourceComment }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("PreDefMoneyflow.onceAMonth") }}</th>
                <td><SpanBoolean :value="mpm.onceAMonth" /></td>
              </tr>
              <tr>
                <th scope="row">{{ $t("PreDefMoneyflow.createDate") }}</th>
                <td><SpanDate :date="mpm.createDate" /></td>
              </tr>
              <tr>
                <th scope="row">{{ $t("PreDefMoneyflow.lastUsed") }}</th>
                <td><SpanDate :date="mpm.lastUsed" /></td>
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
        @click="deletePreDefMoneyflow"
      >
        {{ $t("General.delete") }}
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from "vue";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import SpanAmount from "../SpanAmount.vue";
import SpanBoolean from "../SpanBoolean.vue";
import SpanDate from "../SpanDate.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";

import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";

const serverErrors = ref(new Array<string>());

const mpm = ref({} as PreDefMoneyflow);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["preDefMoneyflowDeleted"]);

const _show = (_mpm: PreDefMoneyflow) => {
  mpm.value = _mpm;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deletePreDefMoneyflow = () => {
  serverErrors.value = new Array<string>();

  PreDefMoneyflowService.deletePreDefMoneyflow(mpm.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("preDefMoneyflowDeleted", mpm.value);
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
