<template>
  <ModalVue
    :title="$t('ContractpartnerAccount.title.delete')"
    ref="modalComponent"
    zIndex="2001"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.iban") }}
        </div>
        <div class="text-start col-sm-9">{{ mca.accountNumber }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.bic") }}
        </div>
        <div class="text-start col-sm-9">{{ mca.bankCode }}</div>
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
import { ref } from "vue";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";

import ContractpartnerAccountControllerHandler from "@/handler/ContractpartnerAccountControllerHandler";

const serverErrors = ref(new Array<string>());

const mca = ref({} as ContractpartnerAccount);
const modalComponent = ref();
const emit = defineEmits(["contractpartnerAccountDeleted"]);

const _show = (_mca: ContractpartnerAccount) => {
  mca.value = _mca;
  serverErrors.value = new Array<string>();
  modalComponent.value._show();
};

const deleteContractpartnerAccount = () => {
  serverErrors.value = new Array<string>();

  ContractpartnerAccountControllerHandler.deleteContractpartnerAccount(
    mca.value.id
  )
    .then(() => {
      modalComponent.value._hide();
      emit("contractpartnerAccountDeleted", mca.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
