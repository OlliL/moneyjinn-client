<template>
  <div class="row" style="margin-top: 20px">
    <div class="card">
      <div class="card-header text-center p-3">
        <h5>Geldbewegung {{ monthName }} {{ year }}</h5>
      </div>
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
            />
            <tr>
              <td class="text-end" colspan="3">&sum;</td>
              <td colspan="2" :class="amountSumClass">
                {{ amountSumString }} &euro;
              </td>
              <td colspan="6"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <CapitalsourceTableVue
    :capitalsource-data="assetsTurnoverCapitalsources"
    groupName="Eigenkapital"
    :current-month-is-settled="currentMonthIsSettled"
    v-if="assetsTurnoverCapitalsources.length > 0"
  />
  <CapitalsourceTableVue
    :capitalsource-data="liabilitiesTurnoverCapitalsources"
    groupName="Fremdkapital"
    :current-month-is-settled="currentMonthIsSettled"
    v-if="liabilitiesTurnoverCapitalsources.length > 0"
  />
  <CapitalsourceTableVue
    :capitalsource-data="creditTurnoverCapitalsources"
    groupName="Kredite"
    :current-month-is-settled="currentMonthIsSettled"
    v-if="creditTurnoverCapitalsources.length > 0"
  />
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

export default defineComponent({
  name: "ReportTable",
  data() {
    return { report: {} as Report, dataLoaded: false };
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
    monthName(): string {
      return getMonthName(this.report.month);
    },
  },
  methods: {
    async loadData(year: string, month: string) {
      this.report = await ReportControllerHandler.listReports(year, month);
      this.dataLoaded = true;
      console.log(this.report);
    },
  },
  components: { CapitalsourceTableVue, ReportTableRowVue },
});
</script>
