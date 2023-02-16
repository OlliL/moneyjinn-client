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
        <h4>ETF Depot</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-12">
        <button
          type="button"
          class="btn btn-primary mx-2"
          @click="createEtfFlow"
        >
          neue Buchung
        </button>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4" v-if="dataLoaded">
      <div class="col-md-8 col-xs-12">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <button
              class="nav-link active"
              @click="showEffective"
              ref="effectiveTabButton"
            >
              wirksam
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" @click="showAll" ref="allTabButton">
              alle
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
                  <th class="text-center">Name</th>
                  <th class="text-center">Buchungsdatum</th>
                  <th class="text-center">Anteile</th>
                  <th class="text-center">St&uuml;ck</th>
                  <th class="text-center">Bezahlt</th>
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
                  <th class="text-center">Name</th>
                  <th class="text-center">Buchungsdatum</th>
                  <th class="text-center">Anteile</th>
                  <th class="text-center">St&uuml;ck</th>
                  <th class="text-center">Bezahlt</th>
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
    <div class="row justify-content-md-center" v-if="dataLoaded">
      <div class="col-xs-12 mb-4">
        <h4>Verkauf berechnen</h4>
      </div>
    </div>

    <form
      @submit.prevent="calculateEtfSale"
      v-if="dataLoaded"
      id="calculateEtfSaleForm"
    >
      <div class="row justify-content-md-center">
        <div class="col-md-8 col-xs-12 mb-4">
          <div class="card w-100 bg-light">
            <div class="card-body">
              <div class="container-fluid">
                <DivError :server-errors="serverErrors" />
                <div class="row no-gutters flex-lg-nowrap mb-4">
                  <div class="col-md-4 col-xs-12">
                    <SelectStandard
                      v-model="calcEtfSaleIsin"
                      :validation-schema="schema.isin"
                      id="etf"
                      field-label="ETF"
                      :select-box-values="etfsSelectValues"
                    />
                  </div>
                  <div class="col-md-2 col-xs-12">
                    <InputStandard
                      v-model="calcEtfSalePieces"
                      :validation-schema="schema.pieces"
                      id="calcEtfSalePieces"
                      field-type="number"
                      step="0.01"
                      field-label="Stück"
                    />
                  </div>
                  <div class="col-md-2 col-xs-12">
                    <InputStandard
                      v-model="calcEtfBidPrice"
                      :validation-schema="schema.bidPrice"
                      id="calcEtfBidPrice"
                      field-type="number"
                      step="0.01"
                      field-label="Verkauf"
                    >
                      <template #icon
                        ><span class="input-group-text"
                          ><i class="bi bi-currency-euro"></i></span
                      ></template>
                    </InputStandard>
                  </div>
                  <div class="col-md-2 col-xs-12">
                    <InputStandard
                      v-model="calcEtfAskPrice"
                      :validation-schema="schema.askPrice"
                      id="calcEtfAskPrice"
                      field-type="number"
                      step="0.01"
                      field-label="Einkauf"
                    >
                      <template #icon
                        ><span class="input-group-text"
                          ><i class="bi bi-currency-euro"></i></span
                      ></template>
                    </InputStandard>
                  </div>
                  <div class="col-md-2 col-xs-12">
                    <InputStandard
                      v-model="calcEtfTransactionCosts"
                      :validation-schema="schema.transactionCosts"
                      id="calcEtfTransactionCosts"
                      field-type="number"
                      step="0.01"
                      field-label="Transaktionskosten"
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
                      button-label="berechnen"
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
    <div class="row justify-content-md-center" v-if="calcResults.isin">
      <div class="col-md-3 col-xs-12 mb-4">
        <table class="table table-striped table-bordered table-hover">
          <col style="width: 70%" />
          <col style="width: 30%" />
          <tbody>
            <tr>
              <th class="text-start">zu verkaufende Stück</th>
              <td class="text-end">{{ calcResults.pieces }}</td>
            </tr>
            <tr>
              <th class="text-start">ursprünglicher Kaufpreis</th>
              <td class="text-end">
                <SpanAmount :amount="calcResults.originalBuyPrice" />
              </td>
            </tr>
            <tr>
              <th class="text-start">Verkaufspreis</th>
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
              <th class="text-start">Gewinn</th>
              <td class="text-end">
                <SpanAmount :amount="calcResults.profit" />
              </td>
            </tr>
            <tr>
              <th class="text-start">davon steuerlich relevant</th>
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
              <th class="text-start">neuer Kaufpreis</th>
              <td class="text-end">
                <SpanAmount :amount="calcResults.newBuyPrice" />
              </td>
            </tr>
            <tr>
              <th class="text-start">Wiederkaufverlust</th>
              <td class="text-end">
                <SpanAmount :amount="calcResults.rebuyLosses" />
              </td>
            </tr>
            <tr>
              <th class="text-start">Transaktionskosten</th>
              <td class="text-end">
                <SpanAmount :amount="calcResults.transactionCosts" />
              </td>
            </tr>
            <tr>
              <th class="text-start">Gesamtkosten</th>
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
import { computed, onMounted, ref } from "vue";
import { string } from "zod";

