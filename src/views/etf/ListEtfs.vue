<template>
  <CreateEtfModalVue
    ref="createEtfModalList"
    id-suffix="List"
    @etf-created="reloadView"
    @etf-updated="reloadView"
  />
  <DeleteEtfModalVue
    ref="deleteModal"
    id-suffix="List"
    @etf-deleted="reloadView"
  />

  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("General.etfs") }}</h4>
      </div>
    </div>

    <div class="row justify-content-md-center">
      <div class="col-md-auto mb-3">
        <div class="row">
          <div class="col-md-auto mb-3">
            <button
              type="button"
              class="btn btn-primary"
              @click="showCreateEtfModal"
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
                :placeholder="$t('ETF.searchBy')"
                v-model="searchString"
                @input="searchContent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <DivError :server-errors="serverErrors" />
    <div class="row justify-content-md-center">
      <div class="col-xxl-8 col-xs-12">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th rowspan="2" id="name">{{ $t("General.name") }}</th>
              <th rowspan="2" id="isin">{{ $t("ETF.isin") }}</th>
              <th rowspan="2" id="wkn">{{ $t("ETF.wkn") }}</th>
              <th rowspan="2" id="ticker">{{ $t("ETF.ticker") }}</th>
              <th colspan="3" id="transactionCosts">
                {{ $t("ETFFlow.transactionCosts") }}
              </th>
              <th rowspan="2" id="partialTaxExemption">
                {{ $t("ETF.partialTaxExemptionSmall") }}
              </th>
              <th rowspan="2" id="favorite">
                <i class="bi bi-star-fill text-warning"></i>
              </th>
              <th rowspan="2" colspan="2" id="editDelete"></th>
            </tr>
            <tr>
              <th id="abs">{{ $t("ETFFlow.transactionCostsAbsolute") }}</th>
              <th id="rel">{{ $t("ETFFlow.transactionCostsRelative") }}</th>
              <th id="max">{{ $t("ETFFlow.transactionCostsMaximum") }}</th>
            </tr>
          </thead>

          <tbody>
            <ListEtfRowVue
              v-for="met in etfs"
              :key="met.id"
              :etf="met"
              @edit-etf="editEtf"
              @delete-etf="deleteEtf"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

import CreateEtfModalVue from "@/components/etf/CreateEtfModal.vue";
import DeleteEtfModalVue from "@/components/etf/DeleteEtfModal.vue";
import ListEtfRowVue from "@/components/etf/ListEtfRow.vue";

import type { Etf } from "@/model/etf/Etf";

import CrudEtfControllerHandler from "@/handler/CrudEtfControllerHandler";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import DivError from "@/components/DivError.vue";

const serverErrors = ref(new Array<string>());

const etfs = ref(new Array<Etf>());
const allEtfs = ref(new Array<Etf>());
const searchString = ref("");

const createEtfModalList = ref();
const deleteModal = ref();

const showCreateEtfModal = () => {
  createEtfModalList.value._show();
};

const deleteEtf = (mcs: Etf) => {
  deleteModal.value._show(mcs);
};

const editEtf = (mcs: Etf) => {
  createEtfModalList.value._show(mcs);
};

const searchAllContent = () => {
  searchString.value = "";
  searchContent();
};

const searchContent = () => {
  if (searchString.value === "") {
    etfs.value = allEtfs.value;
    return;
  }

  const commentUpper = searchString.value.toUpperCase();
  etfs.value = allEtfs.value.filter((entry) =>
    entry.name ? entry.name.toUpperCase().includes(commentUpper) : true,
  );
};

const reloadView = () => {
  serverErrors.value = new Array<string>();

  CrudEtfControllerHandler.fetchAllEtf()
    .then((_etfs) => {
      _etfs.sort((a, b) => {
        if (!a.name && !b.name) return 0;
        else if (!a.name) return -1;
        else if (!b.name) return 1;

        return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
      });
      allEtfs.value = _etfs;
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
