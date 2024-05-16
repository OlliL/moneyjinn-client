<template>
  <DeleteEtfFlowModalVue @etf-flow-deleted="etfFlowDeleted" ref="deleteModal" />
  <CreateEtfFlowModalVue
    @etf-flow-created="etfFlowCreated"
    @etf-flow-updated="etfFlowUpdated"
    ref="createModal"
  />
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("General.etfDepot") }}</h4>
      </div>
    </div>
    <DivError :server-errors="serverErrors" />

    <div class="row justify-content-md-center mb-12">
      <div class="col-xxl-4 col-md-7 col-xs-12" v-if="etfsLoaded">
        <div
          class="row no-gutters flex-lg-nowrap d-flex justify-content align-items-center"
        >
          <div class="col-xxl-8 col-md-8 col-xs-12 justify-content-end mb-2">
            <SelectStandard
              v-model="selectedEtf"
              :validation-schema="schema.etfId"
              id="etf"
              :field-label="$t('General.selectEtf')"
              :select-box-values="etfsSelectValues"
            />
          </div>
          <div class="col-xxl-4 col-md-4 col-xs-12 justify-content-start mb-2">
            <button
              type="button"
              class="btn btn-primary mx-2"
              @click="createEtfFlow"
            >
              {{ $t("ETFFlow.newBooking") }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="row justify-content-md-center mb-4"
      v-if="dataLoaded && etfFlows.length"
    >
      <div class="col-xxl-6 col-xl-8 col-md-11 col-xs-12">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <button
              class="nav-link active"
              @click="showEffective"
              ref="effectiveTabButton"
            >
              {{ $t("ETFFlow.effective") }}
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" @click="showAll" ref="allTabButton">
              {{ $t("General.all") }}
            </button>
          </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div
            class="tab-pane fade show active"
            id="home-tab-pane"
            ref="effectiveTab"
          >
            <table class="table table-striped table-bordered table-hover">
              <col style="width: 25%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 16%" />
              <col style="width: 14%" />
              <thead>
                <tr>
                  <th class="text-center">{{ $t("ETFFlow.bookingtime") }}</th>
                  <th class="text-center">{{ $t("ETFFlow.amount") }}</th>
                  <th class="text-center">{{ $t("ETFFlow.price") }}</th>
                  <th class="text-center">{{ $t("ETFFlow.sumprice") }}</th>
                  <th class="text-center" colspan="2"></th>
                </tr>
              </thead>
              <tbody>
                <ListEtfDepotRowVue
                  v-for="etfFlow in etfEffectiveFlows"
                  :key="etfFlow.etfflowid"
                  :flow="etfFlow"
                  :etfName="etf.name"
                  @delete-etf-flow="deleteEtfFlow"
                  @edit-etf-flow="editEtfFlow"
                />
                <tr>
                  <td class="text-end">&sum;</td>
                  <td class="text-end">
                    <u>{{ etfEffectiveFlowAmountSumString }}</u>
                  </td>
                  <td class="text-end">
                    <u
                      ><SpanAmount
                        :amount="etfEffectiveFlowPriceAvg"
                        :decimal-places="4"
                    /></u>
                  </td>
                  <td class="text-end">
                    <u
                      ><SpanAmount :amount="etfEffectiveFlowAmountPriceSum"
                    /></u>
                  </td>
                  <td colspan="2"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="tab-pane fade" id="profile-tab-pane" ref="allTab">
            <table class="table table-striped table-bordered table-hover">
              <col style="width: 25%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 16%" />
              <col style="width: 14%" />
              <thead>
                <tr>
                  <th class="text-center">{{ $t("ETFFlow.bookingtime") }}</th>
                  <th class="text-center">{{ $t("ETFFlow.amount") }}</th>
                  <th class="text-center">{{ $t("ETFFlow.price") }}</th>
                  <th class="text-center">{{ $t("ETFFlow.sumprice") }}</th>
                  <th class="text-center" colspan="2"></th>
                </tr>
              </thead>
              <tbody>
                <ListEtfDepotRowVue
                  v-for="etfFlow in etfFlows"
                  :key="etfFlow.etfflowid"
                  :flow="etfFlow"
                  :etfName="etf.name"
                  @delete-etf-flow="deleteEtfFlow"
                  @edit-etf-flow="editEtfFlow"
                />
                <tr>
                  <td class="text-end">&sum;</td>
                  <td class="text-end">
                    <u>{{ etfFlowAmountSumString }}</u>
                  </td>
                  <td class="text-end">
                    <u
                      ><SpanAmount
                        :amount="etfFlowPriceAvg"
                        :decimal-places="4"
                    /></u>
                  </td>
                  <td class="text-end">
                    <u><SpanAmount :amount="etfFlowAmountPriceSum" /></u>
                  </td>
                  <td colspan="2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <ListEtfDepotSummary :etfSummary="etfSummary" v-if="etfFlows.length > 0" />

    <CalcEtfSaleForm
      :etf="etf"
      :etfSummary="etfSummary"
      :pieces="calcEtfSalePieces"
      v-if="etfFlows.length > 0"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import router, { Routes } from "@/router";
import { useI18n } from "vue-i18n";
import { number } from "zod";

import CalcEtfSaleForm from "@/components/etf/CalcEtfSaleForm.vue";
import CreateEtfFlowModalVue from "@/components/etf/CreateEtfFlowModal.vue";
import DeleteEtfFlowModalVue from "@/components/etf/DeleteEtfFlowModal.vue";
import ListEtfDepotRowVue from "@/components/etf/ListEtfDepotRow.vue";
import SelectStandard from "@/components/SelectStandard.vue";
import SpanAmount from "@/components/SpanAmount.vue";

import { formatNumber } from "@/tools/views/FormatNumber";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";

import type { Etf } from "@/model/etf/Etf";
import type { EtfDepot } from "@/model/etf/EtfDepot";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import type { SelectBoxValue } from "@/model/SelectBoxValue";

import EtfControllerHandler from "@/handler/EtfControllerHandler";
import CrudEtfControllerHandler from "@/handler/CrudEtfControllerHandler";
import DivError from "@/components/DivError.vue";
import ListEtfDepotSummary from "@/components/etf/ListEtfDepotSummary.vue";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

const schema = {
  etfId: number(globErr(t("ETFFlow.validation.etfId"))).gt(0),
};
const etfsLoaded = ref(false);
const dataLoaded = ref(false);
const etfFlows = ref({} as Array<EtfFlow>);
const etfEffectiveFlows = ref({} as Array<EtfFlow>);
const etfs = ref({} as Array<Etf>);
const etfSummary = ref({} as EtfSummary);
const etfsSelectValues = ref({} as Array<SelectBoxValue>);
const etf = ref({} as Etf);

const selectedEtf = ref(undefined as number | undefined);
const calcEtfSalePieces = ref(0 as number | undefined);

const effectiveTabButton = ref();
const allTabButton = ref();
const effectiveTab = ref();
const allTab = ref();
const deleteModal = ref();
const createModal = ref();

const props = defineProps({
  etfId: {
    type: String,
    default: undefined,
  },
});

onMounted(() => {
  const etfId: number | undefined = props.etfId ? +props.etfId : undefined;
  loadEtfs(etfId);
});

const etfEffectiveFlowAmountSum = computed(() => {
  return etfEffectiveFlows.value.reduce((a, b) => a + (b["amount"] || 0), 0);
});

const etfEffectiveFlowAmountPriceSum = computed(() => {
  return etfEffectiveFlows.value.reduce(
    (a, b) => a + (b["amount"] * b["price"] || 0),
    0,
  );
});

const etfEffectiveFlowAmountSumString = computed(() => {
  return formatNumber(etfEffectiveFlowAmountSum.value, 5);
});

const etfEffectiveFlowPriceAvg = computed(() => {
  return etfEffectiveFlowAmountPriceSum.value / etfEffectiveFlowAmountSum.value;
});

const etfFlowAmountSum = computed(() => {
  return etfFlows.value.reduce((a, b) => a + (b["amount"] || 0), 0);
});

const etfFlowAmountPriceSum = computed(() => {
  return etfFlows.value.reduce(
    (a, b) => a + (b["amount"] * b["price"] || 0),
    0,
  );
});

const etfFlowAmountSumString = computed(() => {
  return formatNumber(etfFlowAmountSum.value, 5);
});

const etfFlowPriceAvg = computed(() => {
  return etfFlowAmountPriceSum.value / etfFlowAmountSum.value;
});

const loadEtfs = (etfId?: number) => {
  serverErrors.value = new Array<string>();
  etfsLoaded.value = false;
  etfsSelectValues.value = new Array<SelectBoxValue>();
  CrudEtfControllerHandler.fetchAllEtf()
    .then((response) => {
      etfs.value = response;
      let favoriteEtfId;
      for (let etf of response) {
        etfsSelectValues.value.push({ id: etf.id, value: etf.name });
        if (etf.isFavorite) favoriteEtfId = etf.id;
      }

      if (etfId !== undefined) {
        selectedEtf.value = etfId;
      } else if (favoriteEtfId !== undefined) {
        selectedEtf.value = favoriteEtfId;
      }

      etfsLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

const loadData = (etfId: number) => {
  serverErrors.value = new Array<string>();
  dataLoaded.value = false;
  etfFlows.value = new Array<EtfFlow>();
  etfEffectiveFlows.value = new Array<EtfFlow>();

  EtfControllerHandler.listEtfFlowsById(etfId)
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
  etf.value = {} as Etf;
  for (let _etf of etfs.value) {
    if (_etf.id == etfId) {
      etf.value = _etf;
      break;
    }
  }

  etfSummary.value = etfDepot.etfSummary ?? ({} as EtfSummary);
  etfSummary.value.name = undefined;

  calcEtfSalePieces.value = etfDepot.calcEtfSalePieces;

  if (etfDepot.etfFlows) {
    etfFlows.value = etfDepot.etfFlows;
  }
  if (etfDepot.etfEffectiveFlows) {
    etfEffectiveFlows.value = etfDepot.etfEffectiveFlows;
  }

  dataLoaded.value = true;
};

const showEffective = () => {
  const effectiveTabButtonClassList = (effectiveTabButton.value as HTMLElement)
    .classList;
  const allTabButtonClassList = (allTabButton.value as HTMLElement).classList;
  const effectiveTabClassList = (effectiveTab.value as HTMLElement).classList;
  const allTabClassList = (allTab.value as HTMLElement).classList;
  const active = "active";
  const show = "show";
  const fade = "fade";

  allTabButtonClassList.remove(active);
  allTabClassList.add(fade);
  allTabClassList.remove(show, active);

  effectiveTabButtonClassList.add(active);
  effectiveTabClassList.remove(fade);
  effectiveTabClassList.add(show, active);
};

const showAll = () => {
  const effectiveTabButtonClassList = (effectiveTabButton.value as HTMLElement)
    .classList;
  const allTabButtonClassList = (allTabButton.value as HTMLElement).classList;
  const effectiveTabClassList = (effectiveTab.value as HTMLElement).classList;
  const allTabClassList = (allTab.value as HTMLElement).classList;
  const active = "active";
  const show = "show";
  const fade = "fade";

  effectiveTabButtonClassList.remove(active);
  effectiveTabClassList.add(fade);
  effectiveTabClassList.remove(show, active);

  allTabButtonClassList.add(active);
  allTabClassList.remove(fade);
  allTabClassList.add(show, active);
};

const deleteEtfFlow = (etfFlow: EtfFlow, etfName: string) => {
  (deleteModal.value as typeof DeleteEtfFlowModalVue)._show(etfFlow, etfName);
};
const etfFlowDeleted = (etfFlow: EtfFlow) => {
  // reload because effective/all logic happens on server
  loadData(etfFlow.etfId);
};

const createEtfFlow = () => {
  createModal.value._show(etfs.value, null, selectedEtf.value);
};
const etfFlowCreated = (etfFlow: EtfFlow) => {
  // reload because effective/all logic happens on server
  loadData(etfFlow.etfId);
};

const editEtfFlow = (etfFlow: EtfFlow) => {
  createModal.value._show(etfs.value, etfFlow);
};
const etfFlowUpdated = (etfFlow: EtfFlow) => {
  // reload because effective/all logic happens on server
  loadData(etfFlow.etfId);
};

watch(
  selectedEtf,
  (newVal, oldVal) => {
    if (oldVal != selectedEtf.value && newVal !== undefined) {
      loadData(newVal);
    }
  },
  { immediate: true },
);

const routerPush = () => {
  if ((selectedEtf.value || "") != (props.etfId || "")) {
    router.push({
      name: Routes.ListEtfDepot,
      params: { etfId: selectedEtf.value },
    });
  }
};
</script>
