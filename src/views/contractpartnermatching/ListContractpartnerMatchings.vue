<template>
  <CreateContractpartnerMatchingModalVue
    ref="createContractpartnerMatchingModalList"
    id-suffix="List"
    @contractpartner-matching-created="reloadView"
    @contractpartner-matching-updated="reloadView"
  />
  <DeleteContractpartnerMatchingModalVue
    ref="deleteModal"
    id-suffix="List"
    @contractpartner-matching-deleted="reloadView"
  />

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
      @createClicked="showCreateContractpartnerMatchingModal"
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

    <DivError :server-errors="serverErrors" />

    <ListContractpartnerMatchingsMobile
      :contractpartner-matchings="contractpartnerMatchings"
      @edit-contractpartner-matching="editContractpartnerMatching"
      @delete-contractpartner-matching="deleteContractpartnerMatching"
    />

    <ListContractpartnerMatchingsDesktop
      :contractpartner-matchings="contractpartnerMatchings"
      @edit-contractpartner-matching="editContractpartnerMatching"
      @delete-contractpartner-matching="deleteContractpartnerMatching"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef, watch } from "vue";

import DivError from "@/components/common/DivError.vue";
import DivFilter from "@/components/common/DivFilter.vue";
import CreateContractpartnerMatchingModalVue from "./elements/CreateContractpartnerMatchingModal.vue";
import DeleteContractpartnerMatchingModalVue from "./elements/DeleteContractpartnerMatchingModal.vue";
import ListContractpartnerMatchingsDesktop from "./elements/ListContractpartnerMatchingsDesktop.vue";
import ListContractpartnerMatchingsMobile from "./elements/ListContractpartnerMatchingsMobile.vue";

import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";

import SelectContractpartner from "@/components/contractpartner/SelectContractpartner.vue";
import ContractpartnerMatchingService from "@/service/ContractpartnerMatchingService";
import { handleBackendError } from "@/tools/views/HandleBackendError";

const serverErrors = ref(new Array<string>());

const contractpartnerMatchings = ref(new Array<ContractpartnerMatching>());
const allContractpartnerMatchings = ref(new Array<ContractpartnerMatching>());
const searchString = ref("");
const searchContractpartnerId = ref<number | undefined>(undefined);

const createContractpartnerMatchingModalList = useTemplateRef<
  typeof CreateContractpartnerMatchingModalVue
>("createContractpartnerMatchingModalList");
const deleteModal =
  useTemplateRef<typeof DeleteContractpartnerMatchingModalVue>("deleteModal");

const showCreateContractpartnerMatchingModal = () => {
  createContractpartnerMatchingModalList.value?._show();
};

const deleteContractpartnerMatching = (mcs: ContractpartnerMatching) => {
  deleteModal.value?._show(mcs);
};

const editContractpartnerMatching = (mcs: ContractpartnerMatching) => {
  createContractpartnerMatchingModalList.value?._show(mcs);
};

watch(searchString, () => {
  searchContent();
});

watch(searchContractpartnerId, () => {
  searchContent();
});

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
  serverErrors.value = new Array<string>();

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
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

onMounted(() => {
  searchString.value = "";
  reloadView();
});
</script>
