<template>
  <ModalVue
    :title="$t('ContractpartnerMatching.title.delete')"
    ref="modalComponent"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row d-flex justify-content-center mt-3">
        <div class="col-11">
          <table class="table table-bordered table-hover">
            <tbody>
              <tr>
                <th scope="row">
                  {{ $t("ContractpartnerMatching.matchingText") }}
                </th>
                <td>{{ mcm.matchingText }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("General.contractpartner") }}</th>
                <td>
                  {{
                    contractpartnerStore.getContractpartner(
                      mcm.contractpartnerId,
                    )?.name
                  }}
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
        @click="deleteContractpartnerMatching"
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

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";

import ContractpartnerMatchingService from "@/service/ContractpartnerMatchingService";
import { useContractpartnerStore } from "@/stores/ContractpartnerStore";

const serverErrors = ref(new Array<string>());

const mcm = ref({} as ContractpartnerMatching);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["contractpartnerMatchingDeleted"]);
const contractpartnerStore = useContractpartnerStore();

const _show = (_mcm: ContractpartnerMatching) => {
  mcm.value = _mcm;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteContractpartnerMatching = () => {
  serverErrors.value = new Array<string>();

  ContractpartnerMatchingService.deleteContractpartnerMatching(mcm.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("contractpartnerMatchingDeleted", mcm.value);
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
