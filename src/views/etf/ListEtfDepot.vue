<template>
  <DeleteEtfFlowModalVue @etf-flow-deleted="etfFlowDeleted" ref="deleteModal" />
  <CreateEtfFlowModalVue
    @etf-flow-created="etfFlowCreated"
    @etf-flow-updated="etfFlowUpdated"
    ref="createModal"
  />
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("General.etfDepot") }}</h4>
    </div>
    <DivError :server-errors="serverErrors" />

    <div class="flex justify-center">
      <div class="w-full max-w-md">
        <div class="grid gap-3 md:grid-cols-12 items-top">
          <div class="md:col-span-8">
            <SelectStandard
              v-model="selectedEtfId"
              :validation-schema="schema.etfId"
              id="etf"
              :field-label="$t('General.selectEtf')"
              :select-box-values="getAsSelectBoxValues()"
            />
          </div>
          <div class="md:col-span-4 mt-5">
            <Button type="button" @click="createEtfFlow">
              <Plus class="mr-2 h-4 w-4" />
              {{ $t("ETFFlow.newBooking") }}
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center" v-if="dataLoaded && etfFlows.length">
      <div class="w-full max-w-3xl">
        <Tabs v-model="currentTab" class="w-full">
          <TabsList
            class="flex bg-muted h-10 p-1 justify-start rounded-sm w-full border shadow-sm"
          >
            <TabsTrigger
              v-if="etfEffectiveFlows.length > 0"
              value="effective"
              class="px-4 py-1.5 h-full bg-transparent transition-all font-medium text-sm text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-background data-[state=active]:shadow-sm first:rounded-l-sm last:rounded-r-sm cursor-pointer"
            >
              {{ $t("ETFFlow.effective") }}
            </TabsTrigger>

            <TabsTrigger
              value="all"
              class="px-4 py-1.5 h-full bg-transparent transition-all font-medium text-sm text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-background data-[state=active]:shadow-sm first:rounded-l-sm last:rounded-r-sm cursor-pointer"
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
                class="[&_tr:nth-child(even)]:bg-primary/7 [&_td]:!py-1 [&_th]:!py-1"
              >
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col" class="w-30/100 text-center">
                      {{ $t("ETFFlow.bookingtime") }}
                    </TableHead>
                    <TableHead
                      scope="col"
                      class="w-16/100 border-l text-center"
                    >
                      {{ $t("ETFFlow.amount") }}
                    </TableHead>
                    <TableHead
                      scope="col"
                      class="w-16/100 border-l text-center"
                    >
                      {{ $t("ETFFlow.price") }}
                    </TableHead>
                    <TableHead
                      scope="col"
                      class="w-16/100 border-l text-center"
                    >
                      {{ $t("ETFFlow.sumprice") }}
                    </TableHead>
                    <TableHead
                      scope="col"
                      class="w-12/100 border-l text-center"
                    >
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
                    :etfName="selectedEtf.name"
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
                      <u
                        ><SpanAmount :amount="etfEffectiveFlowAmountPriceSum"
                      /></u>
                    </TableCell>
                    <TableCell class="p-2 text-right">
                      <u
                        ><SpanAmount
                          :amount="
                            etfEffectiveFlowAccumulatedPreliminaryLumpSum
                          "
                          :decimal-places="3"
                      /></u>
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
                class="[&_tr:nth-child(even)]:bg-primary/7 [&_td]:!py-1 [&_th]:!py-1"
              >
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col" class="w-30/100 text-center">
                      {{ $t("ETFFlow.bookingtime") }}
                    </TableHead>
                    <TableHead
                      scope="col"
                      class="w-20/100 border-l text-center"
                    >
                      {{ $t("ETFFlow.amount") }}
                    </TableHead>
                    <TableHead
                      scope="col"
                      class="w-20/100 border-l text-center"
                    >
                      {{ $t("ETFFlow.price") }}
                    </TableHead>
                    <TableHead
                      scope="col"
                      class="w-20/100 border-l text-center"
                    >
                      {{ $t("ETFFlow.sumprice") }}
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
                    v-for="etfFlow in etfFlows"
                    :key="etfFlow.etfflowid"
                    :flow="etfFlow"
                    :etfName="selectedEtf.name"
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
                        ><SpanAmount
                          :amount="etfFlowPriceAvg"
                          :decimal-places="4"
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
    </div>

    <ListEtfDepotSummary
      :etfSummary="etfSummary"
      v-if="etfEffectiveFlows.length > 0"
    />

    <CalcEtfSaleForm
      :etf="selectedEtf"
      :etfSummary="etfSummary"
      :pieces="calcEtfSalePieces"
      v-if="etfEffectiveFlows.length > 0"
    />
  </div>
</template>

<script lang="ts" setup>
import DivError from "@/components/DivError.vue";
import CalcEtfSaleForm from "@/components/etf/CalcEtfSaleForm.vue";
import CreateEtfFlowModalVue from "@/components/etf/CreateEtfFlowModal.vue";
import DeleteEtfFlowModalVue from "@/components/etf/DeleteEtfFlowModal.vue";
import ListEtfDepotRowVue from "@/components/etf/ListEtfDepotRow.vue";
import ListEtfDepotSummary from "@/components/etf/ListEtfDepotSummary.vue";
import SelectStandard from "@/components/SelectStandard.vue";
import SpanAmount from "@/components/SpanAmount.vue";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Etf } from "@/model/etf/Etf";
import type { EtfDepot } from "@/model/etf/EtfDepot";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import router, { Routes } from "@/router";
import EtfService from "@/service/EtfService";
import { useEtfStore } from "@/stores/EtfStore";
import { formatNumber } from "@/tools/views/FormatNumber";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";
import { Plus } from "lucide-vue-next";
import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { number } from "zod";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

