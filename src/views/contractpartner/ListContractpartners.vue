<template>
  <DeleteContractpartnerModal />
  <ListContractpartnerAccountsModal />

  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("General.contractpartner") }}</h4>
    </div>

    <DivFilter
      v-model="searchString"
      :placeholder="$t('Contractpartner.searchBy')"
      @validNowToggled="validNowToggled"
      @createClicked="actions.create"
    />

    <ListContractpartnersMobile :contractpartners="contractpartners" />

    <ListContractpartnersDesktop :contractpartners="contractpartners" />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted, provide, ref, shallowRef, watch } from "vue";

import { useContractpartnerStore } from "@/stores/ContractpartnerStore";
import { useCreateContractpartnerModalStore } from "@/components/contractpartner/CreateContractpartnerModal.store";
import useDeleteContractpartnerModalStore from "./elements/DeleteContractpartnerModal.store";
import { useListContractpartnerAccountsModalStore } from "./elements/ListContractpartnerAccountsModal.store";

import DivFilter from "@/components/common/DivFilter.vue";
import {
  ContractpartnerActionsKey,
  OpenContractpartnerAccountsActionKey,
  type CrudActions,
} from "@/model/CrudActions";
import DeleteContractpartnerModal from "./elements/DeleteContractpartnerModal.vue";
import ListContractpartnerAccountsModal from "./elements/ListContractpartnerAccountsModal.vue";
import ListContractpartnersDesktop from "./elements/ListContractpartnersDesktop.vue";
import ListContractpartnersMobile from "./elements/ListContractpartnersMobile.vue";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";

const validNow = ref(true);
const contractpartners = shallowRef(new Array<Contractpartner>());
const searchString = ref("");
const INITIAL_CHUNK_SIZE = 50;
const CHUNK_SIZE = 200;
let renderAnimationFrameId: number | undefined;
let currentSearchId = 0;

const contractpartnerStore = useContractpartnerStore();
const { searchContractpartners } = contractpartnerStore;
const { contractpartner } = storeToRefs(contractpartnerStore);
const { openCreateContractpartner, openEditContractpartner } =
  useCreateContractpartnerModalStore();
const { openDeleteContractpartner } = useDeleteContractpartnerModalStore();
const { openListContractpartnerAccounts } =
  useListContractpartnerAccountsModalStore();

const actions: CrudActions<Contractpartner> = {
  create: () => {
    openCreateContractpartner(searchContent);
  },
  edit: (contractpartnerEntry) => {
    openEditContractpartner(contractpartnerEntry, searchContent);
  },
  delete: (contractpartnerEntry) =>
    openDeleteContractpartner(contractpartnerEntry, searchContent),
};

provide(ContractpartnerActionsKey, actions);
provide(
  OpenContractpartnerAccountsActionKey,
  (contractpartnerEntry: Contractpartner) => {
    openListContractpartnerAccounts(contractpartnerEntry);
  },
);

watch(contractpartner, () => {
  searchContent();
  if (contractpartners.value.length == 0) searchAllContent();
});

watch(searchString, () => searchContent());

const validNowToggled = (myValidNow: boolean) => {
  validNow.value = myValidNow;
  searchContent();
};

const searchAllContent = () => {
  searchString.value = "";
  searchContent();
};

const searchContent = () => {
  const searchId = ++currentSearchId;

  if (renderAnimationFrameId) {
    cancelAnimationFrame(renderAnimationFrameId);
    renderAnimationFrameId = undefined;
  }

  searchContractpartners(searchString.value).then((allContractpartners) => {
    if (searchId !== currentSearchId) return;

    contractpartners.value = []; // Clear the list immediately
    processAndRenderChunked(allContractpartners, 0, searchId);
  });
};

const processAndRenderChunked = (
  allData: Contractpartner[],
  startIndex: number,
  searchId: number,
) => {
  if (searchId !== currentSearchId) return;

  const currentChunkSize =
    contractpartners.value.length === 0 ? INITIAL_CHUNK_SIZE : CHUNK_SIZE;
  const nextIndex = startIndex + currentChunkSize;
  const rawChunk = allData.slice(startIndex, nextIndex);

  // Apply validNow filter to the current chunk
  const filteredChunk = validNow.value
    ? rawChunk.filter((mcp) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date >= mcp.validFrom && date <= mcp.validTil;
      })
    : rawChunk;

  contractpartners.value = [...contractpartners.value, ...filteredChunk];

  if (nextIndex < allData.length) {
    renderAnimationFrameId = globalThis.requestAnimationFrame(() =>
      processAndRenderChunked(allData, nextIndex, searchId),
    );
  } else {
    renderAnimationFrameId = undefined;
  }
};

const renderChunk = (
  allData: Contractpartner[],
  startIndex: number,
  searchId: number,
) => {
  if (searchId !== currentSearchId) return;

  const nextIndex = startIndex + CHUNK_SIZE;
  const chunk = allData.slice(startIndex, nextIndex);

  contractpartners.value = [...contractpartners.value, ...chunk];

  if (nextIndex < allData.length) {
    renderAnimationFrameId = globalThis.requestAnimationFrame(() =>
      renderChunk(allData, nextIndex, searchId),
    );
  } else {
    renderAnimationFrameId = undefined;
  }
};

onMounted(() => searchAllContent());

onUnmounted(() => {
  if (renderAnimationFrameId) cancelAnimationFrame(renderAnimationFrameId);
});
</script>
