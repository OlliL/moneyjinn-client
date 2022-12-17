<template>
  <DeleteEtfFlowModalVue @etf-flow-deleted="etfFlowDeleted" ref="deleteModal" />
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>ETF Depot</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
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
                />
                <tr>
                  <td colspan="2" class="text-end">&sum;</td>
                  <td class="text-end">
                    <u>{{ etfEffectiveFlowAmountSumString }}</u>
                  </td>
                  <td class="text-end">
                    <u>{{ etfEffectiveFlowPriceAvgString }} &euro;</u>
                  </td>
                  <td class="text-end">
                    <u>{{ etfEffectiveFlowAmountPriceSumString }} &euro;</u>
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
                />
                <tr>
                  <td colspan="2" class="text-end">&sum;</td>
                  <td class="text-end">
                    <u>{{ etfFlowAmountSumString }}</u>
                  </td>
                  <td class="text-end">
                    <u>{{ etfFlowPriceAvgString }} &euro;</u>
                  </td>
                  <td class="text-end">
                    <u>{{ etfFlowAmountPriceSumString }} &euro;</u>
                  </td>
                  <td colspan="2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Verkauf berechnen</h4>
      </div>
    </div>

    <form @submit.prevent="calculateEtfSale">
      <div class="row justify-content-md-center">
        <div class="col-md-8 col-xs-12 mb-4">
          <div class="card w-100 bg-light">
            <div class="card-body">
              <div class="container-fluid">
                <div v-if="serverError">
                  <div
                    class="alert alert-danger"
                    v-for="(error, index) in serverError"
                    :key="index"
                  >
                    {{ error }}
                  </div>
                </div>
                <div class="row no-gutters flex-lg-nowrap mb-4">
                  <div class="col-md-4 col-xs-12">
                    <div class="form-floating">
                      <select
                        v-model="calcEtfSaleIsin"
                        id="etfIsin"
                        class="form-select form-control"
                      >
                        <option
                          v-for="etf in etfs"
                          :key="etf.isin"
                          :value="etf.isin"
                        >
                          {{ etf.name }}
                        </option>
                      </select>

                      <label for="etfIsin">ETF</label>
                    </div>
                  </div>
                  <div class="col-md-2 col-xs-12">
                    <div class="form-floating">
                      <input
                        v-model="calcEtfSalePieces"
                        id="calcEtfSalePieces"
                        type="number"
                        step="0.01"
                        @change="validateCalcEtfSalePieces"
                        :class="
                          ' form-control text-end ' +
                          calcEtfSalePiecesErrorData.inputClass
                        "
                      />
                      <label
                        for="calcEtfSalePieces"
                        :style="
                          'color: ' + calcEtfSalePiecesErrorData.fieldColor
                        "
                        >{{ calcEtfSalePiecesErrorData.fieldLabel }}</label
                      >
                    </div>
                  </div>
                  <div class="col-md-2 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="calcEtfBidPrice"
                          id="calcEtfBidPrice"
                          type="number"
                          step="0.001"
                          @change="validateCalcEtfBidPrice"
                          :class="
                            ' form-control text-end ' +
                            calcEtfBidPriceErrorData.inputClass
                          "
                        />
                        <label
                          for="calcEtfBidPrice"
                          :style="
                            'color: ' + calcEtfBidPriceErrorData.fieldColor
                          "
                          >{{ calcEtfBidPriceErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-currency-euro"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-md-2 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="calcEtfAskPrice"
                          id="calcEtfAskPrice"
                          type="number"
                          step="0.001"
                          @change="validateCalcEtfAskPrice"
                          :class="
                            ' form-control text-end ' +
                            calcEtfAskPriceErrorData.inputClass
                          "
                        />
                        <label
                          for="calcEtfAskPrice"
                          :style="
                            'color: ' + calcEtfAskPriceErrorData.fieldColor
                          "
                          >{{ calcEtfAskPriceErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-currency-euro"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-md-2 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="calcEtfTransactionCosts"
                          id="calcEtfTransactionCosts"
                          type="number"
                          step="0.01"
                          @change="validateCalcEtfTransactionCosts"
                          :class="
                            ' form-control text-end ' +
                            calcEtfTransactionCostsErrorData.inputClass
                          "
                        />
                        <label
                          for="calcEtfTransactionCosts"
                          :style="
                            'color: ' +
                            calcEtfTransactionCostsErrorData.fieldColor
                          "
                          >{{
                            calcEtfTransactionCostsErrorData.fieldLabel
                          }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-currency-euro"></i
                      ></span>
                    </div>
                  </div>
                </div>
                <div class="row no-gutters flex-lg-nowrap">
                  <div class="col-12">
                    <button type="submit" class="btn btn-primary mx-2">
                      berechnen
                    </button>
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
              <td class="text-end">{{ originalBuyPrice }} &euro;</td>
            </tr>
            <tr>
              <th class="text-start">Verkaufspreis</th>
              <td class="text-end">{{ sellPrice }} &euro;</td>
            </tr>
          </tbody>
        </table>
        <table class="table table-striped table-bordered table-hover">
          <col style="width: 70%" />
          <col style="width: 30%" />
          <tbody>
            <tr>
              <th class="text-start">Gewinn</th>
              <td class="text-end">{{ profit }} &euro;</td>
            </tr>
            <tr>
              <th class="text-start">davon steuerlich relevant</th>
              <td class="text-end">
                <b>{{ chargeable }} &euro;</b>
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
              <td class="text-end">{{ newBuyPrice }} &euro;</td>
            </tr>
            <tr>
              <th class="text-start">Wiederkaufverlust</th>
              <td class="text-end">{{ rebuyLosses }} &euro;</td>
            </tr>
            <tr>
              <th class="text-start">Transaktionskosten</th>
              <td class="text-end">{{ transactionCosts }} &euro;</td>
            </tr>
            <tr>
              <th class="text-start">Gesamtkosten</th>
              <td class="text-end">
                <b>{{ overallCosts }} &euro;</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ListEtfDepotRowVue from "@/components/etf/ListEtfDepotRow.vue";
import DeleteEtfFlowModalVue from "@/components/etf/DeleteEtfFlowModal.vue";
import type { ListDepotRowData } from "@/components/etf/ListDepotRowData";
import type { Etf } from "@/model/etf/Etf";
import type { EtfDepot } from "@/model/etf/EtfDepot";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import type { EtfSalesCalculation } from "@/model/etf/EtfSalesCalculation";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import EtfControllerHandler from "@/handler/EtfControllerHandler";
import { formatNumber } from "@/tools/views/FormatNumber";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { validateInputField } from "@/tools/views/ValidateInputField";
import { getError } from "@/tools/views/ThrowError";

//FIXME: edit

type ListEtfsData = {
  serverError: Array<String> | undefined;
  dataLoaded: boolean;
  etfFlows: Array<ListDepotRowData>;
  etfEffectiveFlows: Array<ListDepotRowData>;
  etfs: Array<Etf>;
  calcEtfAskPrice: number;
  calcEtfBidPrice: number;
  calcEtfSaleIsin: string;
  calcEtfSalePieces: number;
  calcEtfTransactionCosts: number;
  calcEtfAskPriceIsValid: boolean | null;
  calcEtfAskPriceErrorMessage: string;
  calcEtfBidPriceIsValid: boolean | null;
  calcEtfBidPriceErrorMessage: string;
  calcEtfSalePiecesIsValid: boolean | null;
  calcEtfSalePiecesErrorMessage: string;
  calcEtfTransactionCostsIsValid: boolean | null;
  calcEtfTransactionCostsErrorMessage: string;
  calcResults: EtfSalesCalculation;
};
export default defineComponent({
  name: "ListEtfs",
  data(): ListEtfsData {
    return {
      serverError: undefined,
      dataLoaded: false,
      etfFlows: new Array<ListDepotRowData>(),
      etfEffectiveFlows: new Array<ListDepotRowData>(),
      etfs: {} as Array<Etf>,
      calcEtfAskPrice: 0,
      calcEtfBidPrice: 0,
      calcEtfSaleIsin: "",
      calcEtfSalePieces: 0,
      calcEtfTransactionCosts: 0,
      calcEtfAskPriceIsValid: null,
      calcEtfAskPriceErrorMessage: "",
      calcEtfBidPriceIsValid: null,
      calcEtfBidPriceErrorMessage: "",
      calcEtfSalePiecesIsValid: null,
      calcEtfSalePiecesErrorMessage: "",
      calcEtfTransactionCostsIsValid: null,
      calcEtfTransactionCostsErrorMessage: "",
      calcResults: {} as EtfSalesCalculation,
    };
  },
  mounted() {
    this.loadData();
  },
  computed: {
    etfEffectiveFlowAmountSum() {
      return this.etfEffectiveFlows.reduce((a, b) => a + (b["amount"] || 0), 0);
    },
    etfEffectiveFlowAmountPriceSum() {
      return this.etfEffectiveFlows.reduce(
        (a, b) => a + (b["amount"] * b["price"] || 0),
        0
      );
    },
    etfEffectiveFlowAmountSumString() {
      return formatNumber(this.etfEffectiveFlowAmountSum, 3);
    },
    etfEffectiveFlowPriceAvgString() {
      return formatNumber(
        this.etfEffectiveFlowAmountPriceSum / this.etfEffectiveFlowAmountSum,
        3
      );
    },
    etfEffectiveFlowAmountPriceSumString() {
      return formatNumber(this.etfEffectiveFlowAmountPriceSum, 2);
    },
    etfFlowAmountSum() {
      return this.etfFlows.reduce((a, b) => a + (b["amount"] || 0), 0);
    },
    etfFlowAmountPriceSum() {
      return this.etfFlows.reduce(
        (a, b) => a + (b["amount"] * b["price"] || 0),
        0
      );
    },
    etfFlowAmountSumString() {
      return formatNumber(this.etfFlowAmountSum, 3);
    },
    etfFlowPriceAvgString() {
      return formatNumber(
        this.etfFlowAmountPriceSum / this.etfFlowAmountSum,
        3
      );
    },
    etfFlowAmountPriceSumString() {
      return formatNumber(this.etfFlowAmountPriceSum, 2);
    },
    calcEtfAskPriceErrorData(): ErrorData {
      return generateErrorData(
        this.calcEtfAskPriceIsValid,
        "Einkauf",
        this.calcEtfAskPriceErrorMessage
      );
    },
    calcEtfBidPriceErrorData(): ErrorData {
      return generateErrorData(
        this.calcEtfBidPriceIsValid,
        "Verkauf",
        this.calcEtfBidPriceErrorMessage
      );
    },
    calcEtfSalePiecesErrorData(): ErrorData {
      return generateErrorData(
        this.calcEtfSalePiecesIsValid,
        "Stück",
        this.calcEtfSalePiecesErrorMessage
      );
    },
    calcEtfTransactionCostsErrorData(): ErrorData {
      return generateErrorData(
        this.calcEtfTransactionCostsIsValid,
        "Transaktionskosten",
        this.calcEtfTransactionCostsErrorMessage
      );
    },
    formIsValid(): boolean {
      const isValid =
        this.calcEtfAskPriceIsValid &&
        this.calcEtfBidPriceIsValid &&
        this.calcEtfSalePiecesIsValid &&
        this.calcEtfTransactionCostsIsValid;
      if (isValid === null || isValid === undefined || isValid === true) {
        return true;
      }
      return false;
    },
    chargeable() {
      return formatNumber(this.calcResults.chargeable, 2);
    },

    newBuyPrice() {
      return formatNumber(this.calcResults.newBuyPrice, 2);
    },
    originalBuyPrice() {
      return formatNumber(this.calcResults.originalBuyPrice, 2);
    },
    overallCosts() {
      return formatNumber(this.calcResults.overallCosts, 2);
    },
    pieces() {
      return formatNumber(this.calcResults.pieces, 2);
    },
    profit() {
      return formatNumber(this.calcResults.profit, 2);
    },
    rebuyLosses() {
      return formatNumber(this.calcResults.rebuyLosses, 2);
    },
    sellPrice() {
      return formatNumber(this.calcResults.sellPrice, 2);
    },
    transactionCosts() {
      return formatNumber(this.calcResults.transactionCosts, 2);
    },
  },
  methods: {
    async loadData() {
      const etfDepot: EtfDepot = await EtfControllerHandler.listEtfFlows();
      if (etfDepot.etfs) {
        this.etfs = etfDepot.etfs;
        this.calcEtfAskPrice = etfDepot.calcEtfAskPrice;
        this.calcEtfBidPrice = etfDepot.calcEtfBidPrice;
        this.calcEtfSaleIsin = etfDepot.calcEtfSaleIsin;
        this.calcEtfSalePieces = etfDepot.calcEtfSalePieces;
        this.calcEtfTransactionCosts = etfDepot.calcEtfTransactionCosts;
        const etfMap = new Map<String, Etf>();
        for (let etf of etfDepot.etfs) {
          etfMap.set(etf.isin, etf);
        }
        for (let etfFlow of etfDepot.etfFlows) {
          const etf = etfMap.get(etfFlow.isin);
          if (etf)
            this.etfFlows.push({
              ...etfFlow,
              name: etf.name,
              chartUrl: etf.chartUrl,
            });
        }
        for (let etfFlow of etfDepot.etfEffectiveFlows) {
          const etf = etfMap.get(etfFlow.isin);
          if (etf)
            this.etfEffectiveFlows.push({
              ...etfFlow,
              name: etf.name,
              chartUrl: etf.chartUrl,
            });
        }
      }
    },
    showEffective() {
      const effectiveTabButton = (this.$refs.effectiveTabButton as HTMLElement)
        .classList;
      const allTabButton = (this.$refs.allTabButton as HTMLElement).classList;
      const effectiveTab = (this.$refs.effectiveTab as HTMLElement).classList;
      const allTab = (this.$refs.allTab as HTMLElement).classList;
      const active = "active";
      const show = "show";
      const fade = "fade";

      allTabButton.remove(active);
      allTab.add(fade);
      allTab.remove(show, active);

      effectiveTabButton.add(active);
      effectiveTab.remove(fade);
      effectiveTab.add(show, active);
    },
    showAll() {
      const effectiveTabButton = (this.$refs.effectiveTabButton as HTMLElement)
        .classList;
      const allTabButton = (this.$refs.allTabButton as HTMLElement).classList;
      const effectiveTab = (this.$refs.effectiveTab as HTMLElement).classList;
      const allTab = (this.$refs.allTab as HTMLElement).classList;
      const active = "active";
      const show = "show";
      const fade = "fade";

      effectiveTabButton.remove(active);
      effectiveTab.add(fade);
      effectiveTab.remove(show, active);

      allTabButton.add(active);
      allTab.remove(fade);
      allTab.add(show, active);
    },
    validateCalcEtfAskPrice() {
      [this.calcEtfAskPriceIsValid, this.calcEtfAskPriceErrorMessage] =
        validateInputField(this.calcEtfAskPrice, "Einkauf angeben!");
    },
    validateCalcEtfBidPrice() {
      [this.calcEtfBidPriceIsValid, this.calcEtfBidPriceErrorMessage] =
        validateInputField(this.calcEtfBidPrice, "Verkauf angeben!");
    },
    validateCalcEtfSalePieces() {
      [this.calcEtfSalePiecesIsValid, this.calcEtfSalePiecesErrorMessage] =
        validateInputField(this.calcEtfSalePieces, "Stück angeben!");
    },
    validateCalcEtfTransactionCosts() {
      [
        this.calcEtfTransactionCostsIsValid,
        this.calcEtfTransactionCostsErrorMessage,
      ] = validateInputField(
        this.calcEtfTransactionCosts,
        "Transaktionskosten angeben!"
      );
    },
    followUpServerCall(validationResult: ValidationResult): boolean {
      if (!validationResult.result) {
        this.serverError = new Array<string>();
        for (let resultItem of validationResult.validationResultItems) {
          this.serverError.push(getError(resultItem.error));
        }
        return false;
      }
      return true;
    },
    async calculateEtfSale() {
      this.validateCalcEtfAskPrice();
      this.validateCalcEtfBidPrice();
      this.validateCalcEtfSalePieces();
      this.validateCalcEtfTransactionCosts();

      if (this.formIsValid) {
        this.calcResults = await EtfControllerHandler.calcEtfSale(
          this.calcEtfSaleIsin,
          this.calcEtfSalePieces,
          this.calcEtfBidPrice,
          this.calcEtfAskPrice,
          this.calcEtfTransactionCosts
        );
        console.log(this.calcResults.validationResult);
        this.followUpServerCall(this.calcResults.validationResult);
      }
    },
    deleteEtfFlow(etfFlow: EtfFlow, etfName: string) {
      (this.$refs.deleteModal as typeof DeleteEtfFlowModalVue)._show(
        etfFlow,
        etfName
      );
    },
    etfFlowDeleted(etfFlow: EtfFlow) {
      this.etfFlows = this.etfFlows.filter(
        (flow) => flow.etfflowid != etfFlow.etfflowid
      );
      this.etfEffectiveFlows = this.etfEffectiveFlows.filter(
        (flow) => flow.etfflowid != etfFlow.etfflowid
      );
    },
  },
  components: { ListEtfDepotRowVue, DeleteEtfFlowModalVue },
});
</script>
