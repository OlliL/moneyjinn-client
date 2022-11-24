<template>
  <div class="row" style="margin-top: 20px">
    <div class="card">
      <div class="card-header text-center p-3">
        <h5>Geldbewegung {{ monthName }} {{ year }}</h5>
      </div>

      <ReceiptModalVue ref="receiptModal" />

      <div class="card-body">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th></th>
              <th>Buchungsdatum</th>
              <th>Rechnungsdatum</th>
              <th colspan="2">Betrag</th>
              <th>Vertragspartner</th>
              <th>Kommentar</th>
              <th>Buchungskonto</th>
              <th>Kapitalquelle</th>
              <th colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <ReportTableRowVue
              v-for="mmf in report.moneyflows"
              :key="mmf.id"
              :mmf="mmf"
              @show-receipt="showReceipt"
            />
            <tr>
              <td class="text-end" colspan="3">&sum;</td>
              <td colspan="2" :class="amountSumClass">
                <u>{{ amountSumString }} &euro;</u>
              </td>
              <td colspan="6"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="row" style="margin-top: 40px">
    <div class="col-xs-12 text-center">
      <h1>Monatsbilanz</h1>
    </div>
  </div>

  <div class="row justify-content-md-center py-4">
    <div class="col col-lg-8">
      <div class="card">
        <div class="card-header text-center p-3">
          <h4>Eigenkapital</h4>
        </div>
        <div class="card-body">
          <CapitalsourceTableVue
            :capitalsource-data="assetsTurnoverCapitalsources"
            :current-month-is-settled="currentMonthIsSettled"
            v-if="assetsTurnoverCapitalsources.length > 0"
          />
          <div class="row justify-content-md-center">
            <div class="col col-lg-4">
              <table class="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th></th>
                    <th>Monat</th>
                    <th>Jahr</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="currentMonthIsSettled">
                    <th class="text-end">Gewinn (fix)</th>
                    <td :class="assetsMonthlyFixedTurnoverClass">
                      {{ assetsMonthlyFixedTurnoverString }} &euro;
                    </td>
                    <td :class="assetsYearlyFixedTurnoverClass">
                      {{ assetsYearlyFixedTurnoverString }} &euro;
                    </td>
                  </tr>
                  <tr>
                    <th class="text-end">Gewinn (errechnet)</th>
                    <td :class="assetsMonthlyCalculatedTurnoverClass">
                      {{ assetsMonthlyCalculatedTurnoverString }} &euro;
                    </td>
                    <td :class="turnoverEndOfYearCalculatedClass">
                      {{ turnoverEndOfYearCalculatedString }} &euro;
                    </td>
                  </tr>
                  <tr v-if="currentMonthIsSettled">
                    <th class="text-end">Differenz</th>
                    <td :class="assetsMonthlyDifferenceClass">
                      {{ assetsMonthlyDifferenceString }}
                      &euro;
                    </td>
                    <td :class="assetsYearlyDifferenceClass">
                      {{ assetsYearlyDifferenceString }}
                      &euro;
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row justify-content-md-center py-4">
    <div class="col col-lg-8">
      <div class="card">
        <div class="card-header text-center p-3">
          <h4>Fremdkapital</h4>
        </div>
        <div class="card-body">
          <CapitalsourceTableVue
            :capitalsource-data="liabilitiesTurnoverCapitalsources"
            :current-month-is-settled="currentMonthIsSettled"
            v-if="liabilitiesTurnoverCapitalsources.length > 0"
          />
        </div>
      </div>
    </div>
  </div>

  <div class="row justify-content-md-center py-4">
    <div class="col col-lg-8">
      <div class="card">
        <div class="card-header text-center p-3">
          <h4>Kredite</h4>
        </div>
        <div class="card-body">
          <CapitalsourceTableVue
            :capitalsource-data="creditTurnoverCapitalsources"
            :current-month-is-settled="currentMonthIsSettled"
            v-if="creditTurnoverCapitalsources.length > 0"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ReportControllerHandler from "@/handler/ReportControllerHandler";
import type { Report } from "@/model/report/Report";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsourceTransport";
import { defineComponent } from "vue";
import CapitalsourceTableVue from "./CapitalsourceTable.vue";
import ReportTableRowVue from "./ReportTableRow.vue";
import { redIfNegativeEnd, formatNumber } from "@/tools/views/FormatNumber";
import { getMonthName } from "@/tools/views/MonthName";
import ReceiptModalVue from "./ReceiptModal.vue";

