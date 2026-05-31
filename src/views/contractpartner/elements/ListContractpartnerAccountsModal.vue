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
    max-width="max-w-md"
    ref="modalComponent"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />

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
              <TableHead class="table-head-cell"></TableHead>
              <TableHead class="table-head-cell"></TableHead>
              <TableHead class="table-head-cell">{{
                $t("General.lastUsed")
              }}</TableHead>
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
              <Button
                variant="ghost"
                size="icon"
                @click="editContractpartnerAccount(mca)"
              >
                <Pencil class="icon-medium" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                @click="deleteContractpartnerAccount(mca)"
              >
                <Trash2 class="icon-medium" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <Button
        @click="showCreateContractpartnerAccountModal"
        class="button-with-icon gap-2 rounded-md! px-6"
      >
        <PlusSquare class="icon-medium" />
        {{ $t("General.new") }}
      </Button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Pencil, PlusSquare, Trash2 } from "lucide-vue-next";
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

import SpanDate from "@/components/common/SpanDate.vue";
import SpanIban from "@/components/common/SpanIban.vue";
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
