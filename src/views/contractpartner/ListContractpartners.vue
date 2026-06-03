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
import {
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
} from "vue";

import { useContractpartnerStore } from "@/stores/ContractpartnerStore";

import DivFilter from "@/components/common/DivFilter.vue";
import CreateContractpartnerModalVue from "@/components/contractpartner/CreateContractpartnerModal.vue";
import DeleteContractpartnerModalVue from "./elements/DeleteContractpartnerModal.vue";
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

onMounted(() => {
  searchAllContent();
});

onUnmounted(() => {
  if (renderAnimationFrameId) cancelAnimationFrame(renderAnimationFrameId);
});

const listContractpartnerAccounts = (mcp: Contractpartner) => {
  accountsModal.value?._show(mcp);
};
</script>
