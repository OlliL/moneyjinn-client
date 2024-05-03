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
    <div class="row justify-content-md-center mb-12">
      <div class="col-xxl-4 col-md-7 col-xs-12" v-if="dataLoaded">
        <div
          class="row no-gutters flex-lg-nowrap d-flex justify-content align-items-center"
        >
          <div class="col-xxl-8 col-md-8 col-xs-12 justify-content-end mb-2">
            <SelectStandard
              v-model="defaultEtfId"
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
      <div class="col-xxl-8 col-xs-12">
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
            tabindex="0"
            ref="effectiveTab"
          >
            <table class="table table-striped table-bordered table-hover">
              <col style="width: 33%" />
              <col style="width: 17%" />
              <col style="width: 10%" />
              <col style="width: 10%" />
              <col style="width: 10%" />
              <col style="width: 10%" />
              <col style="width: 10%" />
              <thead>
                <tr>
                  <th class="text-center">{{ $t("General.etf") }}</th>
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
                  @delete-etf-flow="deleteEtfFlow"
                  @edit-etf-flow="editEtfFlow"
                />
                <tr>
                  <td colspan="2" class="text-end">&sum;</td>
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
          <div
            class="tab-pane fade"
            id="profile-tab-pane"
            tabindex="0"
            ref="allTab"
          >
            <table class="table table-striped table-bordered table-hover">
              <col style="width: 33%" />
              <col style="width: 17%" />
              <col style="width: 10%" />
              <col style="width: 10%" />
              <col style="width: 10%" />
              <col style="width: 10%" />
              <col style="width: 10%" />
              <thead>
                <tr>
                  <th class="text-center">{{ $t("General.etf") }}</th>
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
                  @delete-etf-flow="deleteEtfFlow"
                  @edit-etf-flow="editEtfFlow"
                />
                <tr>
                  <td colspan="2" class="text-end">&sum;</td>
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
    <div
      class="row justify-content-md-center"
      v-if="dataLoaded && etfFlows.length"
    >
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("ETFFlow.calculateSale") }}</h4>
      </div>
    </div>

    <form
      @submit.prevent="calculateEtfSale"
      v-if="dataLoaded && etfFlows.length"
      id="calculateEtfSaleForm"
    >
      <div class="row justify-content-md-center">
        <div class="col-xxl-6 col-xs-12 mb-4">
          <div class="card w-100 bg-light">
            <div class="card-body">
              <div class="container-fluid">
                <DivError :server-errors="serverErrors" />
                <div class="row no-gutters flex-lg-nowrap mb-4">
                  <div class="col-md-3 col-xs-12">
                    <InputStandard
                      v-model="calcEtfSalePieces"
                      :validation-schema="schema.pieces"
                      id="calcEtfSalePieces"
                      field-type="number"
                      step="0.01"
                      :field-label="$t('ETFFlow.amount')"
                    />
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <InputStandard
                      v-model="calcEtfBidPrice"
                      :validation-schema="schema.bidPrice"
                      id="calcEtfBidPrice"
                      field-type="number"
                      step="0.01"
                      :field-label="$t('ETFFlow.bid')"
                    >
                      <template #icon
                        ><span class="input-group-text"
                          ><i class="bi bi-currency-euro"></i></span
                      ></template>
                    </InputStandard>
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <InputStandard
                      v-model="calcEtfAskPrice"
                      :validation-schema="schema.askPrice"
                      id="calcEtfAskPrice"
                      field-type="number"
                      step="0.01"
                      :field-label="$t('ETFFlow.ask')"
                    >
                      <template #icon
                        ><span class="input-group-text"
                          ><i class="bi bi-currency-euro"></i></span
                      ></template>
                    </InputStandard>
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <InputStandard
                      v-model="calcEtfTransactionCosts"
                      :validation-schema="schema.transactionCosts"
                      id="calcEtfTransactionCosts"
                      field-type="number"
                      step="0.01"
                      :field-label="$t('ETFFlow.transactionCosts')"
                    >
                      <template #icon
                        ><span class="input-group-text"
                          ><i class="bi bi-currency-euro"></i></span
                      ></template>
                    </InputStandard>
                  </div>
                </div>
                <div class="row no-gutters flex-lg-nowrap">
                  <div class="col-12">
                    <ButtonSubmit
                      :button-label="$t('ETFFlow.calculate')"
                      form-id="calculateEtfSaleForm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <div class="row justify-content-md-center" v-if="calcResults.etfId">
      <div class="col-xxl-3 col-md-6 col-xs-12 mb-4">
        <table class="table table-striped table-bordered table-hover">
          <col style="width: 70%" />
          <col style="width: 30%" />
          <tbody>
            <tr>
              <th class="text-start">
                {{ $t("ETFFlow.calculateResults.pieces") }}
              </th>
              <td class="text-end">{{ calcResults.pieces }}</td>
            </tr>
            <tr>
              <th class="text-start">
                {{ $t("ETFFlow.calculateResults.originalBuyPrice") }}
              </th>
              <td class="text-end">
                <SpanAmount :amount="calcResults.originalBuyPrice" />
              </td>
            </tr>
            <tr>
              <th class="text-start">
                {{ $t("ETFFlow.calculateResults.sellPrice") }}
              </th>
              <td class="text-end">
                <SpanAmount :amount="calcResults.sellPrice" />
              </td>
            </tr>
          </tbody>
        </table>
        <table class="table table-striped table-bordered table-hover">
          <col style="width: 70%" />
          <col style="width: 30%" />
          <tbody>
            <tr>
              <th class="text-start">
                {{ $t("ETFFlow.profit") }}
              </th>
              <td class="text-end">
                <SpanAmount :amount="calcResults.profit" />
              </td>
            </tr>
            <tr>
              <th class="text-start">
                {{
                  $t("ETFFlow.calculateResults.accumulatedPreliminaryLumpSum")
                }}
              </th>
              <td class="text-end">
                <SpanAmount
                  :amount="calcResults.accumulatedPreliminaryLumpSum"
                />
              </td>
            </tr>
            <tr>
              <th class="text-start">
                {{ $t("ETFFlow.calculateResults.chargeable") }}
              </th>
              <td class="text-end">
                <b><SpanAmount :amount="calcResults.chargeable" /></b>
              </td>
            </tr>
          </tbody>
        </table>
        <table class="table table-striped table-bordered table-hover">
          <col style="width: 70%" />
          <col style="width: 30%" />
          <tbody>
            <tr>
              <th class="text-start">
                {{ $t("ETFFlow.calculateResults.newBuyPrice") }}
              </th>
              <td class="text-end">
                <SpanAmount :amount="calcResults.newBuyPrice" />
              </td>
            </tr>
            <tr>
              <th class="text-start">
                {{ $t("ETFFlow.calculateResults.rebuyLosses") }}
              </th>
              <td class="text-end">
                <SpanAmount :amount="calcResults.rebuyLosses" />
              </td>
            </tr>
            <tr>
              <th class="text-start">{{ $t("ETFFlow.transactionCosts") }}</th>
              <td class="text-end">
                <SpanAmount :amount="calcResults.transactionCosts" />
              </td>
            </tr>
            <tr>
              <th class="text-start">
                {{ $t("ETFFlow.calculateResults.overallCosts") }}
              </th>
              <td class="text-end">
                <b><SpanAmount :amount="calcResults.overallCosts" /></b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { number } from "zod";

