<template>
  <CreateContractpartnerAccountModalVue
    v-if="dataLoaded"
    ref="createContractpartnerAccountModal"
    id-suffix="listAccounts"
    :contractpartner-id="mcp.id"
    @contractpartner-account-created="loadData"
    @contractpartner-account-updated="loadData"
  />
  <DeleteContractpartnerAccountModalVue
    v-if="dataLoaded"
    ref="deleteModal"
    @contractpartner-account-deleted="loadData"
  />

  <ModalVue
    :title="mcp.name + ': ' + $t('General.contractpartnerAccounts')"
    ref="modalComponent"
    max-width="600px"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="col">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th class="text-center">{{ $t("General.iban") }}</th>
              <th class="text-center">{{ $t("General.bic") }}</th>
              <th class="text-center" colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <ListContractpartnerAccountRowVue
              v-for="mca in contractpartnerAccount"
              :key="mca.accountNumber"
              :mca="mca"
              @delete-contractpartner-account="deleteContractpartnerAccount"
              @edit-contractpartner-account="editContractpartnerAccount"
            />
          </tbody>
        </table>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-primary"
        @click="showCreateContractpartnerAccountModal"
      >
        {{ $t("General.new") }}
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import CreateContractpartnerAccountModalVue from "./CreateContractpartnerAccountModal.vue";
import DeleteContractpartnerAccountModalVue from "./DeleteContractpartnerAccountModal.vue";
import ListContractpartnerAccountRowVue from "./ListContractpartnerAccountRow.vue";
import ModalVue from "../Modal.vue";
import DivError from "../DivError.vue";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";

import ContractpartnerAccountControllerHandler from "@/handler/ContractpartnerAccountControllerHandler";

import { handleBackendError } from "@/tools/views/HandleBackendError";

const serverErrors = ref(new Array<string>());

const mcp = ref({} as Contractpartner);
const contractpartnerAccount = ref({} as Array<ContractpartnerAccount>);
const dataLoaded = ref(false);
const modalComponent = ref();
const createContractpartnerAccountModal = ref();
const deleteModal = ref();

const loadData = () => {
  dataLoaded.value = false;
  ContractpartnerAccountControllerHandler.fetchAllContractpartnerAccount(
    mcp.value.id,
  )
    .then((mcaArray: Array<ContractpartnerAccount>) => {
      contractpartnerAccount.value = mcaArray;
      dataLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

const _show = (_mcp: Contractpartner) => {
  mcp.value = _mcp;
  loadData();
  modalComponent.value._show();
};

const showCreateContractpartnerAccountModal = () => {
  createContractpartnerAccountModal.value._show();
};

const editContractpartnerAccount = (_mca: ContractpartnerAccount) => {
  createContractpartnerAccountModal.value._show(_mca);
};

const deleteContractpartnerAccount = (_mca: ContractpartnerAccount) => {
  deleteModal.value._show(_mca);
};

defineExpose({ _show });
</script>
