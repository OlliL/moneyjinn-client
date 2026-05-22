<template>
  <div data-testid="etf-desktop-table" class="hidden md:block">
    <DivContentTable class="max-w-5xl">
      <TableHeader>
        <TableRow>
          <TableHead
            class="font-bold border-r text-foreground text-center"
            rowspan="2"
            id="name"
          >
            {{ $t("General.name") }}
          </TableHead>
          <TableHead
            class="font-bold border-r text-foreground text-center"
            rowspan="2"
            id="isin"
          >
            {{ $t("ETF.isin") }}
          </TableHead>
          <TableHead
            class="font-bold border-r text-foreground text-center"
            rowspan="2"
            id="wkn"
          >
            {{ $t("ETF.wkn") }}
          </TableHead>
          <TableHead
            class="font-bold border-r text-foreground text-center"
            rowspan="2"
            id="ticker"
          >
            {{ $t("ETF.ticker") }}
          </TableHead>
          <TableHead
            class="font-bold border-r text-foreground text-center"
            colspan="3"
            id="transactionCosts"
          >
            {{ $t("ETFFlow.transactionCosts") }}
          </TableHead>
          <TableHead
            class="font-bold border-r text-foreground text-center"
            rowspan="2"
            id="partialTaxExemption"
          >
            {{ $t("ETF.partialTaxExemption") }}
          </TableHead>
          <TableHead
            class="font-bold border-r text-foreground text-center"
            rowspan="2"
            id="favorite"
          >
            <Star class="h-5 w-5 transition-all text-muted-foreground" />
          </TableHead>
          <TableHead rowspan="2" colspan="2" id="editDelete"></TableHead>
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
        <template v-if="etfs.length === 0">
          <tr data-testid="etf-empty-desktop">
            <td :colspan="12" class="text-center text-muted-foreground py-8">
              {{ $t("General.noEntries") }}
            </td>
          </tr>
        </template>
        <template v-else>
          <ListEtfRowVue
            v-for="etf in etfs"
            :key="etf.id"
            :etf="etf"
            @edit-etf="editEtf"
            @delete-etf="deleteEtf"
          />
        </template>
      </TableBody>
    </DivContentTable>
  </div>
</template>

<script lang="ts" setup>
import DivContentTable from "@/components/DivContentTable.vue";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Etf } from "@/model/etf/Etf";
import { Star } from "lucide-vue-next";
import type { PropType } from "vue";
import ListEtfRowVue from "./ListEtfRow.vue";

defineProps({
  etfs: {
    type: Array as PropType<Etf[]>,
    required: true,
  },
});

const emit = defineEmits(["deleteEtf", "editEtf"]);

const deleteEtf = (etf: Etf) => {
  emit("deleteEtf", etf);
};

const editEtf = (etf: Etf) => {
  emit("editEtf", etf);
};
</script>
