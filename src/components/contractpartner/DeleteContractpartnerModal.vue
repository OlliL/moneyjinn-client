<template>
  <ModalVue :title="$t('Contractpartner.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row d-flex justify-content-center mt-3">
        <div class="col-11">
          <table class="table table-bordered table-hover">
            <tbody>
              <tr>
                <th scope="row">{{ $t("General.name") }}</th>
                <td>{{ mcp.name }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("Contractpartner.street") }}</th>
                <td>{{ mcp.street }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("Contractpartner.postcode") }}</th>
                <td>{{ mcp.postcode }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("Contractpartner.town") }}</th>
                <td>{{ mcp.town }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("Contractpartner.country") }}</th>
                <td>{{ mcp.country }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("General.validFrom") }}</th>
                <td><SpanDate :date="mcp.validFrom" /></td>
              </tr>
              <tr>
                <th scope="row">{{ $t("General.validTil") }}</th>
                <td><SpanDate :date="mcp.validTil" /></td>
              </tr>
              <tr>
                <th scope="row">
                  {{ $t("Contractpartner.moneyflowComment") }}
                </th>
                <td>{{ mcp.moneyflowComment }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("General.postingAccount") }}</th>
                <td>{{ mcp.postingAccountName }}</td>
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
        @click="deleteContractpartner"
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
import SpanDate from "../SpanDate.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";

import ContractpartnerService from "@/service/ContractpartnerService";

const serverErrors = ref(new Array<string>());

const mcp = ref({} as Contractpartner);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["contractpartnerDeleted"]);

const _show = (_mcp: Contractpartner) => {
  mcp.value = _mcp;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteContractpartner = () => {
  serverErrors.value = new Array<string>();

  ContractpartnerService.deleteContractpartner(mcp.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("contractpartnerDeleted", mcp.value);
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
