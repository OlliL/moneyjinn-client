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

    <ListContractpartnersMobile
      :contractpartners="contractpartners"
      @delete-contractpartner="deleteContractpartner"
      @edit-contractpartner="editContractpartner"
      @list-contractpartner-accounts="listContractpartnerAccounts"
    />

    <ListContractpartnersDesktop
      :contractpartners="contractpartners"
      @delete-contractpartner="deleteContractpartner"
      @edit-contractpartner="editContractpartner"
      @list-contractpartner-accounts="listContractpartnerAccounts"
    />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { onMounted, ref, useTemplateRef, watch } from "vue";

import { useContractpartnerStore } from "@/stores/ContractpartnerStore";

import DivFilter from "@/components/DivFilter.vue";
import CreateContractpartnerModalVue from "@/components/contractpartner/CreateContractpartnerModal.vue";
import DeleteContractpartnerModalVue from "./elements/DeleteContractpartnerModal.vue";
import ListContractpartnersDesktop from "./elements/ListContractpartnersDesktop.vue";
import ListContractpartnersMobile from "./elements/ListContractpartnersMobile.vue";
import ListContractpartnerAccountsModal from "./elements/ListContractpartnerAccountsModal.vue";

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
