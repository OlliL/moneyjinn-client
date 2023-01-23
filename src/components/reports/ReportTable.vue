<template>
  <div class="row" style="margin-top: 20px" v-if="dataLoaded">
    <div class="card">
      <div class="card-header text-center p-3">
        <h5>Geldbewegung {{ monthName }} {{ year }}</h5>
      </div>

      <ReceiptModalVue ref="receiptModal" />
      <DeleteMoneyflowModalVue
        ref="deleteModal"
        @moneyflow-deleted="moneyflowDeleted"
      />
      <EditMoneyflowModalVue
        ref="editModal"
        @moneyflow-updated="moneyflowUpdated"
        @moneyflow-receipt-deleted="moneyflowReceiptDeleted"
      />

      <div class="card-body" v-if="report.moneyflows">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th></th>
              <th>
                Buchungsdatum
                <i
                  :class="`bi ${sortIcon('bookingDate')} link-primary`"
                  role="button"
                  @click="sortByColumn('bookingDate')"
                ></i>
              </th>
              <th>
                Rechnungsdatum
                <i
                  :class="`bi ${sortIcon('invoiceDate')} link-primary`"
                  role="button"
                  @click="sortByColumn('invoiceDate')"
                ></i>
              </th>
              <th colspan="2">
                Betrag
                <i
                  :class="`bi ${sortIcon('amount')} link-primary`"
                  role="button"
                  @click="sortByColumn('amount')"
                ></i>
              </th>
              <th>
                Vertragspartner
                <i
                  :class="`bi ${sortIcon('contractpartnerName')} link-primary`"
                  role="button"
                  @click="sortByColumn('contractpartnerName')"
                ></i>
              </th>
              <th>
                Kommentar
                <i
                  :class="`bi ${sortIcon('comment')} link-primary`"
                  role="button"
                  @click="sortByColumn('comment')"
                ></i>
              </th>
              <th>
                Buchungskonto
                <i
                  :class="`bi ${sortIcon('postingAccountName')} link-primary`"
                  role="button"
                  @click="sortByColumn('postingAccountName')"
                ></i>
              </th>
              <th>
                Kapitalquelle
                <i
                  :class="`bi ${sortIcon('capitalsourceComment')} link-primary`"
                  role="button"
                  @click="sortByColumn('capitalsourceComment')"
                ></i>
              </th>
              <th colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <ReportTableRowVue
              v-for="mmf in report.moneyflows"
              :key="mmf.id"
              :mmf="mmf"
              @show-receipt="showReceipt"
              @delete-moneyflow="deleteMoneyflow"
              @edit-moneyflow="editMoneyflow"
            />
            <tr>
              <td class="text-end" colspan="3">&sum;</td>
              <td colspan="2" class="text-end">
                <u><SpanAmount :amount="amountSum" /></u>
              </td>
              <td colspan="6"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div v-if="report.reportTurnoverCapitalsources">
    <div class="row" style="margin-top: 40px">
      <div class="col-xs-12 text-center">
        <h1>Monatsbilanz</h1>
      </div>
    </div>

    <div
      class="row justify-content-md-center py-4"
      v-if="assetsTurnoverCapitalsources.length > 0"
    >
      <div class="col col-lg-8">
        <div class="card">
          <div class="card-header text-center p-3">
            <h4>Eigenkapital</h4>
          </div>
          <div class="card-body">
            <CapitalsourceTableVue
              :capitalsource-data="assetsTurnoverCapitalsources"
              :current-month-is-settled="currentMonthIsSettled"
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
                      <td class="text-end">
                        <SpanAmount :amount="assetsMonthlyFixedTurnover" />
                      </td>
                      <td class="text-end">
                        <SpanAmount :amount="assetsYearlyFixedTurnover" />
                      </td>
                    </tr>
                    <tr>
                      <th class="text-end">Gewinn (errechnet)</th>
                      <td class="text-end">
                        <SpanAmount :amount="assetsMonthlyCalculatedTurnover" />
                      </td>
                      <td class="text-end">
                        <SpanAmount
                          :amount="report.turnoverEndOfYearCalculated"
                        />
                      </td>
                    </tr>
                    <tr v-if="currentMonthIsSettled">
                      <th class="text-end">Differenz</th>
                      <td class="text-end">
                        <SpanAmount :amount="assetsMonthlyDifference" />
                      </td>
                      <td class="text-end">
                        <SpanAmount :amount="assetsYearlyDifference" />
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

    <div
      class="row justify-content-md-center py-4"
      v-if="liabilitiesTurnoverCapitalsources.length > 0"
    >
      <div class="col col-lg-8">
        <div class="card">
          <div class="card-header text-center p-3">
            <h4>Fremdkapital</h4>
          </div>
          <div class="card-body">
            <CapitalsourceTableVue
              :capitalsource-data="liabilitiesTurnoverCapitalsources"
              :current-month-is-settled="currentMonthIsSettled"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="row justify-content-md-center py-4"
      v-if="creditTurnoverCapitalsources.length > 0"
    >
      <div class="col col-lg-8">
        <div class="card">
          <div class="card-header text-center p-3">
            <h4>Kredite</h4>
          </div>
          <div class="card-body">
            <CapitalsourceTableVue
              :capitalsource-data="creditTurnoverCapitalsources"
              :current-month-is-settled="currentMonthIsSettled"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { Report } from "@/model/report/Report";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";

