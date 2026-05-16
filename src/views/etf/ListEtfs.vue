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

    <DivContentTable class="max-w-5xl">
      <TableHeader>
        <TableRow>
          <TableHead
            class="font-bold border text-foreground text-center"
            rowspan="2"
            id="name"
            >{{ $t("General.name") }}</TableHead
          >
          <TableHead
            class="font-bold border text-foreground text-center"
            rowspan="2"
            id="isin"
            >{{ $t("ETF.isin") }}</TableHead
          >
          <TableHead
            class="font-bold border text-foreground text-center"
            rowspan="2"
            id="wkn"
            >{{ $t("ETF.wkn") }}</TableHead
          >
          <TableHead
            class="font-bold border text-foreground text-center"
            rowspan="2"
            id="ticker"
            >{{ $t("ETF.ticker") }}</TableHead
          >
          <TableHead
            class="font-bold border text-foreground text-center"
            colspan="3"
            id="transactionCosts"
          >
            {{ $t("ETFFlow.transactionCosts") }}
          </TableHead>
          <TableHead
            class="font-bold border text-foreground text-center"
            rowspan="2"
            id="partialTaxExemption"
          >
            {{ $t("ETF.partialTaxExemption") }}
          </TableHead>
          <TableHead
            class="font-bold border text-foreground text-center"
            rowspan="2"
            id="favorite"
          >
            <Star class="h-5 w-5 transition-all text-muted-foreground" />
          </TableHead>
          <TableHead
            class="border"
            rowspan="2"
            colspan="2"
            id="editDelete"
          ></TableHead>
        </TableRow>
        <TableRow>
          <TableHead
            class="font-bold border text-foreground text-center"
            id="abs"
          >
            {{ $t("ETFFlow.transactionCostsAbsolute") }}
          </TableHead>
          <TableHead
            class="font-bold border text-foreground text-center"
            id="rel"
          >
            {{ $t("ETFFlow.transactionCostsRelative") }}
          </TableHead>
          <TableHead
            class="font-bold border text-foreground text-center"
            id="max"
          >
            {{ $t("ETFFlow.transactionCostsMaximum") }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <ListEtfRowVue
          v-for="met in etfs"
          :key="met.id"
          :etf="met"
          @edit-etf="editEtf"
          @delete-etf="deleteEtf"
        />
      </TableBody>
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
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Etf } from "@/model/etf/Etf";

import { useEtfStore } from "@/stores/EtfStore";
import { storeToRefs } from "pinia";
import { Star } from "lucide-vue-next";

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
