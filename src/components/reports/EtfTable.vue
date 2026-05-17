<template>
  <DivError :server-errors="serverErrors" />
  <div class="flex justify-center py-4" v-if="dataLoaded && etfSummaryReceived">
    <div class="w-full max-w-7xl">
      <div class="rounded-sm border">
        <div class="border-b p-3 text-center">
          <h4 class="font-semibold">{{ $t("General.etf") }}</h4>
        </div>
        <div class="p-4">
          <div class="overflow-x-auto text-center">
            <div class="flex flex-col rounded-md border">
              <Table class="[&_tbody_tr:nth-child(even)]:bg-primary/7">
                <TableHeader>
                  <TableRow>
                    <TableHead
                      class="font-bold border-r text-foreground text-center"
                      rowspan="2"
                      id="thEtf"
                    >
                      {{ $t("General.etf") }}
                    </TableHead>
                    <TableHead
                      class="font-bold border-r text-foreground text-center"
                      rowspan="2"
                      id="thShares"
                    >
                      {{ $t("ETFFlow.shares") }}
                    </TableHead>
                    <TableHead
                      class="text-center hidden md:table-cell"
                      colspan="3"
                      id="thAmount"
                    >
                      {{ $t("ETFFlow.amount") }}
                    </TableHead>
                    <TableHead
                      class="font-bold border-r text-foreground text-center"
                      colspan="3"
                      id="thOverall"
                    >
                      {{ $t("ETFFlow.overall") }}
                    </TableHead>
                    <TableHead
                      class="text-center hidden md:table-cell"
                      rowspan="2"
                      id="thState"
                    >
                      {{ $t("Reports.state") }}
                    </TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead
                      class="text-center hidden md:table-cell"
                      id="thAmountPayed"
                    >
                      {{ $t("ETFFlow.payed") }} &#8709;
                    </TableHead>
                    <TableHead
                      class="text-center hidden md:table-cell"
                      id="thAmountBid"
                    >
                      {{ $t("ETFFlow.bid") }}
                    </TableHead>
                    <TableHead
                      class="text-center hidden md:table-cell"
                      id="thAmountAsk"
                    >
                      {{ $t("ETFFlow.ask") }}
                    </TableHead>
                    <TableHead
                      class="font-bold border text-foreground text-center"
                      id="thOverallPayed"
                    >
                      {{ $t("ETFFlow.payed") }}
                    </TableHead>
                    <TableHead
                      class="font-bold border text-foreground text-center"
                      id="thOverallBid"
                    >
                      {{ $t("ETFFlow.bid") }}
                    </TableHead>
                    <TableHead
                      class="font-bold border text-foreground text-center"
                      id="thOverallProfit"
                    >
                      {{ $t("ETFFlow.profit") }}
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody v-if="dataLoaded">
                  <EtfTableRowVue
                    v-for="etfData in etfSummaryArray"
                    :key="etfData.etfId"
                    v-bind="etfData"
                  />
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import EtfService from "@/service/EtfService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { computed, onMounted, ref, watch } from "vue";
import DivError from "../DivError.vue";
import EtfTableRowVue from "./EtfTableRow.vue";

const serverErrors = ref(new Array<string>());

const etfSummaryArray = ref(new Array<EtfSummary>());
const dataLoaded = ref(false);

const props = defineProps({
  year: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
});

const loadData = (year: number, month: number) => {
  serverErrors.value = new Array<string>();

  dataLoaded.value = false;
  EtfService.listEtfOverview(year, month)
    .then((_etfSummeryArray) => {
      etfSummaryArray.value = _etfSummeryArray;
      dataLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

onMounted(() => {
  loadData(+props.year, +props.month);
});

watch(
  () => ({
    year: props.year,
    month: props.month,
  }),
  (data) => {
    if (data.year && data.month) loadData(+data.year, +data.month);
  },
);

const etfSummaryReceived = computed(() => {
  return etfSummaryArray.value.length > 0;
});
</script>
