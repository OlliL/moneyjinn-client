<template>
  <CreateContractpartnerModalVue
    ref="createContractpartnerModalList"
    id-suffix="List"
    @contractpartner-created="searchContent"
    @contractpartner-updated="searchContent"
  />
  <DeleteContractpartnerModalVue
    ref="deleteModal"
    @contractpartner-deleted="searchContent"
  />

  <ListContractpartnerAccountsModal ref="accountsModal" />

  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("General.contractpartner") }}</h4>
    </div>

    <DivFilter
      v-model="searchString"
      :placeholder="$t('Contractpartner.searchBy')"
      @validNowToggled="validNowToggled"
      @createClicked="showCreateContractpartnerModal"
    />

    <DivContentTable>
      <TableHeader>
        <TableRow>
          <TableHead class="font-bold border text-foreground text-center">
            {{ $t("General.name") }}
          </TableHead>
          <TableHead class="font-bold border text-foreground text-center">
            {{ $t("General.validFrom") }}
          </TableHead>
          <TableHead class="font-bold border text-foreground text-center">
            {{ $t("General.validTil") }}
          </TableHead>
          <TableHead class="font-bold border text-foreground text-center">
            {{ $t("Contractpartner.moneyflowComment") }}
          </TableHead>
          <TableHead class="font-bold border text-foreground text-center">
            {{ $t("General.postingAccount") }}
          </TableHead>
          <TableHead class="border" colspan="3"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <ListContractpartnerRowVue
          v-for="mcp in contractpartners"
          :key="mcp.id"
          v-memo="[mcp.id]"
          :mcp="mcp"
          @delete-contractpartner="deleteContractpartner"
          @edit-contractpartner="editContractpartner"
          @list-contractpartner-accounts="listContractpartnerAccounts"
        />
      </TableBody>
    </DivContentTable>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, useTemplateRef } from "vue";
import { storeToRefs } from "pinia";

// Shadcn UI Komponenten
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useContractpartnerStore } from "@/stores/ContractpartnerStore";

import DivContentTable from "@/components/DivContentTable.vue";
import DivFilter from "@/components/DivFilter.vue";
import CreateContractpartnerModalVue from "@/components/contractpartner/CreateContractpartnerModal.vue";
import DeleteContractpartnerModalVue from "@/components/contractpartner/DeleteContractpartnerModal.vue";
import ListContractpartnerAccountsModal from "@/components/contractpartneraccount/ListContractpartnerAccountsModal.vue";
import ListContractpartnerRowVue from "@/components/contractpartner/ListContractpartnerRow.vue";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";

const validNow = ref(true);
const contractpartners = ref(new Array<Contractpartner>());
const searchString = ref("");

const createContractpartnerModalList = useTemplateRef<
  typeof CreateContractpartnerModalVue
>("createContractpartnerModalList");
const deleteModal =
  useTemplateRef<typeof DeleteContractpartnerModalVue>("deleteModal");
const accountsModal =
  useTemplateRef<typeof ListContractpartnerAccountsModal>("accountsModal");

const contractpartnerStore = useContractpartnerStore();
const searchContractpartners = contractpartnerStore.searchContractpartners;
const { contractpartner } = storeToRefs(contractpartnerStore);

const showCreateContractpartnerModal = () => {
  createContractpartnerModalList.value?._show();
};

const deleteContractpartner = (mcs: Contractpartner) => {
  deleteModal.value?._show(mcs);
};

const editContractpartner = (mcs: Contractpartner) => {
  createContractpartnerModalList.value?._show(mcs);
};

watch(contractpartner, () => {
  searchContent();
  if (contractpartners.value.length == 0) searchAllContent();
});

watch(searchString, () => {
  searchContent();
});

const validNowToggled = (myValidNow: boolean) => {
  validNow.value = myValidNow;
  searchContent();
};

const searchAllContent = () => {
  searchString.value = "";
  searchContent();
};

const searchContent = () => {
  searchContractpartners(searchString.value, validNow.value).then(
    (_contractpartners) => {
      contractpartners.value = _contractpartners;
    },
  );
};

onMounted(() => {
  searchAllContent();
});

const listContractpartnerAccounts = (mcp: Contractpartner) => {
  accountsModal.value?._show(mcp);
};
</script>
