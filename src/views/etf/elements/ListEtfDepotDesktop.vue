<template>
  <div
    data-testid="etf-depot-desktop-table"
    class="hidden md:block w-full max-w-3xl"
  >
    <Tabs
      :model-value="currentTab"
      class="w-full"
      @update:model-value="updateTab"
    >
      <TabsList
        class="flex bg-muted h-10 p-1 justify-start rounded-sm w-full border"
      >
        <TabsTrigger
          v-if="etfEffectiveFlows.length > 0"
          data-testid="etf-depot-tab-effective"
          value="effective"
          class="px-4 py-1.5 h-full bg-transparent transition-all font-medium text-sm text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-background first:rounded-l-sm last:rounded-r-sm cursor-pointer"
        >
          {{ $t("ETFFlow.effective") }}
        </TabsTrigger>

        <TabsTrigger
          data-testid="etf-depot-tab-all"
          value="all"
          class="px-4 py-1.5 h-full bg-transparent transition-all font-medium text-sm text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-background first:rounded-l-sm last:rounded-r-sm cursor-pointer"
        >
          {{ $t("General.all") }}
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="effective"
        class="focus-visible:outline-none focus-visible:ring-0"
      >
        <div class="rounded-sm border bg-card overflow-hidden">
          <Table
            class="[&_tr:nth-child(even)]:bg-muted [&_td]:!py-1 [&_th]:!py-1"
          >
            <TableHeader>
              <TableRow>
                <TableHead class="table-head-cell w-30/100">
                  {{ $t("ETFFlow.bookingtime") }}
                </TableHead>
                <TableHead class="table-head-cell w-16/100">
                  {{ $t("ETFFlow.amount") }}
                </TableHead>
                <TableHead class="table-head-cell w-16/100">
                  {{ $t("ETFFlow.price") }}
                </TableHead>
                <TableHead class="table-head-cell w-16/100">
                  {{ $t("ETFFlow.sumprice") }}
                </TableHead>
                <TableHead class="table-head-cell w-12/100">
                  {{ $t("ETFFlow.preliminaryLumpSum") }}
                </TableHead>
                <TableHead
                  scope="col"
                  class="w-10/100 border-l p-2 text-center"
                  colspan="2"
                ></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <ListEtfDepotRowVue
                v-for="etfFlow in etfEffectiveFlows"
                :key="etfFlow.etfflowid"
                :flow="etfFlow"
                :etfName="selectedEtfName"
                :show-lump-sum="true"
                @delete-etf-flow="deleteEtfFlow"
                @edit-etf-flow="editEtfFlow"
              />
              <TableRow class="border-t">
                <TableCell class="p-2 text-right">&sum;</TableCell>
                <TableCell class="p-2 text-right">
                  <u>{{ etfEffectiveFlowAmountSumString }}</u>
                </TableCell>
                <TableCell class="p-2 text-right">
                  <u
                    ><SpanAmount
                      :amount="etfEffectiveFlowPriceAvg"
                      :decimal-places="4"
                  /></u>
                </TableCell>
                <TableCell class="p-2 text-right">
                  <u><SpanAmount :amount="etfEffectiveFlowAmountPriceSum" /></u>
                </TableCell>
                <TableCell class="p-2 text-right">
                  <u>
                    <SpanAmount
                      :amount="etfEffectiveFlowAccumulatedPreliminaryLumpSum"
                      :decimal-places="3"
                    />
                  </u>
                </TableCell>
                <TableCell colspan="2"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      <TabsContent
        value="all"
        class="focus-visible:outline-none focus-visible:ring-0"
      >
        <div class="rounded-sm border bg-card overflow-hidden">
          <Table
            class="[&_tr:nth-child(even)]:bg-muted [&_td]:!py-1 [&_th]:!py-1"
          >
            <TableHeader>
              <TableRow>
                <TableHead class="table-head-cell w-30/100">
                  {{ $t("ETFFlow.bookingtime") }}
                </TableHead>
                <TableHead class="table-head-cell w-20/100">
                  {{ $t("ETFFlow.amount") }}
                </TableHead>
                <TableHead class="table-head-cell w-20/100">
                  {{ $t("ETFFlow.price") }}
                </TableHead>
                <TableHead class="table-head-cell w-20/100">
                  {{ $t("ETFFlow.sumprice") }}
                </TableHead>
                <TableHead
                  class="table-head-cell w-10/100"
                  colspan="2"
                ></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <ListEtfDepotRowVue
                v-for="etfFlow in etfFlows"
                :key="etfFlow.etfflowid"
                :flow="etfFlow"
                :show-lump-sum="false"
                @delete-etf-flow="deleteEtfFlow"
                @edit-etf-flow="editEtfFlow"
              />
              <TableRow class="border-t">
                <TableCell class="p-2 text-right">&sum;</TableCell>
                <TableCell class="p-2 text-right">
                  <u>{{ etfFlowAmountSumString }}</u>
                </TableCell>
                <TableCell class="p-2 text-right">
                  <u
                    ><SpanAmount :amount="etfFlowPriceAvg" :decimal-places="4"
                  /></u>
                </TableCell>
                <TableCell class="p-2 text-right">
                  <u><SpanAmount :amount="etfFlowAmountPriceSum" /></u>
                </TableCell>
                <TableCell colspan="2"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
