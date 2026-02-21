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

    <DivContentTable clazz="col-xxl-8 col-xs-12">
      <thead>
        <tr>
          <th scope="col" rowspan="2" id="name">{{ $t("General.name") }}</th>
          <th scope="col" rowspan="2" id="isin">{{ $t("ETF.isin") }}</th>
          <th scope="col" rowspan="2" id="wkn">{{ $t("ETF.wkn") }}</th>
          <th scope="col" rowspan="2" id="ticker">{{ $t("ETF.ticker") }}</th>
          <th scope="colgroup" colspan="3" id="transactionCosts">
            {{ $t("ETFFlow.transactionCosts") }}
          </th>
          <th scope="col" rowspan="2" id="partialTaxExemption">
            {{ $t("ETF.partialTaxExemption") }}
          </th>
          <th scope="col" rowspan="2" id="favorite">
            <i class="bi bi-star-fill text-warning"></i>
          </th>
          <th scope="col" rowspan="2" colspan="2" id="editDelete"></th>
        </tr>
        <tr>
          <th scope="col" id="abs">
            {{ $t("ETFFlow.transactionCostsAbsolute") }}
          </th>
          <th scope="col" id="rel">
            {{ $t("ETFFlow.transactionCostsRelative") }}
          </th>
          <th scope="col" id="max">
            {{ $t("ETFFlow.transactionCostsMaximum") }}
          </th>
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

import { useEtfStore } from "@/stores/EtfStore";

const serverErrors = ref(new Array<string>());
const etfs = ref(new Array<Etf>());
const searchString = ref("");

const etfStore = useEtfStore();
const searchEtfs = etfStore.searchEtfs;

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
