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
  >
    <template #body>
      <DivError :server-errors="serverErrors" />

      <div class="flex flex-col rounded-md border">
        <Table
          class="[&_tr:nth-child(even)]:bg-muted [&_td]:py-1! [&_th]:py-1!"
        >
          <TableHeader>
            <TableRow>
              <TableHead class="font-bold border text-foreground text-center">{{
                $t("General.iban")
              }}</TableHead>
              <TableHead class="font-bold border text-foreground text-center">{{
                $t("General.bic")
              }}</TableHead>
              <TableHead class="font-bold border text-foreground text-center"
                ><span class="sr-only">Edit</span></TableHead
              >
              <TableHead class="font-bold border text-foreground text-center"
                ><span class="sr-only">Delete</span></TableHead
              >
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-if="contractpartnerAccount.length === 0"
              data-testid="contractpartner-account-empty"
            >
              <TableCell
                colspan="3"
                class="text-center text-muted-foreground py-8"
              >
                {{ $t("ContractpartnerAccount.nothingFound") }}
              </TableCell>
            </TableRow>
            <ListContractpartnerAccountRowVue
              v-for="mca in contractpartnerAccount"
              :key="mca.accountNumber"
              :mca="mca"
              @delete-contractpartner-account="deleteContractpartnerAccount"
              @edit-contractpartner-account="editContractpartnerAccount"
            />
          </TableBody>
        </Table>
      </div>
    </template>

    <template #footer>
      <Button
        @click="showCreateContractpartnerAccountModal"
        class="flex items-center gap-2 rounded-md! px-6"
      >
        <Plus class="h-4 w-4" />
        {{ $t("General.new") }}
      </Button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Plus } from "lucide-vue-next";
import { ref, useTemplateRef } from "vue";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DivError from "@/components/common/DivError.vue";
import ModalVue from "@/components/common/Modal.vue";
import CreateContractpartnerAccountModalVue from "./CreateContractpartnerAccountModal.vue";
import DeleteContractpartnerAccountModalVue from "./DeleteContractpartnerAccountModal.vue";
import ListContractpartnerAccountRowVue from "./ListContractpartnerAccountRow.vue";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import ContractpartnerAccountService from "@/service/ContractpartnerAccountService";

import { handleBackendError } from "@/tools/views/HandleBackendError";

const serverErrors = ref(new Array<string>());

const mcp = ref({} as Contractpartner);
const contractpartnerAccount = ref([] as Array<ContractpartnerAccount>);
const dataLoaded = ref(false);

const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const createContractpartnerAccountModal = useTemplateRef<
  typeof CreateContractpartnerAccountModalVue
>("createContractpartnerAccountModal");
const deleteModal =
  useTemplateRef<typeof DeleteContractpartnerAccountModalVue>("deleteModal");

const loadData = () => {
  dataLoaded.value = false;
  ContractpartnerAccountService.fetchAllContractpartnerAccount(mcp.value.id)
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
  modalComponent.value?._show();
};

const showCreateContractpartnerAccountModal = () => {
  createContractpartnerAccountModal.value?._show();
};

const editContractpartnerAccount = (_mca: ContractpartnerAccount) => {
  createContractpartnerAccountModal.value?._show(_mca);
};

const deleteContractpartnerAccount = (_mca: ContractpartnerAccount) => {
  deleteModal.value?._show(_mca);
};

defineExpose({ _show });
</script>
