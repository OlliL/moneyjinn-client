<template>
  <CreateEtfModalVue
    ref="createEtfModalList"
    id-suffix="List"
    @etf-created="searchContent"
    @etf-updated="searchContent"
  />
  <DeleteEtfModalVue
    ref="deleteModal"
    id-suffix="List"
    @etf-deleted="searchContent"
  />

  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("General.etfs") }}</h4>
    </div>

    <DivFilter
      v-model="searchString"
      :showValidToggle="false"
      :placeholder="$t('ETF.searchBy')"
      @createClicked="showCreateEtfModal"
    />

    <DivError :server-errors="serverErrors" />

    <ListEtfsMobile :etfs="etfs" @edit-etf="editEtf" @delete-etf="deleteEtf" />

    <ListEtfsDesktop :etfs="etfs" @edit-etf="editEtf" @delete-etf="deleteEtf" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef, watch } from "vue";

import DivError from "@/components/DivError.vue";
import DivFilter from "@/components/DivFilter.vue";
import CreateEtfModalVue from "./elements/CreateEtfModal.vue";
import DeleteEtfModalVue from "./elements/DeleteEtfModal.vue";
import ListEtfsDesktop from "./elements/ListEtfsDesktop.vue";
import ListEtfsMobile from "./elements/ListEtfsMobile.vue";

import type { Etf } from "@/model/etf/Etf";

import { useEtfStore } from "@/stores/EtfStore";
import { storeToRefs } from "pinia";

const serverErrors = ref(new Array<string>());
const etfs = ref(new Array<Etf>());
const searchString = ref("");

const { searchEtfs } = useEtfStore();

const { etf } = storeToRefs(useEtfStore());

const createEtfModalList =
  useTemplateRef<typeof CreateEtfModalVue>("createEtfModalList");
const deleteModal = useTemplateRef<typeof DeleteEtfModalVue>("deleteModal");

const showCreateEtfModal = () => {
  createEtfModalList.value?._show();
};

const deleteEtf = (mcs: Etf) => {
  deleteModal.value?._show(mcs);
};

const editEtf = (mcs: Etf) => {
  createEtfModalList.value?._show(mcs);
};

watch(searchString, () => {
  searchContent();
});
watch(etf, () => {
  searchContent();
});

const searchAllContent = () => {
  searchString.value = "";
  searchContent();
};

const searchContent = () => {
  searchEtfs(searchString.value).then((_etfs) => {
    etfs.value = _etfs;
  });
};

onMounted(() => {
  searchAllContent();
});
</script>
