<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Ausgabenauswertung</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-md-5 col-xs-12">
        <div class="card w-100 bg-light">
          <div class="card-body">
            <form @submit.prevent="showReportingGraph">
              <div class="container-fluid">
                <div class="row no-gutters flex-lg-nowrap mb-2">
                  <div class="col-md-4 col-xs-12" v-show="!groupByYear">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="startDateMonth"
                          id="startDateMonth"
                          type="month"
                          @change="validateStartDateMonth"
                          :class="
                            ' form-control ' +
                            startDateMonthErrorData.inputClass
                          "
                        />
                        <label
                          for="startDateMonth"
                          :style="
                            'color: ' + startDateMonthErrorData.fieldColor
                          "
                          >{{ startDateMonthErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-calendar-date"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-md-4 col-xs-12" v-show="!groupByYear">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="endDateMonth"
                          id="endDateMonth"
                          type="month"
                          @change="validateEndDateMonth"
                          :class="
                            ' form-control ' + endDateMonthErrorData.inputClass
                          "
                        />
                        <label
                          for="endDateMonth"
                          :style="'color: ' + endDateMonthErrorData.fieldColor"
                          >{{ endDateMonthErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-calendar-date"></i
                      ></span>
                    </div>
                  </div>

                  <div class="col-md-4 col-xs-12" v-show="groupByYear">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="startDateYear"
                          id="startDateYear"
                          type="year"
                          @change="validateStartDateYear"
                          :class="
                            ' form-control ' + startDateYearErrorData.inputClass
                          "
                        />
                        <label
                          for="startDateYear"
                          :style="'color: ' + startDateYearErrorData.fieldColor"
                          >{{ startDateYearErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-calendar-date"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-md-4 col-xs-12" v-show="groupByYear">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="endDateYear"
                          id="endDateYear"
                          type="month"
                          @change="validateEndDateYear"
                          :class="
                            ' form-control ' + endDateYearErrorData.inputClass
                          "
                        />
                        <label
                          for="endDateYear"
                          :style="'color: ' + endDateYearErrorData.fieldColor"
                          >{{ endDateYearErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-calendar-date"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-4">
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
                  <div class="col-7">
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
  </div>
</template>

<script lang="ts">
import PostingAccountSelectVue from "@/components/postingaccount/PostingAccountSelect.vue";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import type { ReportingParameter } from "@/model/report/ReportingParameter";

import ReportControllerHandler from "@/handler/ReportControllerHandler";

import { usePostingAccountStore } from "@/stores/PostingAccountStore";

import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { validateInputField } from "@/tools/views/ValidateInputField";

import { defineComponent, toHandlers } from "vue";

type ShowReportingData = {
  dataLoaded: boolean;
  reportingGraphLoaded: boolean;
  groupByYear: boolean;
  singlePostingAccounts: boolean;
  startDateMonth: string;
  endDateMonth: string;
  startDateYear: string;
  endDateYear: string;
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
};

export default defineComponent({
  name: "ShowReporting",
  data(): ShowReportingData {
    return {
      dataLoaded: false,
      reportingGraphLoaded: false,
      groupByYear: false,
      singlePostingAccounts: false,
      startDateMonth: "",
      endDateMonth: "",
      startDateYear: "",
      endDateYear: "",
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
      const minDateYear = minDate.getFullYear();
      const minDateMonth =
        minDate.getMonth() < 9
          ? "0" + (minDate.getMonth() + 1)
          : minDate.getMonth() + 1;
      this.startDateMonth = minDateYear + "-" + minDateMonth;
      this.startDateYear = minDateYear + "";

      const maxDate = reportingParameter.endDate;
      const maxDateYear = maxDate.getFullYear();
      const maxDateMonth =
        maxDate.getMonth() < 9
          ? "0" + (maxDate.getMonth() + 1)
          : maxDate.getMonth() + 1;
      this.endDateMonth = maxDateYear + "-" + maxDateMonth;
      this.endDateYear = maxDateYear + "";

      const postingAccountStore = usePostingAccountStore();
      this.postingAccounts = postingAccountStore.getPostingAccount;

      this.postingAccountsYes = this.postingAccounts.filter((pa) => {
        return !reportingParameter.notSelectedPostingAccountIds.includes(pa.id);
      });
      this.postingAccountsNo = this.postingAccounts.filter((pa) => {
        return reportingParameter.notSelectedPostingAccountIds.includes(pa.id);
      });
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
    showReportingGraph() {
      let validForm: boolean | null = true;
      if (this.groupByYear) {
        this.validateEndDateYear();
        this.validateStartDateYear();
        validForm =
          validForm && this.startDateYearIsValid && this.startDateYearIsValid;
      } else {
        this.validateEndDateMonth();
        this.validateStartDateMonth();
        validForm =
          validForm && this.startDateMonthIsValid && this.startDateMonthIsValid;
      }
      if (this.singlePostingAccounts) {
        this.validatePostingAccount();
        validForm = validForm && this.postingAccountIsValid;
      } else {
        this.validatePostingAccountYes();
        validForm = validForm && this.postingAccountYesIsValid;
      }
      this.reportingGraphLoaded = false;
      if (validForm === true) {
        //FIXME check validity of form
        console.log(this.groupByYear, this.singlePostingAccounts);
      }
      this.reportingGraphLoaded = true;
    },
  },
  components: { PostingAccountSelectVue },
});
</script>

<style>
ul.month-selection {
  margin: 0 !important;
}
</style>
