<template>
  <CreateContractpartnerAccountModal />
  <DeleteContractpartnerAccountModal />

  <ModalVue
    :title="(mcp?.name ?? '') + ': ' + $t('General.contractpartnerAccounts')"
    max-width="!max-w-xl"
    id-suffix="ListContractpartnerAccounts"
    v-model:open="open"
  >
    <template #body>
      <div class="hidden md:flex flex-col rounded-md border">
        <Table
          class="[&_tr:nth-child(even)]:bg-muted [&_td]:py-1! [&_th]:py-1!"
        >
          <TableHeader>
            <TableRow>
              <TableHead class="table-head-cell">{{
                $t("General.iban")
              }}</TableHead>
              <TableHead class="table-head-cell">{{
                $t("General.bic")
              }}</TableHead>
              <TableHead class="table-head-cell">{{
                $t("General.lastUsedShort")
              }}</TableHead>
              <TableHead class="table-head-cell"></TableHead>
              <TableHead class="table-head-cell"></TableHead>
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
            />
          </TableBody>
        </Table>
      </div>

      <div class="md:hidden space-y-2">
        <div
          v-if="contractpartnerAccount.length === 0"
          class="text-center text-muted-foreground py-8 border rounded-lg"
        >
          {{ $t("ContractpartnerAccount.nothingFound") }}
        </div>
        <div
          v-else
          v-for="mca in contractpartnerAccount"
          :key="mca.accountNumber"
          class="border rounded-lg bg-background shadow-sm px-3 py-1"
        >
          <div class="grid grid-cols-[1fr_auto] items-center w-full gap-2">
            <div class="flex flex-col items-start text-left overflow-hidden">
              <span class="font-bold text-sm truncate w-full">
                <SpanIban :iban="mca.accountNumber"
              /></span>
              <span class="text-xs text-muted-foreground">
                {{ mca.bankCode }}
              </span>
              <span class="text-xs text-muted-foreground" v-if="mca.lastUsed">
                {{ $t("General.lastUsed") }}: <SpanDate :date="mca.lastUsed" />
              </span>
            </div>
            <div class="flex items-center gap-1">
              <Button variant="ghost" size="icon" @click="actions.edit(mca)">
                <Pencil class="icon-medium" />
              </Button>
              <Button variant="ghost" size="icon" @click="actions.delete(mca)">
                <Trash2 class="icon-medium" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <Button
        @click="createContractpartnerAccount"
        class="button-with-icon gap-2 rounded-md! px-6"
      >
        <PlusSquare class="icon-medium" />
        {{ $t("General.new") }}
      </Button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Pencil, PlusSquare, Trash2 } from "@lucide/vue";
import { provide, ref, watch } from "vue";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ModalVue from "@/components/common/Modal.vue";
import {
  ContractpartnerAccountActionsKey,
  type CrudActions,
} from "@/model/CrudActions";
import useCreateContractpartnerAccountModalStore from "./CreateContractpartnerAccountModal.store";
import CreateContractpartnerAccountModal from "./CreateContractpartnerAccountModal.vue";
import { useDeleteContractpartnerAccountModalStore } from "./DeleteContractpartnerAccountModal.store";
import DeleteContractpartnerAccountModal from "./DeleteContractpartnerAccountModal.vue";
import ListContractpartnerAccountRowVue from "./ListContractpartnerAccountRow.vue";
import { useListContractpartnerAccountsModalStore } from "./ListContractpartnerAccountsModal.store";

import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import ContractpartnerAccountService from "@/service/ContractpartnerAccountService";

import SpanDate from "@/components/common/SpanDate.vue";
import SpanIban from "@/components/common/SpanIban.vue";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { storeToRefs } from "pinia";

const { open, contractpartner: mcp } = storeToRefs(
  useListContractpartnerAccountsModalStore(),
);
const { openCreateContractpartnerAccount, openEditContractpartnerAccount } =
  useCreateContractpartnerAccountModalStore();
const { openDelete: openDeleteContractpartnerAccount } =
  useDeleteContractpartnerAccountModalStore();
const contractpartnerAccount = ref([] as Array<ContractpartnerAccount>);
const dataLoaded = ref(false);

const actions: CrudActions<ContractpartnerAccount> = {
  create: () => createContractpartnerAccount(),
  edit: (contractpartnerAccount) =>
    openEditContractpartnerAccount(contractpartnerAccount, loadData),
  delete: (contractpartnerAccount) =>
    openDeleteContractpartnerAccount(contractpartnerAccount, loadData),
};

provide(ContractpartnerAccountActionsKey, actions);

const createContractpartnerAccount = () => {
  openCreateContractpartnerAccount(mcp.value!.id, loadData);
};

const loadData = () => {
  dataLoaded.value = false;
  ContractpartnerAccountService.fetchAllContractpartnerAccount(mcp.value!.id)
    .then((mcaArray: Array<ContractpartnerAccount>) => {
      contractpartnerAccount.value = mcaArray;
      dataLoaded.value = true;
    })
    .catch(handleBackendError);
};

watch(
  [open, mcp],
  ([isVisible]) => {
    if (isVisible && mcp.value) {
      loadData();
    }
  },
  { immediate: true },
);
</script>
