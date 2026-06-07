<template>
  <CreateContractpartnerMatchingModal />
  <DeleteContractpartnerMatchingModal />

  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">
        {{ $t("General.contractpartnerMatchings") }}
      </h4>
    </div>

    <DivFilter
      v-model="searchString"
      :showValidToggle="false"
      :placeholder="$t('ContractpartnerMatching.searchBy')"
      @createClicked="actions.create"
      ><template #right>
        <div class="w-full md:w-auto">
          <SelectContractpartner
            v-model="searchContractpartnerId"
            id-suffix="ContractpartnerMatching-searchContractpartner"
            :field-label="$t('General.contractpartner')"
          />
        </div> </template
      ><template #mobile-right>
        <div class="w-full">
          <SelectContractpartner
            v-model="searchContractpartnerId"
            id-suffix="ContractpartnerMatching-mobile-searchContractpartner"
            :field-label="$t('General.contractpartner')"
          />
        </div> </template
    ></DivFilter>

    <ListContractpartnerMatchingsMobile
      :contractpartner-matchings="contractpartnerMatchings"
    />

    <ListContractpartnerMatchingsDesktop
      :contractpartner-matchings="contractpartnerMatchings"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, provide, ref, watch } from "vue";

import DivFilter from "@/components/common/DivFilter.vue";
import {
  ContractpartnerMatchingActionsKey,
  type CrudActions,
} from "@/model/CrudActions";
import { useCreateContractpartnerMatchingModalStore } from "./elements/CreateContractpartnerMatchingModal.store";
import CreateContractpartnerMatchingModal from "./elements/CreateContractpartnerMatchingModal.vue";
import { useDeleteContractpartnerMatchingModalStore } from "./elements/DeleteContractpartnerMatchingModal.store";
import DeleteContractpartnerMatchingModal from "./elements/DeleteContractpartnerMatchingModal.vue";
import ListContractpartnerMatchingsDesktop from "./elements/ListContractpartnerMatchingsDesktop.vue";
import ListContractpartnerMatchingsMobile from "./elements/ListContractpartnerMatchingsMobile.vue";

import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";

import SelectContractpartner from "@/components/contractpartner/SelectContractpartner.vue";
import ContractpartnerMatchingService from "@/service/ContractpartnerMatchingService";
import { handleBackendError } from "@/tools/views/HandleBackendError";

const contractpartnerMatchings = ref(new Array<ContractpartnerMatching>());
const allContractpartnerMatchings = ref(new Array<ContractpartnerMatching>());
const searchString = ref("");
const searchContractpartnerId = ref<number | undefined>(undefined);
const {
  openCreate: openCreateContractpartnerMatching,
  openEdit: openEditContractpartnerMatching,
} = useCreateContractpartnerMatchingModalStore();
const { openDelete: openDeleteContractpartnerMatching } =
  useDeleteContractpartnerMatchingModalStore();

const actions: CrudActions<ContractpartnerMatching> = {
  create: () => openCreateContractpartnerMatching(reloadView),
  edit: (matchingEntry) =>
    openEditContractpartnerMatching(matchingEntry, reloadView),
  delete: (matchingEntry) =>
    openDeleteContractpartnerMatching(matchingEntry, reloadView),
};

provide(ContractpartnerMatchingActionsKey, actions);

watch(searchString, () => searchContent());
watch(searchContractpartnerId, () => searchContent());

const searchContent = () => {
  const commentUpper = searchString.value.toUpperCase();
  contractpartnerMatchings.value = allContractpartnerMatchings.value
    .filter((entry) =>
      entry.matchingText
        ? entry.matchingText.toUpperCase().includes(commentUpper)
        : true,
    )
    .filter((entry) =>
      searchContractpartnerId.value
        ? entry.contractpartnerId === searchContractpartnerId.value
        : true,
    );
};

const reloadView = () => {
  ContractpartnerMatchingService.fetchAllContractpartnerMatching()
    .then((_contractpartnerMatchings) => {
      _contractpartnerMatchings.sort((a, b) => {
        if (!a.matchingText && !b.matchingText) return 0;
        else if (!a.matchingText) return -1;
        else if (!b.matchingText) return 1;

        return a.matchingText
          .toUpperCase()
          .localeCompare(b.matchingText.toUpperCase());
      });
      allContractpartnerMatchings.value = _contractpartnerMatchings;
      searchContent();
    })
    .catch(handleBackendError);
};

onMounted(() => {
  searchString.value = "";
  reloadView();
});
</script>
