<template>
  <ModalVue
    title="Vertragspartnerkonto l&ouml;schen"
    ref="modalComponent"
    zIndex="2001"
  >
    <template #body>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          IBAN
        </div>
        <div class="text-start col-sm-9">{{ mca.accountNumber }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          BIC
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
        L&ouml;schen
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import ModalVue from "../Modal.vue";

import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";

import ContractpartnerAccountControllerHandler from "@/handler/ContractpartnerAccountControllerHandler";

const mca = ref({} as ContractpartnerAccount);
const modalComponent = ref();
const emit = defineEmits(["contractpartnerAccountDeleted"]);

const _show = (_mca: ContractpartnerAccount) => {
  mca.value = _mca;
  modalComponent.value._show();
};

const deleteContractpartnerAccount = () => {
  ContractpartnerAccountControllerHandler.deleteContractpartnerAccount(
    mca.value.id
  ).then(() => {
    modalComponent.value._hide();
    emit("contractpartnerAccountDeleted", mca.value);
  });
};

defineExpose({ _show });
</script>
