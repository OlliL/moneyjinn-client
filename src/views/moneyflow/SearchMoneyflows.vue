<template>
  <DeleteMoneyflowModalVue
    ref="deleteModal"
    @moneyflow-deleted="searchMoneyflows"
  />
  <EditMoneyflowModalVue
    ref="editModal"
    @moneyflow-updated="searchMoneyflows"
  />

  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Suche nach Geldbewegungen</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-md-9 col-xs-12">
        <div class="card w-100 bg-light">
          <div class="card-body">
            <form @submit.prevent="searchMoneyflows">
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
                  <div class="col-md-2 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="startdate"
                          id="startdate"
                          type="date"
                          @change="validateStartdate"
                          :class="
                            ' form-control ' + startdateErrorData.inputClass
                          "
                        />
                        <label
                          for="startdate"
                          :style="'color: ' + startdateErrorData.fieldColor"
                          >{{ startdateErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-calendar-date"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-md-2 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="enddate"
                          id="enddate"
                          type="date"
                          @change="validateEnddate"
                          :class="
                            ' form-control ' + enddateErrorData.inputClass
                          "
                        />
                        <label
                          for="startdate"
                          :style="'color: ' + enddateErrorData.fieldColor"
                          >{{ enddateErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-calendar-date"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-md-4 col-xs-12">
                    <ContractpartnerSelectVue
                      field-color="black"
                      field-label="Vertragspartner"
                      input-class=""
                      :selected-id="contractpartnerId"
                      id-suffix="SearchMoneyflow"
                      @contractpartner-selected="onContractpartnerSelected"
                    />
                  </div>

                  <div class="col-md-4 col-xs-12">
                    <PostingAccountSelectVue
                      field-color="black"
                      field-label="Buchungskonto"
                      input-class=""
                      :selected-id="postingAccountId"
                      id-suffix="SearchMoneyflow"
                      @posting-account-selected="onPostingAccountSelected"
                    />
                  </div>
                </div>
                <div class="row no-gutters flex-lg-nowrap mb-4">
                  <div class="col-md-4 col-xs-12">
                    <div class="form-floating">
                      <input
                        v-model="comment"
                        id="comment"
                        type="text"
                        class="form-control"
                      />
                      <label for="comment">Kommentar</label>
                    </div>
                  </div>
                  <div
                    class="col-md-1 col-xs-12 justify-content-end d-flex align-items-center"
                  >
                    <div class="form-check form-check-inline form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="featureEqual"
                        id="featureEqual"
                        role="switch"
                      />
                      <label class="form-check-label" for="featureEqual">
                        gleich
                      </label>
                    </div>
                  </div>
                  <div
                    class="col-md-3 col-xs-12 justify-content-end d-flex align-items-center"
                  >
                    <div class="form-check form-check-inline form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="featureCaseSensitive"
                        id="featureCaseSensitive"
                        role="switch"
                      />
                      <label
                        class="form-check-label"
                        for="featureCaseSensitive"
                      >
                        Groß-, Kleinschreibung beachten
                      </label>
                    </div>
                  </div>
                  <div
                    class="col-md-2 col-xs-12 justify-content-end d-flex align-items-center"
                  >
                    <div class="form-check form-check-inline form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="featureRegexp"
                        id="featureRegexp"
                        role="switch"
                      />
                      <label class="form-check-label" for="featureRegexp">
                        regulärer Ausdruck
                      </label>
                    </div>
                  </div>
                  <div
                    class="col-md-2 col-xs-12 justify-content-end d-flex align-items-center"
                  >
                    <div class="form-check form-check-inline form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="featureOnlyMinusAmounts"
                        id="featureOnlyMinusAmounts"
                        role="switch"
                      />
                      <label
                        class="form-check-label"
                        for="featureOnlyMinusAmounts"
                      >
                        nur negative Beträge
                      </label>
                    </div>
                  </div>
                </div>
                <div class="row no-gutters mb-4">
                  <div
                    class="col-md-3 col-xs-12 mx-auto d-flex align-items-center justify-content-center"
                  >
                    <button type="submit" class="btn btn-primary mx-2">
                      Suchen
                    </button>
                    <button
                      type="button"
                      class="btn btn-secondary mx-2"
                      @click="resetForm"
                    >
                      r&uuml;cksetzen
                    </button>
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <div class="form-floating">
                      <select
                        v-model="groupByFirst"
                        id="groupByFirst"
                        class="form-select form-control"
                      >
                        <option :value="GROUP_NONE">&nbsp;</option>
                        <option :value="GROUP_YEAR">Jahr</option>
                        <option :value="GROUP_MONTH">Monat</option>
                        <option :value="GROUP_CONTRACTPARTNER">
                          Vertragspartner
                        </option>
                      </select>

                      <label for="groupByFirst">1. Gruppierungskriterium</label>
                    </div>
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <div class="form-floating">
                      <select
                        v-model="groupBySecond"
                        id="groupBySecond"
                        class="form-select form-control"
                      >
                        <option :value="GROUP_NONE">&nbsp;</option>
                        <option :value="GROUP_YEAR">Jahr</option>
                        <option :value="GROUP_MONTH">Monat</option>
                        <option :value="GROUP_CONTRACTPARTNER">
                          Vertragspartner
                        </option>
                      </select>

                      <label for="groupBySecond"
                        >1. Gruppierungskriterium</label
                      >
                    </div>
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <div class="form-floating">
                      <select
                        v-model="orderBy"
                        id="orderBy"
                        class="form-select form-control"
                      >
                        <option :value="ORDER_NONE">&nbsp;</option>
                        <option :value="ORDER_GROUP">Gruppierung</option>
                        <option :value="ORDER_AMOUNT">Betrag</option>
                        <option :value="ORDER_COMMENT">Kommentar</option>
                      </select>

                      <label for="orderBy">Sortieren nach</label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-md-center" v-if="dataLoaded">
      <div class="col-md-9 col-xs-12">
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th></th>
              <th v-if="colBookingMonth">Buchungsmonat</th>
              <th v-if="colBookingYear">Buchungsjahr</th>
              <th v-if="colContractpartner">Vertragspartner</th>
              <th>Betrag</th>
              <th>Kommentar</th>
            </tr>
          </thead>
          <tbody>
            <SearchMoneyflowResultGroupVue
              v-for="[index, moneyflowGroup] in moneyflowGroups"
              :key="index.toString()"
              :moneyflow-group="moneyflowGroup"
              :moneyflow-group-key="index.toString()"
              :col-booking-month="colBookingMonth"
              :col-booking-year="colBookingYear"
              :col-contractpartner="colContractpartner"
              @delete-moneyflow="deleteMoneyflow"
              @edit-moneyflow="editMoneyflow"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import MoneyflowControllerHandler from "@/handler/MoneyflowControllerHandler";
import PostingAccountSelectVue from "@/components/postingaccount/PostingAccountSelect.vue";
import ContractpartnerSelectVue from "@/components/contractpartner/ContractpartnerSelect.vue";
import DeleteMoneyflowModalVue from "@/components/moneyflow/DeleteMoneyflowModal.vue";
import EditMoneyflowModalVue from "@/components/moneyflow/EditMoneyflowModal.vue";
import SearchMoneyflowResultGroupVue from "@/components/moneyflow/SearchMoneyflowResultGroup.vue";
import { toFixed } from "@/tools/math";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { getISOStringDate } from "@/tools/views/FormatDate";
import { getError } from "@/tools/views/ThrowError";
import { getMonthName } from "@/tools/views/MonthName";
import { validateInputField } from "@/tools/views/ValidateInputField";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { MoneyflowSearchParams } from "@/model/moneyflow/MoneyflowSearchParams";
import type { MoneyflowsValidation } from "@/model/moneyflow/MoneyflowsValidation";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import type { ValidationResult } from "@/model/validation/ValidationResult";

const GROUP_NONE: number = 0;
const GROUP_YEAR: number = 1;
const GROUP_MONTH: number = 2;
const GROUP_CONTRACTPARTNER: number = 3;
const ORDER_NONE: number = 0;
const ORDER_GROUP: number = 1;
const ORDER_AMOUNT: number = 2;
const ORDER_COMMENT: number = 3;

type SearchMoneyflowsData = {
  serverError: Array<String> | undefined;
  startdate: string;
  enddate: string;
  contractpartnerId: number;
  postingAccountId: number;
  comment: string;
  featureEqual: boolean;
  featureCaseSensitive: boolean;
  featureRegexp: boolean;
  featureOnlyMinusAmounts: boolean;
  groupByFirst: number;
  groupBySecond: number;
  orderBy: number;
  startdateIsValid: boolean | null;
  startdateErrorMessage: string;
  enddateIsValid: boolean | null;
  enddateErrorMessage: string;
  GROUP_NONE: number;
  GROUP_YEAR: number;
  GROUP_MONTH: number;
  GROUP_CONTRACTPARTNER: number;
  ORDER_NONE: number;
  ORDER_GROUP: number;
  ORDER_AMOUNT: number;
  ORDER_COMMENT: number;
  moneyflowGroups: Map<String, MoneyflowGroup>;
  colBookingMonth: boolean;
  colBookingYear: boolean;
  colContractpartner: boolean;
  dataLoaded: boolean;
};

type MoneyflowGroup = {
  sortString: string;
  month: number;
  monthString: string;
  year: number;
  contractpartnerName: string;
  amount: number;
  comment: Set<string>;
  commentString: string;
  moneyflows: Array<Moneyflow>;
};

export default defineComponent({
  name: "SearchMoneyflows",
  data(): SearchMoneyflowsData {
    return {
      serverError: {} as Array<String>,
      startdate: "",
      enddate: "",
      contractpartnerId: 0,
      postingAccountId: 0,
      comment: "",
      featureEqual: false,
      featureCaseSensitive: false,
      featureRegexp: false,
      featureOnlyMinusAmounts: false,
      groupByFirst: GROUP_YEAR,
      groupBySecond: GROUP_MONTH,
      orderBy: ORDER_GROUP,
      startdateIsValid: null,
      startdateErrorMessage: "",
      enddateIsValid: null,
      enddateErrorMessage: "",
      GROUP_NONE: GROUP_NONE,
      GROUP_YEAR: GROUP_YEAR,
      GROUP_MONTH: GROUP_MONTH,
      GROUP_CONTRACTPARTNER: GROUP_CONTRACTPARTNER,
      ORDER_NONE: ORDER_NONE,
      ORDER_GROUP: ORDER_GROUP,
      ORDER_AMOUNT: ORDER_AMOUNT,
      ORDER_COMMENT: ORDER_COMMENT,
      moneyflowGroups: new Map<string, MoneyflowGroup>(),
      colBookingMonth: false,
      colBookingYear: false,
      colContractpartner: false,
      dataLoaded: false,
    };
  },
  mounted() {
    this.resetForm();
  },

  computed: {
    formIsValid(): boolean {
      const isValid = this.startdateIsValid && this.enddateIsValid;
      if (isValid === null || isValid === undefined || isValid === true) {
        return true;
      }
      return false;
    },
    startdateErrorData(): ErrorData {
      return generateErrorData(
        this.startdateIsValid,
        "Startdatum",
        this.startdateErrorMessage
      );
    },
    enddateErrorData(): ErrorData {
      return generateErrorData(
        this.enddateIsValid,
        "Enddatum",
        this.enddateErrorMessage
      );
    },
  },
  methods: {
    resetForm() {
      const today = new Date();
      this.enddate = getISOStringDate(today);
      today.setMonth(0);
      today.setDate(1);
      this.startdate = getISOStringDate(today);
      this.contractpartnerId = 0;
      this.postingAccountId = 0;
      this.comment = "";
      this.featureCaseSensitive = false;
      this.featureEqual = false;
      this.featureOnlyMinusAmounts = false;
      this.featureRegexp = false;
      this.groupByFirst = GROUP_YEAR;
      this.groupBySecond = GROUP_MONTH;
      this.orderBy = ORDER_GROUP;
      this.colBookingMonth = false;
      this.colBookingYear = false;
      this.colContractpartner = true;
      this.dataLoaded = false;
      this.serverError = {} as Array<String>;
    },
    validateStartdate() {
      [this.startdateIsValid, this.startdateErrorMessage] = validateInputField(
        this.startdate,
        "Datum angeben!"
      );
    },
    validateEnddate() {
      [this.enddateIsValid, this.enddateErrorMessage] = validateInputField(
        this.enddate,
        "Datum angeben!"
      );
    },
    onContractpartnerSelected(contractpartner: Contractpartner) {
      if (contractpartner) {
        this.contractpartnerId = contractpartner.id;
      }
    },
    onPostingAccountSelected(postingAccount: PostingAccount) {
      if (postingAccount) {
        this.postingAccountId = postingAccount.id;
      }
    },
    followUpServerCall(validationResult: ValidationResult): boolean {
      if (!validationResult.result) {
        this.serverError = new Array<string>();
        for (let resultItem of validationResult.validationResultItems) {
          this.serverError.push(getError(resultItem.error));
        }
      }
      return validationResult.result;
    },
    async searchMoneyflows() {
      this.dataLoaded = false;
      this.serverError = {} as Array<String>;
      const searchParams: MoneyflowSearchParams = {
        startDate: new Date(this.startdate),
        endDate: new Date(this.enddate),
        searchString: this.comment.length > 0 ? this.comment : undefined,
        featureEqual: this.featureEqual,
        featureRegexp: this.featureRegexp,
        featureCaseSensitive: this.featureCaseSensitive,
        featureOnlyMinusAmounts: this.featureOnlyMinusAmounts,
        contractpartnerId:
          this.contractpartnerId > 0 ? this.contractpartnerId : undefined,
        postingAccountId:
          this.postingAccountId > 0 ? this.postingAccountId : undefined,
      };

      this.colBookingMonth =
        this.groupByFirst == GROUP_MONTH || this.groupBySecond == GROUP_MONTH;
      this.colBookingYear =
        !this.colBookingMonth &&
        (this.groupByFirst == GROUP_YEAR || this.groupBySecond == GROUP_YEAR);
      this.colContractpartner =
        this.groupByFirst == GROUP_CONTRACTPARTNER ||
        this.groupBySecond == GROUP_CONTRACTPARTNER;
      const moneyflowsValidation: MoneyflowsValidation =
        await MoneyflowControllerHandler.searchMoneyflows(searchParams);

      const moneyflows = moneyflowsValidation.moneyflows;
      if (
        this.followUpServerCall(moneyflowsValidation.validationResult) &&
        moneyflows
      ) {
        this.groupBy(moneyflows);
        this.makeCommentString();
        switch (this.orderBy) {
          case ORDER_GROUP: {
            this.moneyflowGroups = new Map(
              [...this.moneyflowGroups.entries()].sort((a, b) =>
                a[1].sortString.localeCompare(b[1].sortString)
              )
            );
            break;
          }
          case ORDER_COMMENT: {
            this.moneyflowGroups = new Map(
              [...this.moneyflowGroups.entries()].sort((a, b) =>
                a[1].commentString.localeCompare(b[1].commentString)
              )
            );
            break;
          }
          case ORDER_AMOUNT: {
            this.moneyflowGroups = new Map(
              [...this.moneyflowGroups.entries()].sort(
                (a, b) => a[1].amount - b[1].amount
              )
            );
            break;
          }
        }
        this.dataLoaded = true;
      }
    },
    makeCommentString() {
      this.moneyflowGroups.forEach(
        (value) => (value.commentString = Array.from(value.comment).join(", "))
      );
    },
    groupBy(moneyflows: Array<Moneyflow>) {
      this.moneyflowGroups.clear();
      for (const moneyflow of moneyflows) {
        const groupByKey = this.getGroupByKey(moneyflow);
        let moneyflowGroup = this.moneyflowGroups.get(groupByKey);
        if (moneyflowGroup === undefined) {
          moneyflowGroup = this.initializeMoneyflowGroup(groupByKey, moneyflow);
        }
        moneyflowGroup.amount = toFixed(
          moneyflowGroup.amount + moneyflow.amount,
          2
        );
        moneyflowGroup.comment.add(moneyflow.comment);
        moneyflowGroup.moneyflows.push(moneyflow);
      }
    },
    initializeMoneyflowGroup(
      groupByKey: string,
      moneyflow: Moneyflow
    ): MoneyflowGroup {
      const moneyflowGroup = {
        sortString: this.getSortString(moneyflow),
        amount: 0,
        comment: new Set<string>(),
        moneyflows: new Array<Moneyflow>(),
      } as MoneyflowGroup;

      for (let groupBy of [this.groupByFirst, this.groupBySecond]) {
        switch (groupBy) {
          case GROUP_CONTRACTPARTNER: {
            moneyflowGroup.contractpartnerName = String(
              moneyflow["contractpartnerName"]
            );
            break;
          }
          case GROUP_MONTH: {
            moneyflowGroup.month = moneyflow["bookingDate"].getMonth() + 1;
            moneyflowGroup.monthString = getMonthName(
              moneyflow["bookingDate"].getMonth() + 1
            );
            break;
          }
          case GROUP_YEAR: {
            moneyflowGroup.year = moneyflow["bookingDate"].getFullYear();
            break;
          }
        }
      }
      this.moneyflowGroups.set(groupByKey, moneyflowGroup);
      return moneyflowGroup;
    },
    getSortString(moneyflow: Moneyflow): string {
      let groupByKey = "";
      for (let groupBy of [this.groupByFirst, this.groupBySecond]) {
        switch (groupBy) {
          case GROUP_CONTRACTPARTNER: {
            groupByKey += String(
              moneyflow["contractpartnerName"]
            ).toUpperCase();
            break;
          }
          case GROUP_MONTH: {
            let month = String(moneyflow["bookingDate"].getMonth() + 1);
            if (month.length === 1) groupByKey += "0";
            groupByKey += month;
            break;
          }
          case GROUP_YEAR: {
            groupByKey += String(moneyflow["bookingDate"].getFullYear());
            break;
          }
          default: {
            groupByKey += "";
            break;
          }
        }
        groupByKey += "-";
      }
      return groupByKey;
    },

    getGroupByKey(moneyflow: Moneyflow): string {
      let groupByKey = "";
      for (let groupBy of [this.groupByFirst, this.groupBySecond]) {
        switch (groupBy) {
          case GROUP_CONTRACTPARTNER: {
            groupByKey += String(moneyflow["contractpartnerId"]);
            break;
          }
          case GROUP_MONTH: {
            let month = String(moneyflow["bookingDate"].getMonth() + 1);
            if (month.length === 1) groupByKey += "0";
            groupByKey += month;
            break;
          }
          case GROUP_YEAR: {
            groupByKey += String(moneyflow["bookingDate"].getFullYear());
            break;
          }
          default: {
            groupByKey += "";
            break;
          }
        }
        groupByKey += "-";
      }
      return groupByKey;
    },
    async deleteMoneyflow(id: number) {
      const mmf = await MoneyflowControllerHandler.fetchMoneyflow(id);
      (this.$refs.deleteModal as typeof DeleteMoneyflowModalVue)._show(mmf);
    },
    async editMoneyflow(id: number) {
      const mmf = await MoneyflowControllerHandler.fetchMoneyflow(id);
      (this.$refs.editModal as typeof EditMoneyflowModalVue)._show(mmf);
    },
  },
  components: {
    ContractpartnerSelectVue,
    PostingAccountSelectVue,
    SearchMoneyflowResultGroupVue,
    DeleteMoneyflowModalVue,
    EditMoneyflowModalVue,
  },
});
</script>
