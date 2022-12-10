<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Suche nach Geldbewegungen</h4>
      </div>
    </div>
    <div class="row justify-content-md-center">
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
                      :validity-date="new Date()"
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
                <div class="row no-gutters flex-lg-nowrap mb-4">
                  <div class="col-md-3 col-xs-12 d-grid gap-2 col-6 mx-auto">
                    <button type="submit" class="btn btn-primary">
                      Suchen
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
                        v-model="groupBySecond"
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
  </div>
</template>
<script lang="ts">
import PostingAccountSelectVue from "@/components/postingaccount/PostingAccountSelect.vue";
import ContractpartnerSelectVue from "@/components/contractpartner/ContractpartnerSelect.vue";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { validateInputField } from "@/tools/views/ValidateInputField";
import { defineComponent } from "vue";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { getISOStringDate } from "@/tools/views/FormatDate";
import type { MoneyflowSearchParams } from "@/model/moneyflow/MoneyflowSearchParams";
import MoneyflowControllerHandler from "@/handler/MoneyflowControllerHandler";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

//FIXME - ValidityDate for Contractpartner needs to be range!
//FIXME - sorting
//FIXME - grouping
//FIXME - display result
//FIXME - show edit Modal with loading full moneyflowdata (including split entries)

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
    };
  },
  mounted() {
    const today = new Date();
    this.enddate = getISOStringDate(today);
    today.setMonth(0);
    today.setDate(1);
    this.startdate = getISOStringDate(today);
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
    async searchMoneyflows() {
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

      const moneyflows: Array<Moneyflow> =
        await MoneyflowControllerHandler.searchMoneyflows(searchParams);

      console.log(moneyflows);
    },
  },
  components: { ContractpartnerSelectVue, PostingAccountSelectVue },
});
</script>
