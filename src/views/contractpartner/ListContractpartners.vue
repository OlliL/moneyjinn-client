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

  <ListContractpartnerAccountsModalVue ref="accountsModal" />

  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Vertragspartner</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-md-9 col-xs-12">
        <table style="margin: 0 auto">
          <tr>
            <td class="text-right pe-2">
              <button
                type="button"
                class="btn btn-primary"
                @click="showCreateContractpartnerModal"
              >
                Neu
              </button>
            </td>
            <td>
              <div class="input-group">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="searchAllContent"
                >
                  Alle
                </button>
                <input
                  class="form-control"
                  type="text"
                  placeholder="Suchen nach Name..."
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
                  <label class="form-check-label" for="contractpartnersValid"
                    >Jetzt g&uuml;ltig</label
                  >
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-9 col-xs-12">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>g&uuml;ltig ab</th>
              <th>g&uuml;ltig bis</th>
              <th>Standard Kommentar</th>
              <th>Standard Buchungskonto</th>
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
import { onMounted, ref } from "vue";

import { useContractpartnerStore } from "@/stores/ContractpartnerStore";

import CreateContractpartnerModalVue from "@/components/contractpartner/CreateContractpartnerModal.vue";
import DeleteContractpartnerModalVue from "@/components/contractpartner/DeleteContractpartnerModal.vue";
import ListContractpartnerRowVue from "@/components/contractpartner/ListContractpartnerRow.vue";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";

const validNow = ref(true);
const contractpartners = ref(new Array<Contractpartner>());
const searchString = ref("");

const createContractpartnerModalList = ref();
const deleteModal = ref();
const accountsModal = ref();

const searchContractpartners = useContractpartnerStore().searchContractpartners;

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
    }
  );
};

onMounted(() => {
  searchAllContent();
});

const listContractpartnerAccounts = (mcp: Contractpartner) => {
  accountsModal.value._show(mcp);
};
</script>