import ReportControllerHandler from "@/handler/ReportControllerHandler";

import ReportTableRowVue from "./ReportTableRow.vue";
import ReceiptModalVue from "./ReceiptModal.vue";
import CapitalsourceTableVue from "./CapitalsourceTable.vue";
import DeleteMoneyflowModalVue from "../moneyflow/DeleteMoneyflowModal.vue";
import EditMoneyflowModalVue from "../moneyflow/EditMoneyflowModal.vue";

import { getMonthName } from "@/tools/views/MonthName";
import SpanAmount from "../SpanAmount.vue";

export default defineComponent({
  name: "ReportTable",
  data() {
    return {
      report: {} as Report,
      dataLoaded: false,
      assetsMonthlyFixedTurnover: 0,
      assetsYearlyFixedTurnover: 0,
      assetsMonthlyCalculatedTurnover: 0,
      sortBy: new Map<String, Boolean>(),
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
  mounted() {
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
    assetsMonthlyDifference(): number {
      return +(
        this.assetsMonthlyFixedTurnover - this.assetsMonthlyCalculatedTurnover
      );
    },
    assetsYearlyDifference(): number {
      return +(
        this.assetsYearlyFixedTurnover - this.report.turnoverEndOfYearCalculated
      );
    },
  },
  methods: {
    async loadData(year: string, month: string) {
      this.dataLoaded = false;
      this.report = await ReportControllerHandler.listReports(year, month);

      this.assetsMonthlyCalculatedTurnover = 0;

      var assetsLastAmount = 0;
      var assetsFixAmount = 0;
      if (this.report.reportTurnoverCapitalsources) {
        for (const data of this.report.reportTurnoverCapitalsources) {
          if (
            data.capitalsourceType === CapitalsourceType.CURRENT_ASSET ||
            data.capitalsourceType === CapitalsourceType.LONG_TERM_ASSET
          ) {
            this.assetsMonthlyCalculatedTurnover += +(
              data.amountEndOfMonthCalculated - data.amountBeginOfMonthFixed
            );
            assetsLastAmount += data.amountBeginOfMonthFixed;
            if (data.amountEndOfMonthFixed)
              assetsFixAmount = +(assetsFixAmount + data.amountEndOfMonthFixed);
          }
        }
      }
      this.assetsMonthlyFixedTurnover = +(assetsFixAmount - assetsLastAmount);
      this.assetsYearlyFixedTurnover = +(
        assetsFixAmount - this.report.amountBeginOfYear
      );

      this.sortBy.clear();
      this.sortBy.set("bookingDate", true);
      this.dataLoaded = true;
    },
    showReceipt(moneyflowId: number) {
      (this.$refs.receiptModal as typeof ReceiptModalVue)._show(moneyflowId);
    },
    deleteMoneyflow(mmf: Moneyflow) {
      (this.$refs.deleteModal as typeof DeleteMoneyflowModalVue)._show(mmf);
    },
    editMoneyflow(mmf: Moneyflow) {
      (this.$refs.editModal as typeof EditMoneyflowModalVue)._show(mmf);
    },
    /**
     * recalculate End of Month amount (for matching Capitalsource),
     * recalculate End of Month amount (overall),
     * recalculate End of Year amount,
     * @param capitalsourceComment
     * @param amount
     */
    bookCapitalsourceAmounts(mmf: Moneyflow, bookOut: boolean) {
      const bookingDate = mmf.bookingDate;
      bookingDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const capitalsourceComment = mmf.capitalsourceComment;
      let direction = bookOut ? -1 : 1;
      const amount = mmf.amount * direction;

      for (const mcs of this.report.reportTurnoverCapitalsources) {
        if (mcs.capitalsourceComment === capitalsourceComment) {
          mcs.amountEndOfMonthCalculated += amount;
          if (
            !mcs.amountCurrentState &&
            mcs.amountCurrent &&
            bookingDate <= today
          ) {
            mcs.amountCurrent += amount;
          }
          if (
            mcs.capitalsourceType === CapitalsourceType.CURRENT_ASSET ||
            mcs.capitalsourceType === CapitalsourceType.LONG_TERM_ASSET
          ) {
            this.assetsMonthlyCalculatedTurnover += amount;
          }
        }
      }
      this.report.turnoverEndOfYearCalculated += amount;
    },
    moneyflowDeleted(mmf: Moneyflow) {
      this.bookCapitalsourceAmounts(mmf, true);
      this.report.moneyflows = this.report.moneyflows.filter((originalMmf) => {
        return mmf.id !== originalMmf.id;
      });
    },
    moneyflowReceiptDeleted(mmfId: number) {
      const oldMmf = this.report.moneyflows.find(
        (originalMmf) => mmfId === originalMmf.id
      );
      if (oldMmf) oldMmf.hasReceipt = false;
    },
    moneyflowUpdated(mmf: Moneyflow) {
      const oldMmf = this.report.moneyflows.find(
        (originalMmf) => mmf.id === originalMmf.id
      );
      if (oldMmf) {
        this.bookCapitalsourceAmounts(oldMmf, true);
      }

      for (var i = 0; i < this.report.moneyflows.length; i++) {
        if (mmf.id === this.report.moneyflows[i].id) {
          this.report.moneyflows[i] = mmf;
          break;
        }
      }
      this.bookCapitalsourceAmounts(mmf, false);
    },
    sortIcon(sortedField: string) {
      if (this.sortBy.get(sortedField) === undefined) {
        return "bi-caret-down-square";
      } else if (this.sortBy.get(sortedField)) {
        return "bi-caret-down-square-fill";
      }
      return "bi-caret-up-square-fill";
    },
    compareColumns(a: Moneyflow, b: Moneyflow, field: keyof Moneyflow): number {
      let aField = a[field];
      let bField = b[field];
      if (aField === undefined || bField === undefined) return 0;
      if (typeof aField === "string" && typeof bField === "string") {
        aField = aField.toLowerCase();
        bField = bField.toLowerCase();
      }
      return aField > bField ? 1 : bField > aField ? -1 : 0;
    },
    sortByColumn(field: keyof Moneyflow) {
      let sortByField = this.sortBy.get(field);
      if (sortByField == undefined || !sortByField) {
        this.report.moneyflows.sort((a, b) => this.compareColumns(a, b, field));
        sortByField = true;
      } else {
        this.report.moneyflows.sort(
          (a, b) => -1 * this.compareColumns(a, b, field)
        );
        sortByField = false;
      }
      this.sortBy.clear();
      this.sortBy.set(field, sortByField);
    },
  },
  components: {
    CapitalsourceTableVue,
    ReportTableRowVue,
    ReceiptModalVue,
    DeleteMoneyflowModalVue,
    EditMoneyflowModalVue,
    SpanAmount,
  },
});
</script>