export default defineComponent({
  name: "ReportTable",
  data() {
    return {
      report: {} as Report,
      dataLoaded: false,
      assetsMonthlyFixedTurnover: 0,
      assetsYearlyFixedTurnover: 0,
      assetsMonthlyCalculatedTurnover: 0,
    };
  },
  props: {
    year: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
  },
  created() {
    this.loadData(this.$props.year, this.$props.month);
    this.$watch(
      () => ({
        year: this.year,
        month: this.month,
      }),
      (data) => {
        if (data.year && data.month) this.loadData(data.year, data.month);
      }
    );
  },
  computed: {
    monthName(): string {
      return getMonthName(this.report.month);
    },
    assetsTurnoverCapitalsources(): Array<ReportTurnoverCapitalsource> {
      if (this.dataLoaded) {
        return this.report.reportTurnoverCapitalsources?.filter(
          (data) =>
            data.capitalsourceType === CapitalsourceType.CURRENT_ASSET ||
            data.capitalsourceType === CapitalsourceType.LONG_TERM_ASSET
        );
      }
      return new Array<ReportTurnoverCapitalsource>();
    },
    liabilitiesTurnoverCapitalsources(): Array<ReportTurnoverCapitalsource> {
      if (this.dataLoaded) {
        return this.report.reportTurnoverCapitalsources?.filter(
          (data) =>
            data.capitalsourceType === CapitalsourceType.RESERVE_ASSET ||
            data.capitalsourceType === CapitalsourceType.PROVISION_ASSET
        );
      }
      return new Array<ReportTurnoverCapitalsource>();
    },
    creditTurnoverCapitalsources(): Array<ReportTurnoverCapitalsource> {
      if (this.dataLoaded) {
        return this.report.reportTurnoverCapitalsources?.filter(
          (data) => data.capitalsourceType === CapitalsourceType.CREDIT
        );
      }
      return new Array<ReportTurnoverCapitalsource>();
    },
    currentMonthIsSettled(): boolean {
      if (this.dataLoaded) {
        for (let data of this.report.reportTurnoverCapitalsources) {
          if (data.amountEndOfMonthFixed) {
            return true;
          }
        }
      }
      return false;
    },
    amountSum(): number {
      let sum = 0;
      if (this.dataLoaded) {
        for (const mmf of this.report.moneyflows) {
          sum += mmf.amount;
        }
      }
      return sum;
    },
    amountSumClass(): string {
      return redIfNegativeEnd(this.amountSum);
    },
    amountSumString(): string {
      return formatNumber(this.amountSum, 2);
    },
    assetsMonthlyFixedTurnoverClass(): string {
      return redIfNegativeEnd(this.assetsMonthlyFixedTurnover);
    },
    assetsMonthlyFixedTurnoverString(): string {
      return formatNumber(this.assetsMonthlyFixedTurnover, 2);
    },
    assetsYearlyFixedTurnoverClass(): string {
      return redIfNegativeEnd(this.assetsYearlyFixedTurnover);
    },
    assetsYearlyFixedTurnoverString(): string {
      return formatNumber(this.assetsYearlyFixedTurnover, 2);
    },
    assetsMonthlyCalculatedTurnoverClass(): string {
      return redIfNegativeEnd(this.assetsMonthlyCalculatedTurnover);
    },
    assetsMonthlyCalculatedTurnoverString(): string {
      return formatNumber(this.assetsMonthlyCalculatedTurnover, 2);
    },
    turnoverEndOfYearCalculatedClass(): string {
      return redIfNegativeEnd(this.report.turnoverEndOfYearCalculated);
    },
    turnoverEndOfYearCalculatedString(): string {
      return formatNumber(this.report.turnoverEndOfYearCalculated, 2);
    },
    assetsMonthlyDifference(): number {
      return +(
        this.assetsMonthlyFixedTurnover - this.assetsMonthlyCalculatedTurnover
      ).toFixed(2);
    },
    assetsMonthlyDifferenceClass(): string {
      return redIfNegativeEnd(this.assetsMonthlyDifference);
    },
    assetsMonthlyDifferenceString(): string {
      return formatNumber(this.assetsMonthlyDifference, 2);
    },
    assetsYearlyDifference(): number {
      return +(
        this.assetsYearlyFixedTurnover - this.report.turnoverEndOfYearCalculated
      ).toFixed(2);
    },
    assetsYearlyDifferenceClass(): string {
      return redIfNegativeEnd(this.assetsYearlyDifference);
    },
    assetsYearlyDifferenceString(): string {
      return formatNumber(this.assetsYearlyDifference, 2);
    },
  },
  methods: {
    async loadData(year: string, month: string) {
      this.report = await ReportControllerHandler.listReports(year, month);

      this.assetsMonthlyCalculatedTurnover = 0;

      var assetsLastAmount = 0;
      var assetsFixAmount = 0;
      for (const data of this.report.reportTurnoverCapitalsources) {
        if (
          data.capitalsourceType === CapitalsourceType.CURRENT_ASSET ||
          data.capitalsourceType === CapitalsourceType.LONG_TERM_ASSET
        ) {
          this.assetsMonthlyCalculatedTurnover += +(
            data.amountEndOfMonthCalculated - data.amountBeginOfMonthFixed
          ).toFixed(2);
          assetsLastAmount += data.amountBeginOfMonthFixed;
          if (data.amountEndOfMonthFixed)
            assetsFixAmount = +(
              assetsFixAmount + data.amountEndOfMonthFixed
            ).toFixed(2);
        }
      }
      this.assetsMonthlyFixedTurnover = +(
        assetsFixAmount - assetsLastAmount
      ).toFixed(2);
      this.assetsYearlyFixedTurnover = +(
        assetsFixAmount - this.report.amountBeginOfYear
      ).toFixed(2);

      this.dataLoaded = true;
    },
    showReceipt(moneyflowId: number) {
      (this.$refs.receiptModal as typeof ReceiptModalVue)._show(moneyflowId);
    },
  },
  components: { CapitalsourceTableVue, ReportTableRowVue, ReceiptModalVue },
});
</script>