import ButtonSubmit from "@/components/ButtonSubmit.vue";
import CreateEtfFlowModalVue from "@/components/etf/CreateEtfFlowModal.vue";
import DeleteEtfFlowModalVue from "@/components/etf/DeleteEtfFlowModal.vue";
import InputStandard from "@/components/InputStandard.vue";
import ListEtfDepotRowVue from "@/components/etf/ListEtfDepotRow.vue";
import SelectStandard from "@/components/SelectStandard.vue";
import SpanAmount from "@/components/SpanAmount.vue";
import type { ListDepotRowData } from "@/components/etf/ListDepotRowData";

import { formatNumber } from "@/tools/views/FormatNumber";
import { handleServerError } from "@/tools/views/ThrowError";
import { amountSchema, globErr } from "@/tools/views/ZodUtil";

import type { Etf } from "@/model/etf/Etf";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import type { EtfSalesCalculation } from "@/model/etf/EtfSalesCalculation";
import type { SelectBoxValue } from "@/model/SelectBoxValue";

import EtfControllerHandler from "@/handler/EtfControllerHandler";
import DivError from "@/components/DivError.vue";

const serverErrors = ref(new Array<string>());

const schema = {
  isin: string(globErr("Bitte ETF angeben!")),
  pieces: amountSchema("Bitte Stück angeben!"),
  askPrice: amountSchema("Bitte Einkauf angeben!"),
  bidPrice: amountSchema("Bitte Verkauf angeben!"),
  transactionCosts: amountSchema("Bitte Transaktionskosten angeben!"),
};
const dataLoaded = ref(false);
const etfFlows = ref({} as Array<ListDepotRowData>);
const etfEffectiveFlows = ref({} as Array<ListDepotRowData>);
const etfs = ref({} as Array<Etf>);
const etfsSelectValues = ref({} as Array<SelectBoxValue>);

const calcEtfAskPrice = ref(0);
const calcEtfBidPrice = ref(0);
const calcEtfSaleIsin = ref("");
const calcEtfSalePieces = ref(0);
const calcEtfTransactionCosts = ref(0);
const calcResults = ref({} as EtfSalesCalculation);

const effectiveTabButton = ref();
const allTabButton = ref();
const effectiveTab = ref();
const allTab = ref();
const deleteModal = ref();
const createModal = ref();

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
    0
  );
});

const etfEffectiveFlowAmountSumString = computed(() => {
  return formatNumber(etfEffectiveFlowAmountSum.value, 3);
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
    0
  );
});

const etfFlowAmountSumString = computed(() => {
  return formatNumber(etfFlowAmountSum.value, 3);
});

const etfFlowPriceAvg = computed(() => {
  return etfFlowAmountPriceSum.value / etfFlowAmountSum.value;
});

const loadData = () => {
  dataLoaded.value = false;
  etfFlows.value = new Array<ListDepotRowData>();
  etfEffectiveFlows.value = new Array<ListDepotRowData>();
  etfs.value = new Array<Etf>();
  etfsSelectValues.value = new Array<SelectBoxValue>();

  EtfControllerHandler.listEtfFlows().then((etfDepot) => {
    if (etfDepot.etfs) {
      for (let etf of etfDepot.etfs) {
        etfsSelectValues.value.push({ id: etf.isin, value: etf.name });
      }
      etfs.value = etfDepot.etfs;
      calcEtfAskPrice.value = etfDepot.calcEtfAskPrice
        ? etfDepot.calcEtfAskPrice
        : 0;
      calcEtfBidPrice.value = etfDepot.calcEtfBidPrice
        ? etfDepot.calcEtfBidPrice
        : 0;
      calcEtfSaleIsin.value = etfDepot.calcEtfSaleIsin
        ? etfDepot.calcEtfSaleIsin
        : "";
      calcEtfSalePieces.value = etfDepot.calcEtfSalePieces
        ? etfDepot.calcEtfSalePieces
        : 0;
      calcEtfTransactionCosts.value = etfDepot.calcEtfTransactionCosts
        ? etfDepot.calcEtfTransactionCosts
        : 0;
      const etfMap = new Map<String, Etf>();
      for (let etf of etfDepot.etfs) {
        etfMap.set(etf.isin, etf);
      }
      if (etfDepot.etfFlows) {
        for (let etfFlow of etfDepot.etfFlows) {
          const etf = etfMap.get(etfFlow.isin);
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
          const etf = etfMap.get(etfFlow.isin);
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
    Object.keys(values).forEach((field) => setFieldTouched(field, false));
  });
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
  EtfControllerHandler.calcEtfSale(
    calcEtfSaleIsin.value,
    calcEtfSalePieces.value,
    calcEtfBidPrice.value,
    calcEtfAskPrice.value,
    calcEtfTransactionCosts.value
  ).then((_calcResults) => {
    calcResults.value = _calcResults;
    handleServerError(calcResults.value.validationResult, serverErrors);
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
  createModal.value._show(etfs.value);
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
</script>
