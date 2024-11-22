<template>
  <ModalVue
    :title="$t('ContractpartnerAccount.title.delete')"
    ref="modalComponent"
    zIndex="2001"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row d-flex justify-content-center mt-3">
        <div class="col-11">
          <table class="table table-bordered table-hover">
            <tbody>
              <tr>
                <th>{{ $t("General.iban") }}</th>
                <td>{{ mca.accountNumber }}</td>
              </tr>
              <tr>
                <th>{{ $t("General.bic") }}</th>
                <td>{{ mca.bankCode }}</td>
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
        @click="deleteContractpartnerAccount"
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

import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";

import ContractpartnerAccountService from "@/service/ContractpartnerAccountService";

const serverErrors = ref(new Array<string>());

const mca = ref({} as ContractpartnerAccount);
const modalComponent = useTemplateRef<typeof ModalVue>('modalComponent');
const emit = defineEmits(["contractpartnerAccountDeleted"]);

const _show = (_mca: ContractpartnerAccount) => {
  mca.value = _mca;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteContractpartnerAccount = () => {
  serverErrors.value = new Array<string>();

  ContractpartnerAccountService.deleteContractpartnerAccount(
    mca.value.id,
  )
    .then(() => {
      modalComponent.value?._hide();
      emit("contractpartnerAccountDeleted", mca.value);
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
