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

  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("General.contractpartner") }}</h4>
      </div>
    </div>

    <div class="row justify-content-md-center">
      <div class="col-md-auto mb-3">
        <div class="row">
          <div class="col-md-auto mb-3">
            <button
              type="button"
              class="btn btn-primary"
              @click="showCreateContractpartnerModal"
            >
              {{ $t("General.new") }}
            </button>
          </div>
          <div class="col">
            <div class="input-group">
              <button
                type="button"
                class="btn btn-primary"
                @click="searchAllContent"
              >
                {{ $t("General.all") }}
              </button>
              <input
                class="form-control"
                type="text"
                :placeholder="$t('Contractpartner.searchBy')"
                v-model="searchString"
                @input="searchContent"
              />
              <div class="form-check form-switch align-self-center ms-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="contractpartnersValid"
                  v-model="validNow"
                  @change="searchContent"
                />
                <label class="form-check-label" for="contractpartnersValid">{{
                  $t("General.validNow")
                }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-md-center">
      <div class="col-xxl-9 col-xs-12">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>{{ $t("General.name") }}</th>
              <th>{{ $t("General.validFrom") }}</th>
              <th>{{ $t("General.validTil") }}</th>
              <th>{{ $t("Contractpartner.moneyflowComment") }}</th>
              <th>{{ $t("General.postingAccount") }}</th>
              <th colspan="3"></th>
            </tr>
          </thead>
          <tbody>
            <ListContractpartnerRowVue
              v-for="mcp in contractpartners"
              :key="mcp.id"
              :mcp="mcp"
              @delete-contractpartner="deleteContractpartner"
              @edit-contractpartner="editContractpartner"
              @list-contractpartner-accounts="listContractpartnerAccounts"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";

import { useContractpartnerStore } from "@/stores/ContractpartnerStore";

import CreateContractpartnerModalVue from "@/components/contractpartner/CreateContractpartnerModal.vue";
import DeleteContractpartnerModalVue from "@/components/contractpartner/DeleteContractpartnerModal.vue";
import ListContractpartnerAccountsModal from "@/components/contractpartneraccount/ListContractpartnerAccountsModal.vue";
import ListContractpartnerRowVue from "@/components/contractpartner/ListContractpartnerRow.vue";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import { storeToRefs } from "pinia";

const validNow = ref(true);
const contractpartners = ref(new Array<Contractpartner>());
const searchString = ref("");

const createContractpartnerModalList = ref();
const deleteModal = ref();
const accountsModal = ref();

const contractpartnerStore = useContractpartnerStore();
const searchContractpartners = contractpartnerStore.searchContractpartners;
const { contractpartner } = storeToRefs(contractpartnerStore);

watch(contractpartner, () => {
  searchAllContent();
});

const showCreateContractpartnerModal = () => {
  createContractpartnerModalList.value._show();
};

const deleteContractpartner = (mcs: Contractpartner) => {
  deleteModal.value._show(mcs);
};

const editContractpartner = (mcs: Contractpartner) => {
  createContractpartnerModalList.value._show(mcs);
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
  accountsModal.value._show(mcp);
};
</script>