import ButtonSubmit from "@/components/ButtonSubmit.vue";
import CreateEtfFlowModalVue from "@/components/etf/CreateEtfFlowModal.vue";
import DeleteEtfFlowModalVue from "@/components/etf/DeleteEtfFlowModal.vue";
import InputStandard from "@/components/InputStandard.vue";
import ListEtfDepotRowVue from "@/components/etf/ListEtfDepotRow.vue";
import SelectStandard from "@/components/SelectStandard.vue";
import SpanAmount from "@/components/SpanAmount.vue";
import type { ListDepotRowData } from "@/components/etf/ListDepotRowData";

import { formatNumber } from "@/tools/views/FormatNumber";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { amountSchema, globErr } from "@/tools/views/ZodUtil";

import type { Etf } from "@/model/etf/Etf";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import type { EtfSalesCalculation } from "@/model/etf/EtfSalesCalculation";
import type { SelectBoxValue } from "@/model/SelectBoxValue";

import EtfControllerHandler from "@/handler/EtfControllerHandler";
import DivError from "@/components/DivError.vue";
import type { EtfDepot } from "@/model/etf/EtfDepot";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

const schema = {
  etfId: number(globErr(t("ETFFlow.validation.etfId"))).gt(0),
  pieces: amountSchema(t("ETFFlow.validation.amount")),
  askPrice: amountSchema(t("ETFFlow.validation.askPrice")),
  bidPrice: amountSchema(t("ETFFlow.validation.bidPrice")),
  transactionCosts: amountSchema(t("ETFFlow.validation.transactionCosts")),
};
const dataLoaded = ref(false);
const etfFlows = ref({} as Array<ListDepotRowData>);
const etfEffectiveFlows = ref({} as Array<ListDepotRowData>);
const etfs = ref({} as Array<Etf>);
const etfsSelectValues = ref({} as Array<SelectBoxValue>);

