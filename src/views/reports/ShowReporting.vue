<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Ausgabenauswertung</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-xl-6 col-md-12 col-xs-12">
        <div class="card w-100 bg-light">
          <div class="card-body">
            <form @submit.prevent="showReportingGraph">
              <div class="container-fluid">
                <div class="row no-gutters flex-lg-nowrap mb-2">
                  <div class="col-md-4 col-xs-12" v-show="!groupByYear">
                    <DatepickerVue
                      id="startDateMonth"
                      :label="startDateMonthErrorData.fieldLabel"
                      :default-date="startDateMonth"
                      pick-mode="month"
                      :input-class="
                        ' form-control ' + startDateMonthErrorData.inputClass
                      "
                      :label-style="
                        'color: ' + startDateMonthErrorData.fieldColor
                      "
                      @date-selected="startDateMonthSelected"
                    />
                  </div>
                  <div class="col-md-4 col-xs-12" v-show="!groupByYear">
                    <DatepickerVue
                      id="endDateMonth"
                      :label="endDateMonthErrorData.fieldLabel"
                      :default-date="endDateMonth"
                      pick-mode="month"
                      :input-class="
                        ' form-control ' + endDateMonthErrorData.inputClass
                      "
                      :label-style="
                        'color: ' + endDateMonthErrorData.fieldColor
                      "
                      @date-selected="endDateMonthSelected"
                    />
                  </div>

                  <div class="col-md-4 col-xs-12" v-show="groupByYear">
                    <DatepickerVue
                      id="startDateYear"
                      :label="startDateYearErrorData.fieldLabel"
                      :default-date="startDateYear"
                      pick-mode="year"
                      :input-class="
                        ' form-control ' + startDateYearErrorData.inputClass
                      "
                      :label-style="
                        'color: ' + startDateYearErrorData.fieldColor
                      "
                      @date-selected="startDateYearSelected"
                    />
                  </div>
                  <div class="col-md-4 col-xs-12" v-show="groupByYear">
                    <DatepickerVue
                      id="endDateYear"
                      :label="endDateYearErrorData.fieldLabel"
                      :default-date="endDateYear"
                      pick-mode="year"
                      :input-class="
                        ' form-control ' + endDateYearErrorData.inputClass
                      "
                      :label-style="'color: ' + endDateYearErrorData.fieldColor"
                      @date-selected="endDateYearSelected"
                    />
                  </div>
                  <div class="col-md-4 col-xs-12">
                    <div class="form-check form-switch text-start">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="showreppostingaccountmode"
                        v-model="singlePostingAccounts"
                      />
                      <label
                        class="form-check-label"
                        for="showreppostingaccountmode"
                        >{{ singlePostingAccountsLabel }}</label
                      >
                    </div>
                    <div class="form-check form-switch text-start">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="showrepmonth"
                        v-model="groupByYear"
                      />
                      <label class="form-check-label" for="showrepmonth">{{
                        groupByYearLabel
                      }}</label>
                    </div>
                  </div>
                </div>
                <div
                  class="row no-gutters flex-lg-nowrap"
                  v-show="!singlePostingAccounts"
                >
                  <div class="col-5 text-start">
                    <small
                      :style="'color:' + postingAccountYesErrorData.fieldColor"
                      >{{ postingAccountYesErrorData.fieldLabel }}</small
                    >
                  </div>
                  <div class="col-2">&nbsp;</div>
                  <div class="col-5 text-start">
                    <small
                      :style="'color:' + postingAccountNoErrorData.fieldColor"
                      >{{ postingAccountNoErrorData.fieldLabel }}</small
                    >
                  </div>
                </div>
                <div
                  class="row no-gutters flex-lg-nowrap"
                  v-show="!singlePostingAccounts"
                >
                  <div class="col-5">
                    <select
                      v-model="selectedPostingAccountsYes"
                      id="postingAccountIdsYes"
                      class="form-select form-control"
                      multiple
                      size="5"
                    >
                      <option
                        v-for="postingAccount of postingAccountsYes"
                        :key="postingAccount.id"
                        :value="postingAccount.id"
                      >
                        {{ postingAccount.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-2">
                    <button
                      type="button"
                      class="btn btn-light btn-sm"
                      style="padding: 0.1rem 0.3rem !important"
                      @click="removeAllPostingAccounts"
                    >
                      <i class="bi bi-caret-right-fill"></i>
                    </button>
                    <br />
                    <button
                      type="button"
                      class="btn btn-light btn-sm"
                      style="padding: 0.1rem 0.3rem !important"
                      @click="removeSelectedPostingAccounts"
                    >
                      <i class="bi bi-caret-right"></i>
                    </button>
                    <br />
                    <br />
                    <button
                      type="button"
                      class="btn btn-light btn-sm"
                      style="padding: 0.1rem 0.3rem !important"
                      @click="addSelectedPostingAccounts"
                    >
                      <i class="bi bi-caret-left"></i>
                    </button>
                    <br />
                    <button
                      type="button"
                      class="btn btn-light btn-sm"
                      style="padding: 0.1rem 0.3rem !important"
                      @click="addAllPostingAccounts"
                    >
                      <i class="bi bi-caret-left-fill"></i>
                    </button>
                  </div>
                  <div class="col-5">
                    <select
                      v-model="selectedPostingAccountsNo"
                      id="postingAccountIdsNo"
                      class="form-select form-control"
                      multiple
                      size="5"
                    >
                      <option
                        v-for="postingAccount of postingAccountsNo"
                        :key="postingAccount.id"
                        :value="postingAccount.id"
                      >
                        {{ postingAccount.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div
                  class="row no-gutters flex-lg-nowrap justify-content-md-center mt-3"
                  v-show="singlePostingAccounts"
                >
                  <div class="col-6">
                    <PostingAccountSelectVue
                      :field-color="postingAccountErrorData.fieldColor"
                      :field-label="postingAccountErrorData.fieldLabel"
                      :input-class="postingAccountErrorData.inputClass"
                      id-suffix="ShowReporting"
                      @posting-account-selected="onPostingAccountSelected"
                    />
                  </div>
                </div>

                <div class="row no-gutters flex-lg-nowrap mt-3">
                  <div class="col-12">
                    <button type="submit" class="btn btn-primary mx-2">
                      anzeigen
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div
      class="row justify-content-md-center"
      style="position: relative; height: 55vh"
    >
      <div class="col-xxl-8 col-md-11 col-sm-12 col-xs-12">
        <Bar
          :data="chartData"
          :options="chartOptions"
          v-if="reportingGraphLoaded"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import PostingAccountSelectVue from "@/components/postingaccount/PostingAccountSelect.vue";
import DatepickerVue from "@/components/Datepicker.vue";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import type { ReportingParameter } from "@/model/report/ReportingParameter";
import type { ReportingMonthAmount } from "@/model/report/ReportingMonthAmount";

import ReportControllerHandler from "@/handler/ReportControllerHandler";

import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { validateInputField } from "@/tools/views/ValidateInputField";

import { defineComponent } from "vue";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import { Bar } from "vue-chartjs";
import { toFixed } from "@/tools/math";
import { getMonthName } from "@/tools/views/MonthName";
import { formatNumber } from "@/tools/views/FormatNumber";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type ChartDataDataset = {
  data: Array<number | null>;
  backgroundColor: Array<string>;
};
type ChartData = {
  labels: Array<string>;
  datasets: Array<ChartDataDataset>;
};
type ShowReportingData = {
  dataLoaded: boolean;
  reportingGraphLoaded: boolean;
  groupByYear: boolean;
  singlePostingAccounts: boolean;
  startDateMonth: Date | undefined;
  endDateMonth: Date | undefined;
  startDateYear: Date | undefined;
  endDateYear: Date | undefined;
  startDateMonthIsValid: boolean | null;
  startDateMonthErrorMessage: string;
  endDateMonthIsValid: boolean | null;
  endDateMonthErrorMessage: string;
  startDateYearIsValid: boolean | null;
  startDateYearErrorMessage: string;
  endDateYearIsValid: boolean | null;
  endDateYearErrorMessage: string;
  postingAccountIsValid: boolean | null;
  postingAccountErrorMessage: string;
  postingAccountYesIsValid: boolean | null;
  postingAccountYesErrorMessage: string;
  postingAccountNoIsValid: boolean | null;
  postingAccountNoErrorMessage: string;
  postingAccounts: Array<PostingAccount>;
  postingAccountsYes: Array<PostingAccount>;
  postingAccountsNo: Array<PostingAccount>;
  selectedPostingAccountsYes: Array<number>;
  selectedPostingAccountsNo: Array<number>;
  selectedPostingAccount: number;
  chartData: ChartData;
  chartOptions: any;
};

export default defineComponent({
  name: "ShowReporting",
  data(): ShowReportingData {
    return {
      dataLoaded: false,
      reportingGraphLoaded: false,
      groupByYear: false,
      singlePostingAccounts: false,
      startDateMonth: undefined,
      endDateMonth: undefined,
      startDateYear: undefined,
      endDateYear: undefined,
      startDateMonthIsValid: null,
      startDateMonthErrorMessage: "",
      endDateMonthIsValid: null,
      endDateMonthErrorMessage: "",
      startDateYearIsValid: null,
      startDateYearErrorMessage: "",
      endDateYearIsValid: null,
      endDateYearErrorMessage: "",
      postingAccountIsValid: null,
      postingAccountErrorMessage: "",
      postingAccountYesIsValid: null,
      postingAccountYesErrorMessage: "",
      postingAccountNoIsValid: null,
      postingAccountNoErrorMessage: "",
      postingAccounts: new Array<PostingAccount>(),
      postingAccountsYes: new Array<PostingAccount>(),
      postingAccountsNo: new Array<PostingAccount>(),
      selectedPostingAccountsYes: new Array<number>(),
      selectedPostingAccountsNo: new Array<number>(),
      selectedPostingAccount: 0,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "",
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                let label = context.dataset.label || "";

                if (context.parsed.y !== null) {
                  label += formatNumber(+context.parsed.y, 2) + "€";
                }
                return label;
              },
            },
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },

        scales: {
          y: {
            ticks: {
              callback: function (value: number) {
                return formatNumber(value, 0) + "€";
              },
            },
          },
        },
      },
      chartData: {
        labels: new Array<string>(),
        datasets: [
          {
            data: new Array<number | null>(),
            backgroundColor: new Array<string>(),
          },
        ],
      },
    };
  },
  created() {
    this.loadData();
  },
  computed: {
    startDateMonthErrorData(): ErrorData {
      return generateErrorData(
        this.startDateMonthIsValid,
        "Startdatum",
        this.startDateMonthErrorMessage
      );
    },
    endDateMonthErrorData(): ErrorData {
      return generateErrorData(
        this.endDateMonthIsValid,
        "Enddatum",
        this.endDateMonthErrorMessage
      );
    },
    startDateYearErrorData(): ErrorData {
      return generateErrorData(
        this.startDateYearIsValid,
        "Startdatum",
        this.startDateYearErrorMessage
      );
    },
    endDateYearErrorData(): ErrorData {
      return generateErrorData(
        this.endDateYearIsValid,
        "Enddatum",
        this.endDateYearErrorMessage
      );
    },
    groupByYearLabel() {
      return this.groupByYear
        ? "Aggregation auf Jahre"
        : "Aggregation auf Monate";
    },
    singlePostingAccountsLabel() {
      return this.singlePostingAccounts
        ? "Einzelnes Buchungskonto"
        : "Mehrere Buchungskonten";
    },
    postingAccountYesErrorData(): ErrorData {
      return generateErrorData(
        this.postingAccountYesIsValid,
        "eingeschlossen",
        this.postingAccountYesErrorMessage
      );
    },
    postingAccountNoErrorData(): ErrorData {
      return generateErrorData(
        this.postingAccountNoIsValid,
        "ausgeschlossen",
        this.postingAccountNoErrorMessage
      );
    },
    postingAccountErrorData(): ErrorData {
      return generateErrorData(
        this.postingAccountIsValid,
        "Buchungskonto",
        this.postingAccountErrorMessage
      );
    },
  },
  methods: {
    async loadData() {
      this.dataLoaded = false;
      const reportingParameter: ReportingParameter =
        await ReportControllerHandler.showReportingForm();

      const minDate = reportingParameter.startDate;
      const maxDate = reportingParameter.endDate;

      this.startDateMonth = minDate;
      this.startDateYear = minDate;
      this.endDateMonth = maxDate;
      this.endDateYear = maxDate;

      this.postingAccountsYes = reportingParameter.selectedPostingAccounts;
      this.postingAccountsNo = reportingParameter.unselectedPostingAccounts;
      this.postingAccounts = this.postingAccountsYes.concat(
        this.postingAccountsNo
      );
      this.dataLoaded = true;
    },
    validateStartDateMonth() {
      [this.startDateMonthIsValid, this.startDateMonthErrorMessage] =
        validateInputField(this.startDateMonth, "Startdatum angeben!");
    },
    validateEndDateMonth() {
      [this.endDateMonthIsValid, this.endDateMonthErrorMessage] =
        validateInputField(this.endDateMonth, "Enddatum angeben!");
    },
    validateStartDateYear() {
      [this.startDateYearIsValid, this.startDateYearErrorMessage] =
        validateInputField(this.startDateYear, "Startdatum angeben!");
    },
    validateEndDateYear() {
      [this.endDateYearIsValid, this.endDateYearErrorMessage] =
        validateInputField(this.endDateYear, "Enddatum angeben!");
    },
    validatePostingAccountYes() {
      [this.postingAccountYesIsValid, this.postingAccountYesErrorMessage] =
        validateInputField(
          this.postingAccountsYes.length,
          "Buchungskonten angeben!"
        );
    },
    validatePostingAccount() {
      [this.postingAccountIsValid, this.postingAccountErrorMessage] =
        validateInputField(
          this.selectedPostingAccount,
          "Buchungskonto angeben!"
        );
    },
    onPostingAccountSelected(postingAccount: PostingAccount) {
      if (postingAccount) {
        this.selectedPostingAccount = postingAccount.id;
      } else {
        this.selectedPostingAccount = 0;
      }
    },
    startDateMonthSelected(date: Date) {
      this.startDateMonth = date;
      this.validateStartDateMonth();
    },
    endDateMonthSelected(date: Date) {
      this.endDateMonth = date;
      this.validateEndDateMonth();
    },
    startDateYearSelected(date: Date) {
      this.startDateYear = date;
      this.validateStartDateYear();
    },
    endDateYearSelected(date: Date) {
      this.endDateYear = date;
      this.validateEndDateYear();
    },
    removeAllPostingAccounts() {
      this.postingAccountsNo = this.postingAccounts;
      this.postingAccountsYes = new Array<PostingAccount>();
    },
    movePostingAccounts(
      from: Array<PostingAccount>,
      to: Array<PostingAccount>,
      toBeMovedIds: Array<number>
    ): Array<PostingAccount> {
      const toBeMoved = from.filter((mpa) =>
        toBeMovedIds.find((id) => id == mpa.id)
      );
      const newFrom = from.filter(
        (mpa) => !toBeMovedIds.find((id) => id == mpa.id)
      );
      for (let mpa of toBeMoved) {
        to.push(mpa);
      }
      to.sort((a, b) => a.name.localeCompare(b.name));
      return newFrom;
    },
    removeSelectedPostingAccounts() {
      this.postingAccountsYes = this.movePostingAccounts(
        this.postingAccountsYes,
        this.postingAccountsNo,
        this.selectedPostingAccountsYes
      );
      this.selectedPostingAccountsYes = new Array();
    },
    addAllPostingAccounts() {
      this.postingAccountsNo = new Array<PostingAccount>();
      this.postingAccountsYes = this.postingAccounts;
    },
    addSelectedPostingAccounts() {
      this.postingAccountsNo = this.movePostingAccounts(
        this.postingAccountsNo,
        this.postingAccountsYes,
        this.selectedPostingAccountsNo
      );
      this.selectedPostingAccountsNo = new Array();
    },
    randomColor(): string {
      const possibilities = [1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D"];
      let color = "#";
      for (let i = 1; i <= 6; i++) {
        const rnd = Math.floor(Math.random() * 12) + 1;
        color += possibilities[rnd];
      }
      return color;
    },
    retrieveGraphData(
      reportingParameter: ReportingParameter
    ): Promise<Array<ReportingMonthAmount>> {
      if (this.groupByYear) {
        return ReportControllerHandler.showYearlyReportGraph(
          reportingParameter
        );
      }
      return ReportControllerHandler.showMonthlyReportGraph(reportingParameter);
    },
    makeChartTitle(reportingParameter: ReportingParameter): string {
      const sameYear: boolean =
        reportingParameter.startDate.getFullYear() ===
        reportingParameter.endDate.getFullYear();
      const sameMonth: boolean =
        reportingParameter.startDate.getFullYear() +
          "-" +
          reportingParameter.startDate.getMonth() ===
        reportingParameter.endDate.getFullYear() +
          "-" +
          reportingParameter.endDate.getMonth();

      let chartTitle: string;
      if (this.groupByYear) {
        if (sameYear) {
          chartTitle = reportingParameter.startDate.getFullYear().toString();
        } else {
          chartTitle =
            reportingParameter.startDate.getFullYear() +
            " bis " +
            reportingParameter.endDate.getFullYear();
        }
      } else {
        if (sameMonth) {
          chartTitle =
            getMonthName(reportingParameter.startDate.getMonth()) +
            " " +
            reportingParameter.startDate.getFullYear();
        } else {
          chartTitle =
            getMonthName(reportingParameter.startDate.getMonth()) +
            " " +
            reportingParameter.startDate.getFullYear() +
            " bis " +
            getMonthName(reportingParameter.endDate.getMonth()) +
            " " +
            reportingParameter.endDate.getFullYear();
        }
      }
      return chartTitle;
    },
    async showReportingGraph() {
      let validForm: boolean | null = true;
      const reportingParameter = {} as ReportingParameter;
      if (this.groupByYear) {
        this.validateEndDateYear();
        this.validateStartDateYear();
        validForm =
          validForm && this.startDateYearIsValid && this.startDateYearIsValid;
        if (validForm === true && this.startDateYear && this.endDateYear) {
          reportingParameter.startDate = this.startDateYear;
          reportingParameter.endDate = this.endDateYear;
          reportingParameter.endDate.setMonth(11);
          reportingParameter.endDate.setDate(31);
        }
      } else {
        this.validateEndDateMonth();
        this.validateStartDateMonth();
        validForm =
          validForm && this.startDateMonthIsValid && this.startDateMonthIsValid;
        if (validForm === true && this.startDateMonth && this.endDateMonth) {
          reportingParameter.startDate = this.startDateMonth;
          reportingParameter.endDate = this.endDateMonth;
          reportingParameter.endDate.setMonth(
            reportingParameter.endDate.getMonth() + 1
          );
          reportingParameter.endDate.setDate(0);
        }
      }
      if (this.singlePostingAccounts) {
        this.validatePostingAccount();
        validForm = validForm && this.postingAccountIsValid;
        if (validForm === true) {
          const selectedPostingAccounts = new Array<PostingAccount>();
          const selectedPostingAccount = this.postingAccounts.filter(
            (mpa) => mpa.id == this.selectedPostingAccount
          )[0];
          selectedPostingAccounts.push(selectedPostingAccount);
          reportingParameter.selectedPostingAccounts = selectedPostingAccounts;
        }
      } else {
        this.validatePostingAccountYes();
        validForm = validForm && this.postingAccountYesIsValid;
        if (validForm === true) {
          reportingParameter.selectedPostingAccounts = this.postingAccountsYes;
          reportingParameter.unselectedPostingAccounts = this.postingAccountsNo;
        }
      }
      this.reportingGraphLoaded = false;
      if (validForm === true) {
        let reportingMonthAmounts: Array<ReportingMonthAmount> =
          await this.retrieveGraphData(reportingParameter);

        if (reportingMonthAmounts) {
          let chartTitle = this.makeChartTitle(reportingParameter);

          const resultMap = new Map<string, number>();

          if (this.singlePostingAccounts) {
            chartTitle = this.postingAccountsYes[0].name + " - " + chartTitle;
            for (let reportingMonthAmount of reportingMonthAmounts) {
              let key: string = "";
              if (this.groupByYear) {
                key = reportingMonthAmount.year + "";
              } else {
                key =
                  getMonthName(reportingMonthAmount.month) +
                  " '" +
                  reportingMonthAmount.year.toString().substring(2, 4);
              }
              resultMap.set(key, reportingMonthAmount.amount * -1);
            }
          } else {
            for (let reportingMonthAmount of reportingMonthAmounts) {
              const key = reportingMonthAmount.postingAccountName;
              let amount = resultMap.get(key);
              if (amount === undefined) {
                amount = 0;
              }
              amount = toFixed(amount + reportingMonthAmount.amount * -1, 2);
              resultMap.set(key, amount);
            }

            resultMap[Symbol.iterator] = function* () {
              yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
            };
          }

          this.chartData.labels = new Array();
          this.chartData.datasets[0].data = new Array();
          this.chartOptions.plugins.title.text = chartTitle;

          for (let [key, value] of resultMap) {
            this.chartData.labels.push(key);
            this.chartData.datasets[0].data.push(value);
            this.chartData.datasets[0].backgroundColor.push(this.randomColor());
          }
        }
      }
      this.reportingGraphLoaded = true;
    },
  },
  components: { PostingAccountSelectVue, Bar, DatepickerVue },
});
</script>

<style>
ul.month-selection {
  margin: 0 !important;
}
</style>
