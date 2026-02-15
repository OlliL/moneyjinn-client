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

  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("General.contractpartnerMatchings") }}</h4>
      </div>
    </div>

    <DivFilter
      v-model="searchString"
      :showValidToggle="false"
      :placeholder="$t('ContractpartnerMatching.searchBy')"
      @createClicked="showCreateContractpartnerMatchingModal"
      ><template #right>
        <div class="col-md-6 ms-2">
          <SelectContractpartner
            v-model="searchContractpartnerId"
            id-suffix="ContractpartnerMatching-searchContractpartner"
            :field-label="$t('General.contractpartner')"
          />
        </div> </template
    ></DivFilter>

    <DivError :server-errors="serverErrors" />

    <DivContentTable clazz="col-md-7 col-xs-12">
      <thead>
        <tr>
          <th scope="col">{{ $t("ContractpartnerMatching.matchingText") }}</th>
          <th scope="col">{{ $t("General.contractpartner") }}</th>
          <th scope="col">{{ $t("Contractpartner.moneyflowComment") }}</th>
          <th scope="col">{{ $t("General.postingAccount") }}</th>
          <th scope="colgroup" colspan="2"></th>
        </tr>
      </thead>
      <tbody>
        <ListContractpartnerMatchingRowVue
          v-for="mcm in contractpartnerMatchings"
          :key="mcm.id"
          :mcm="mcm"
          @edit-contractpartner-matching="editContractpartnerMatching"
          @delete-contractpartner-matching="deleteContractpartnerMatching"
        />
      </tbody>
    </DivContentTable>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, useTemplateRef } from "vue";

import DivContentTable from "@/components/DivContentTable.vue";
import DivError from "@/components/DivError.vue";
import DivFilter from "@/components/DivFilter.vue";
import CreateContractpartnerMatchingModalVue from "@/components/contractpartnermatching/CreateContractpartnerMatchingModal.vue";
import DeleteContractpartnerMatchingModalVue from "@/components/contractpartnermatching/DeleteContractpartnerMatchingModal.vue";
import ListContractpartnerMatchingRowVue from "@/components/contractpartnermatching/ListContractpartnerMatchingRow.vue";

import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";

import ContractpartnerMatchingService from "@/service/ContractpartnerMatchingService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import SelectContractpartner from "@/components/contractpartner/SelectContractpartner.vue";

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