import SpanAmount from "@/components/common/SpanAmount.vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import { useEtfStore } from "@/stores/EtfStore";
import { formatNumber } from "@/tools/views/FormatNumber";
import { computed, type PropType } from "vue";
import ListEtfDepotRowVue from "./ListEtfDepotRow.vue";

const props = defineProps<{
    currentTab: "effective" | "all";
    etfFlows: EtfFlow[];
    etfEffectiveFlows: EtfFlow[];
    selectedEtfId: number;
}>();

const { getEtf } = useEtfStore();
const emit = defineEmits(["update:currentTab", "deleteEtfFlow", "editEtfFlow"]);

const updateTab = (value: string | number) => {
  if (value === "effective" || value === "all") {
    emit("update:currentTab", value);
  }
};

const deleteEtfFlow = (etfFlow: EtfFlow) => {
  emit("deleteEtfFlow", etfFlow);
};

const editEtfFlow = (etfFlow: EtfFlow) => {
  emit("editEtfFlow", etfFlow);
};

const selectedEtfName = computed(
  () => getEtf(Number(props.selectedEtfId))?.name,
);

const etfEffectiveFlowAmountSum = computed(() => {
  return props.etfEffectiveFlows.reduce((a, b) => a + (b["amount"] || 0), 0);
});

const partial = computed(() => {
  return (
    100 -
    (props.selectedEtfId
      ? (getEtf(Number(props.selectedEtfId))?.partialTaxExemption ?? 0)
      : 0)
  );
});
const etfEffectiveFlowAccumulatedPreliminaryLumpSum = computed(() => {
  return props.etfEffectiveFlows.reduce(
    (a, b) =>
      a + ((b["accumulatedPreliminaryLumpSum"] * partial.value) / 100 || 0),
    0,
  );
});

const etfEffectiveFlowAmountPriceSum = computed(() => {
  return props.etfEffectiveFlows.reduce(
    (a, b) => a + (b["amount"] * b["price"] || 0),
    0,
  );
});

const etfEffectiveFlowAmountSumString = computed(() => {
  return formatNumber(etfEffectiveFlowAmountSum.value, 6);
});

const etfEffectiveFlowPriceAvg = computed(() => {
  return etfEffectiveFlowAmountPriceSum.value / etfEffectiveFlowAmountSum.value;
});

const etfFlowAmountSum = computed(() => {
  return props.etfFlows.reduce((a, b) => a + (b["amount"] || 0), 0);
});

const etfFlowBuyAmountSum = computed(() => {
  return props.etfFlows.reduce(
    (a, b) => a + (b["amount"] > 0 ? b["amount"] || 0 : 0),
    0,
  );
});

const etfFlowAmountPriceSum = computed(() => {
  return props.etfFlows.reduce(
    (a, b) => a + (b["amount"] * b["price"] || 0),
    0,
  );
});

const etfFlowBuyAmountPriceSum = computed(() => {
  return props.etfFlows.reduce(
    (a, b) => a + (b["amount"] > 0 ? b["amount"] * b["price"] || 0 : 0),
    0,
  );
});

const etfFlowAmountSumString = computed(() => {
  return formatNumber(etfFlowAmountSum.value, 6);
});

const etfFlowPriceAvg = computed(() => {
  return etfFlowBuyAmountPriceSum.value / etfFlowBuyAmountSum.value;
});
</script>
