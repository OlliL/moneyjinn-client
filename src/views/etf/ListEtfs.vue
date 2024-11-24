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

    <DivFilter
      v-model="searchString"
      :showValidToggle="false"
      :placeholder="$t('ETF.searchBy')"
      @createClicked="showCreateEtfModal"
    />

    <DivError :server-errors="serverErrors" />

    <DivContentTable class="col-xxl-8 col-xs-12">
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
    </DivContentTable>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, useTemplateRef } from "vue";

import DivContentTable from "@/components/DivContentTable.vue";
import DivError from "@/components/DivError.vue";
import DivFilter from "@/components/DivFilter.vue";
import CreateEtfModalVue from "@/components/etf/CreateEtfModal.vue";
import DeleteEtfModalVue from "@/components/etf/DeleteEtfModal.vue";
import ListEtfRowVue from "@/components/etf/ListEtfRow.vue";

import type { Etf } from "@/model/etf/Etf";

import CrudEtfService from "@/service/CrudEtfService";
import { handleBackendError } from "@/tools/views/HandleBackendError";

const serverErrors = ref(new Array<string>());

const etfs = ref(new Array<Etf>());
const allEtfs = ref(new Array<Etf>());
const searchString = ref("");

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

  CrudEtfService.fetchAllEtf()
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