const calcEtfAskPrice = ref(0);
const calcEtfBidPrice = ref(0);
const defaultEtfId = ref(0);
const calcEtfSalePieces = ref(0);
const calcEtfTransactionCosts = ref(0);
const calcResults = ref({} as EtfSalesCalculation);

const effectiveTabButton = ref();
const allTabButton = ref();
const effectiveTab = ref();
const allTab = ref();
const deleteModal = ref();
const createModal = ref();
const loadedEtf = ref(-1);

const { handleSubmit, values, setFieldTouched } = useForm();

onMounted(() => {
  loadData();
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

const initView = () => {
  serverErrors.value = new Array<string>();
  dataLoaded.value = false;
  etfFlows.value = new Array<ListDepotRowData>();
  etfEffectiveFlows.value = new Array<ListDepotRowData>();
  etfs.value = new Array<Etf>();
  etfsSelectValues.value = new Array<SelectBoxValue>();
};

const loadData = () => {
  initView();

  EtfControllerHandler.listEtfFlows()
    .then((etfDepot) => {
      handleServerResponse(etfDepot);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });

  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const loadDataWithId = (etfId: number) => {
  loadedEtf.value = etfId;
  calcResults.value = {} as EtfSalesCalculation;
  initView();

  EtfControllerHandler.listEtfFlowsById(etfId)
    .then((etfDepot) => {
      handleServerResponse(etfDepot);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });

  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const handleServerResponse = (etfDepot: EtfDepot) => {
  if (etfDepot.etfs) {
    for (let etf of etfDepot.etfs) {
      etfsSelectValues.value.push({ id: etf.id, value: etf.name });
    }

    if (etfDepot.defaultEtfId != defaultEtfId.value) {
      defaultEtfId.value = etfDepot.defaultEtfId ? etfDepot.defaultEtfId : 0;
      loadedEtf.value = defaultEtfId.value;
    }

    etfs.value = etfDepot.etfs;
    calcEtfAskPrice.value = etfDepot.calcEtfAskPrice
      ? etfDepot.calcEtfAskPrice
      : 0;
    calcEtfBidPrice.value = etfDepot.calcEtfBidPrice
      ? etfDepot.calcEtfBidPrice
      : 0;
    calcEtfSalePieces.value = etfDepot.calcEtfSalePieces
      ? etfDepot.calcEtfSalePieces
      : 0;
    calcEtfTransactionCosts.value = etfDepot.calcEtfTransactionCosts
      ? etfDepot.calcEtfTransactionCosts
      : 0;
    const etfMap = new Map<number, Etf>();
    for (let etf of etfDepot.etfs) {
      etfMap.set(etf.id, etf);
    }
    if (etfDepot.etfFlows) {
      for (let etfFlow of etfDepot.etfFlows) {
        const etf = etfMap.get(etfFlow.etfId);
        if (etf)
          etfFlows.value.push({
            ...etfFlow,
            name: etf.name,
            chartUrl: etf.chartUrl,
          });
      }
    }
    if (etfDepot.etfEffectiveFlows) {
      for (let etfFlow of etfDepot.etfEffectiveFlows) {
        const etf = etfMap.get(etfFlow.etfId);
        if (etf)
          etfEffectiveFlows.value.push({
            ...etfFlow,
            name: etf.name,
            chartUrl: etf.chartUrl,
          });
      }
    }
    dataLoaded.value = true;
  }
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

const calculateEtfSale = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  EtfControllerHandler.calcEtfSale(
    defaultEtfId.value,
    calcEtfSalePieces.value,
    calcEtfBidPrice.value,
    calcEtfAskPrice.value,
    calcEtfTransactionCosts.value,
  )
    .then((_calcResults) => {
      calcResults.value = _calcResults;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});

const deleteEtfFlow = (etfFlow: EtfFlow, etfName: string) => {
  (deleteModal.value as typeof DeleteEtfFlowModalVue)._show(etfFlow, etfName);
};
const etfFlowDeleted = () => {
  // reload because effective/all logic happens on server
  loadData();
};

const createEtfFlow = () => {
  createModal.value._show(etfs.value, null, loadedEtf.value);
};
const etfFlowCreated = () => {
  // reload because effective/all logic happens on server
  loadData();
};

const editEtfFlow = (etfFlow: EtfFlow) => {
  createModal.value._show(etfs.value, etfFlow);
};
const etfFlowUpdated = () => {
  // reload because effective/all logic happens on server
  loadData();
};

watch(defaultEtfId, (newVal, oldVal) => {
  if (newVal != loadedEtf.value) {
    loadDataWithId(newVal);
  }
});
</script>
