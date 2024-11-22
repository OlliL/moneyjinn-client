<template>
  <ModalVue :title="$t('Moneyflow.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row d-flex justify-content-center mt-3">
        <div class="col-11">
          <table class="table table-bordered table-hover">
            <tbody>
              <tr>
                <th>{{ $t("Moneyflow.bookingdate") }}</th>
                <td><SpanDate :date="mmf.bookingDate" /></td>
              </tr>
              <tr>
                <th>{{ $t("Moneyflow.invoicedate") }}</th>
                <td><SpanDate :date="mmf.invoiceDate" /></td>
              </tr>
              <tr>
                <th>{{ $t("General.contractpartner") }}</th>
                <td>{{ mmf.contractpartnerName }}</td>
              </tr>
              <tr>
                <th>{{ $t("General.capitalsource") }}</th>
                <td>{{ mmf.capitalsourceComment }}</td>
              </tr>
              <tr>
                <th>{{ $t("General.amount") }}</th>
                <td><SpanAmount :amount="mmf.amount" /></td>
              </tr>
              <tr>
                <th>{{ $t("General.comment") }}</th>
                <td>{{ mmf.comment }}</td>
              </tr>
              <tr>
                <th>{{ $t("General.postingAccount") }}</th>
                <td>{{ mmf.postingAccountName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-danger" @click="deleteMoneyflow">
        {{ $t("General.delete") }}
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from "vue";

import ModalVue from "../Modal.vue";
import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

import MoneyflowService from "@/service/MoneyflowService";
import DivError from "../DivError.vue";
import { handleBackendError } from "@/tools/views/HandleBackendError";

const serverErrors = ref(new Array<string>());

const mmf = ref({} as Moneyflow);
const modalComponent = useTemplateRef<typeof ModalVue>('modalComponent');
const emit = defineEmits(["moneyflowDeleted"]);

const _show = (_mmf: Moneyflow) => {
  mmf.value = _mmf;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteMoneyflow = () => {
  serverErrors.value = new Array<string>();

  MoneyflowService.deleteMoneyflow(mmf.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("moneyflowDeleted", mmf.value);
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
