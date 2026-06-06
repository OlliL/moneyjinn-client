<template>
  <CreateEtfModal />
  <DeleteEtfModal />

  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("General.etfs") }}</h4>
    </div>

    <DivFilter
      v-model="searchString"
      :showValidToggle="false"
      :placeholder="$t('ETF.searchBy')"
      @createClicked="actions.create"
    />

    <ListEtfsMobile :etfs="etfs" />

    <ListEtfsDesktop :etfs="etfs" />
  </div>
</template>

<script lang="ts" setup>
import DivFilter from "@/components/common/DivFilter.vue";
import { EtfActionsKey, type CrudActions } from "@/model/CrudActions";
import type { Etf } from "@/model/etf/Etf";
import { useEtfStore } from "@/stores/EtfStore";
import { storeToRefs } from "pinia";
import { onMounted, provide, ref, watch } from "vue";
import useCreateEtfModalStore from "./elements/CreateEtfModal.store";
import CreateEtfModal from "./elements/CreateEtfModal.vue";
import { useDeleteEtfModalStore } from "./elements/DeleteEtfModal.store";
import DeleteEtfModal from "./elements/DeleteEtfModal.vue";
import ListEtfsDesktop from "./elements/ListEtfsDesktop.vue";
import ListEtfsMobile from "./elements/ListEtfsMobile.vue";

const etfs = ref(new Array<Etf>());
const searchString = ref("");

const { searchEtfs } = useEtfStore();

const { etf } = storeToRefs(useEtfStore());
const { openCreateEtf, openEditEtf } = useCreateEtfModalStore();
const { openDelete: openDeleteEtf } = useDeleteEtfModalStore();

const actions: CrudActions<Etf> = {
  create: () => openCreateEtf(searchContent),
  edit: (etfEntry) => openEditEtf(etfEntry, searchContent),
  delete: (etfEntry) => openDeleteEtf(etfEntry, searchContent),
};

provide(EtfActionsKey, actions);

watch(searchString, () => searchContent());
watch(etf, () => searchContent());

const searchAllContent = () => {
  searchString.value = "";
  searchContent();
};

const searchContent = () =>
  searchEtfs(searchString.value).then((_etfs) => {
    etfs.value = _etfs;
  });

onMounted(() => searchAllContent());
</script>