const schema = {
  etfId: number(globErr(t("ETFFlow.validation.etfId"))).gt(0),
};
const dataLoaded = ref(false);
const etfFlows = ref({} as Array<EtfFlow>);
const etfEffectiveFlows = ref({} as Array<EtfFlow>);
const etfSummary = ref({} as EtfSummary);
const selectedEtf = ref({} as Etf);
const selectedEtfId = ref(undefined as number | undefined);

const calcEtfSalePieces = ref(0 as number | undefined);
const currentTab = ref<"effective" | "all">("all");
const deleteModal = useTemplateRef<typeof DeleteEtfFlowModalVue>("deleteModal");
const createModal = useTemplateRef<typeof CreateEtfFlowModalVue>("createModal");

const { getAsSelectBoxValues, getFavoriteEtf, getEtf } = useEtfStore();

const props = defineProps({
  etfId: {
    type: String,
    default: undefined,
  },
});

onMounted(() => {
  const etfId: number | undefined = props.etfId ? +props.etfId : undefined;
  const favoriteEtf = getFavoriteEtf();
  if (etfId !== undefined) {
    selectedEtfId.value = etfId;
  } else if (favoriteEtf !== undefined) {
    selectedEtfId.value = favoriteEtf.id;
  }
});

const etfEffectiveFlowAmountSum = computed(() => {
  return etfEffectiveFlows.value.reduce((a, b) => a + (b["amount"] || 0), 0);
});

const partial = computed(() => {
  return (
    100 -
    (selectedEtfId.value
      ? (getEtf(Number(selectedEtfId.value))?.partialTaxExemption ?? 0)
      : 0)
  );
});
const etfEffectiveFlowAccumulatedPreliminaryLumpSum = computed(() => {
  return etfEffectiveFlows.value.reduce(
    (a, b) =>
      a + ((b["accumulatedPreliminaryLumpSum"] * partial.value) / 100 || 0),
    0,
  );
});

const etfEffectiveFlowAmountPriceSum = computed(() => {
  return etfEffectiveFlows.value.reduce(
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
  return etfFlows.value.reduce((a, b) => a + (b["amount"] || 0), 0);
});

const etfFlowBuyAmountSum = computed(() => {
  return etfFlows.value.reduce(
    (a, b) => a + (b["amount"] > 0 ? b["amount"] || 0 : 0),
    0,
  );
});

const etfFlowAmountPriceSum = computed(() => {
  return etfFlows.value.reduce(
    (a, b) => a + (b["amount"] * b["price"] || 0),
    0,
  );
});

const etfFlowBuyAmountPriceSum = computed(() => {
  return etfFlows.value.reduce(
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

const loadData = (etfId: number) => {
  serverErrors.value = new Array<string>();
  dataLoaded.value = false;
  etfFlows.value = new Array<EtfFlow>();
  etfEffectiveFlows.value = new Array<EtfFlow>();

  EtfService.listEtfFlowsById(etfId)
    .then((etfDepot) => {
      handleServerResponse(etfDepot, etfId);
      routerPush();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
      routerPush();
    });
};

const handleServerResponse = (etfDepot: EtfDepot, etfId: number) => {
  selectedEtf.value = getEtf(etfId) ?? ({} as Etf);

  etfSummary.value = etfDepot.etfSummary ?? ({} as EtfSummary);
  etfSummary.value.name = undefined;

  calcEtfSalePieces.value = etfDepot.calcEtfSalePieces;

  if (etfDepot.etfFlows) {
    etfFlows.value = etfDepot.etfFlows;
  }
  if (etfDepot.etfEffectiveFlows) {
    etfEffectiveFlows.value = etfDepot.etfEffectiveFlows;
  }

  currentTab.value = etfEffectiveFlows.value.length > 0 ? "effective" : "all";

  dataLoaded.value = true;
};

const deleteEtfFlow = (etfFlow: EtfFlow, etfName: string) => {
  deleteModal.value?._show(etfFlow, etfName);
};
const etfFlowDeleted = (etfFlow: EtfFlow) => {
  loadData(etfFlow.etfId);
};

const createEtfFlow = () => {
  createModal.value?._show(null, selectedEtfId.value);
};
const etfFlowCreated = (etfFlow: EtfFlow) => {
  loadData(etfFlow.etfId);
};

const editEtfFlow = (etfFlow: EtfFlow) => {
  createModal.value?._show(etfFlow);
};
const etfFlowUpdated = (etfFlow: EtfFlow) => {
  loadData(etfFlow.etfId);
};

watch(
  selectedEtfId,
  (newVal, oldVal) => {
    if (oldVal != selectedEtfId.value && newVal !== undefined) {
      loadData(newVal);
    }
  },
  { immediate: true },
);

const routerPush = () => {
  if ((selectedEtfId.value || "") != (props.etfId || "")) {
    router.push({
      name: Routes.ListEtfDepot,
      params: { etfId: selectedEtfId.value },
    });
  }
};
</script>
