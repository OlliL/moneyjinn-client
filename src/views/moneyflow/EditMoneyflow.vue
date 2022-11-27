<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Geldbewegung hinzuf&uuml;gen</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-md-4 col-xs-12">
        <select
          class="form-select form-control"
          id="selectmoneyflow"
          v-model="preDefMoneyflowId"
          @change="selectPreDefMoneyflow"
        >
          <option value="0">Neue Buchung</option>
          <option v-for="mcp of preDefMoneyflows" :key="mcp.id" :value="mcp.id">
            {{ mcp.contractpartnerName }} | {{ mcp.amount.toFixed(2) }} &euro; |
            {{ mcp.comment }}
          </option>
        </select>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-9 col-xs-12">
        <form
          @submit.prevent="saveMoneyflow"
          class="d-flex flex-row align-items-center flex-wrap"
        >
          <div class="card w-100 bg-light">
            <div class="card-body">
              <div class="alert alert-danger" v-if="serverError">
                {{ serverError }}
              </div>

              <div class="container-fluid">
                <div class="row no-gutters flex-lg-nowrap mb-4">
                  <div class="col-md-2 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="bookingdate"
                          id="bookingdate"
                          type="date"
                          @change="validateBookingdate"
                          :class="
                            ' form-control ' + bookingdateErrorData.inputClass
                          "
                        />
                        <label
                          for="bookingdate"
                          :style="'color: ' + bookingdateErrorData.fieldColor"
                          >{{ bookingdateErrorData.fieldLabel }}</label
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
                          v-model="invoicedate"
                          id="invoicedate"
                          type="date"
                          class="form-control"
                        />
                        <label for="invoicedate">Rechnungsdatum</label>
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-calendar-date"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-md-4 col-xs-12">
                    <ContractpartnerSelectVue
                      :field-color="contractpartnerErrorData.fieldColor"
                      :field-label="contractpartnerErrorData.fieldLabel"
                      :input-class="contractpartnerErrorData.inputClass"
                      :validity-date="validityDate"
                      :selected-id="mmf.contractpartnerId"
                      @contractpartner-selected="onContractpartnerSelected"
                    />
                  </div>

                  <div class="col-md-4 col-xs-12">
                    <CapitalsourceSelectVue
                      :field-color="capitalsourceErrorData.fieldColor"
                      :field-label="capitalsourceErrorData.fieldLabel"
                      :input-class="capitalsourceErrorData.inputClass"
                      :validity-date="validityDate"
                      :selected-id="mmf.capitalsourceId"
                      @capitalsource-selected="onCapitalsourceSelected"
                    />
                  </div>
                </div>

                <div class="row no-gutters flex-lg-nowrap mb-4">
                  <div class="col-md-2 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="mmf.amount"
                          id="amount"
                          type="number"
                          step="0.01"
                          @change="validateAmount"
                          :class="' form-control ' + amountErrorData.inputClass"
                        />
                        <label
                          for="amount"
                          :style="'color: ' + amountErrorData.fieldColor"
                          >{{ amountErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-currency-euro"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-md-4 col-xs-12">
                    <div class="form-floating">
                      <input
                        v-model="mmf.comment"
                        id="comment"
                        type="text"
                        @input="validateComment"
                        :class="'form-control ' + commentErrorData.inputClass"
                      />
                      <label
                        for="comment"
                        :style="'color: ' + commentErrorData.fieldColor"
                        >{{ commentErrorData.fieldLabel }}</label
                      >
                    </div>
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <PostingAccountSelectVue
                      :field-color="postingaccountErrorData.fieldColor"
                      :field-label="postingaccountErrorData.fieldLabel"
                      :input-class="postingaccountErrorData.inputClass"
                      :selected-id="mmf.postingAccountId"
                      @posting-account-selected="onPostingAccountSelected"
                    />
                  </div>
                  <div
                    class="col-md-3 col-xs-12 d-flex align-items-center justify-content-center"
                  >
                    <div class="btn-group" role="group">
                      <input
                        type="radio"
                        class="btn-check"
                        name="public-private"
                        id="public"
                        autocomplete="off"
                        v-model="mmf.private"
                        :value="false"
                      />
                      <label class="btn btn-outline-success" for="public"
                        ><small>&ouml;ffentlich</small></label
                      >

                      <input
                        type="radio"
                        class="btn-check"
                        name="public-private"
                        id="private"
                        autocomplete="off"
                        v-model="mmf.private"
                        :value="true"
                      />
                      <label class="btn btn-outline-danger" for="private"
                        ><small>privat</small></label
                      >
                    </div>
                    &nbsp; &nbsp;
                    <div class="btn-group" role="group">
                      <input
                        type="radio"
                        class="btn-check"
                        name="once-favorite"
                        id="once"
                        autocomplete="off"
                        v-model="saveAsPreDefMoneyflow"
                        :value="false"
                      />
                      <label class="btn btn-outline-secondary" for="once"
                        ><small>{{ toggleTextOff }}</small></label
                      >

                      <input
                        type="radio"
                        class="btn-check"
                        name="once-favorite"
                        id="favorite"
                        autocomplete="off"
                        v-model="saveAsPreDefMoneyflow"
                        :value="true"
                      />
                      <label class="btn btn-outline-primary" for="favorite"
                        ><small>{{ toggleTextOn }}</small></label
                      >
                    </div>
                  </div>
                </div>

                <div class="row no-gutters flex-lg-nowrap mb-4">
                  <div class="col-12">
                    <div class="card w-100 bg-light d-none d-lg-block">
                      <div class="card-header text-start">
                        <a
                          data-bs-toggle="collapse"
                          href="#collapseSplitEntries"
                          >Unterbuchungen</a
                        >
                      </div>
                      <div class="collapse" id="collapseSplitEntries">
                        <div class="card-body">
                          <div class="row">
                            <div
                              class="col-md-1 d-flex align-items-center justify-content-center"
                            >
                              <div class="btn-group" role="group">
                                <button type="button" class="btn btn-primary">
                                  <i class="bi bi-dash"></i></button
                                ><button type="button" class="btn btn-primary">
                                  <i class="bi bi-plus"></i>
                                </button>
                              </div>
                            </div>
                            <div class="col-md-2 col-xs-12">
                              <div class="input-group">
                                <div class="form-floating">
                                  <input
                                    v-model="mmf.amount"
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    @change="validateAmount"
                                    :class="
                                      ' form-control ' +
                                      amountErrorData.inputClass
                                    "
                                  />
                                  <label
                                    for="amount"
                                    :style="
                                      'color: ' + amountErrorData.fieldColor
                                    "
                                    >{{ amountErrorData.fieldLabel }}</label
                                  >
                                </div>
                                <span class="input-group-text"
                                  ><i class="bi bi-currency-euro"></i
                                ></span>
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-12">
                              <div class="form-floating">
                                <input
                                  v-model="mmf.comment"
                                  id="comment"
                                  type="text"
                                  @input="validateComment"
                                  :class="
                                    'form-control ' +
                                    commentErrorData.inputClass
                                  "
                                />
                                <label
                                  for="comment"
                                  :style="
                                    'color: ' + commentErrorData.fieldColor
                                  "
                                  >{{ commentErrorData.fieldLabel }}</label
                                >
                              </div>
                            </div>
                            <div class="col-md-3 col-xs-12">
                              <PostingAccountSelectVue
                                :field-color="
                                  postingaccountErrorData.fieldColor
                                "
                                :field-label="
                                  postingaccountErrorData.fieldLabel
                                "
                                :input-class="
                                  postingaccountErrorData.inputClass
                                "
                                :selected-id="mmf.postingAccountId"
                                @posting-account-selected="
                                  onPostingAccountSelected
                                "
                              />
                            </div>
                            <div class="col-md-2 col-xs-12">
                              <div class="input-group">
                                <span class="input-group-text" role="button"
                                  ><i class="bi bi-arrow-left"></i
                                ></span>
                                <div class="form-floating">
                                  <input
                                    id="password"
                                    type="password"
                                    class="form-control"
                                  />
                                  <label for="password">Rest</label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row no-gutters flex-lg-nowrap">
                  <div class="col-12">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click="resetForm"
                    >
                      r&uuml;cksetzen
                    </button>
                    &nbsp;&nbsp;
                    <button type="submit" class="btn btn-primary">
                      Speichern
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ContractpartnerSelectVue from "@/components/contractpartner/ContractpartnerSelect.vue";
import CapitalsourceSelectVue from "@/components/capitalsource/CapitalsourceSelect.vue";
import PostingAccountSelectVue from "@/components/postingaccount/PostingAccountSelect.vue";

import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";

import PreDefMoneyflowControllerHandler from "@/handler/PreDefMoneyflowControllerHandler";

import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { validateInputField } from "@/tools/views/ValidateInputField";
import { preDefMoneyflowAlreadyUsedThisMonth } from "@/model/moneyflow/PreDefMoneyflow";

//FIXME: MoneyflowSplitEntries
// --> place each row into a sub-component
// --> component props are:
// ------> MoneyflowSplitEntry
// ------> remainingAmount
// ------> mainComment
// ------> mainPostingAccountId
// ------> index
// ------> length of array -1
// --> v-for on the row-div - ref is then set up as an array (order not guaranteed)
// --> provide 2 functions in the component
// --> a) validateRow - to validate the row. return false if not valid
// --> b) getSplitEntry - to return the entered split entry object
// --> amount change fires an event to calculate the remainder in the parent component
// --> remainder and + button is shown in the last component only (use provided index + length)
// --> "+" and "-" buttons fire events to maintain the array-size in the parent component
// ------> array index needs to be sent with the minus - event for deleting the right array element
// ------> array plus - event gets the id of the last array entry adds 1 and uses that as id for the new element
// --> submit on the parent component loops through refs and calls validate. If all are valid, all split entries are collected, sorted by id and then used for saving.
//FIXME: Creation of Capitalsources, Contractpartner, PostingAccounts
//FIXME: only show PostingAccount "+" when user is admin
//FIXME: save on server

type EditMoneyflowData = {
  serverError: string;
  mmf: Moneyflow;
  bookingdateIsValid: boolean | null;
  bookingdateErrorMessage: string;
  contractpartnerIsValid: boolean | null;
  contractpartnerErrorMessage: string;
  capitalsourceIsValid: boolean | null;
  capitalsourceErrorMessage: string;
  amountIsValid: boolean | null;
  amountErrorMessage: string;
  commentIsValid: boolean | null;
  commentErrorMessage: string;
  postingaccountIsValid: boolean | null;
  postingaccountErrorMessage: string;
  bookingdate: string;
  invoicedate: string;
  previousCommentSetByContractpartnerDefaults: string;
  previousPostingAccountSetByContractpartnerDefaults: number;
  preDefMoneyflows: Array<PreDefMoneyflow>;
  preDefMoneyflowId: number;
  saveAsPreDefMoneyflow: boolean;
  toggleTextOffNoPreDefMoneyflow: string;
  toggleTextOnNoPreDefMoneyflow: string;
  toggleTextOffPreDefMoneyflow: string;
  toggleTextOnPreDefMoneyflow: string;
  toggleTextOff: string;
  toggleTextOn: string;
};
export default defineComponent({
  name: "EditMoneyflow",
  data(): EditMoneyflowData {
    return {
      serverError: "",
      mmf: {} as Moneyflow,
      bookingdateIsValid: null,
      bookingdateErrorMessage: "",
      contractpartnerIsValid: null,
      contractpartnerErrorMessage: "",
      capitalsourceIsValid: null,
      capitalsourceErrorMessage: "",
      amountIsValid: null,
      amountErrorMessage: "",
      commentIsValid: null,
      commentErrorMessage: "",
      postingaccountIsValid: null,
      postingaccountErrorMessage: "",
      bookingdate: "",
      invoicedate: "",
      previousCommentSetByContractpartnerDefaults: "",
      previousPostingAccountSetByContractpartnerDefaults: 0,
      preDefMoneyflows: new Array<PreDefMoneyflow>(),
      preDefMoneyflowId: 0,
      saveAsPreDefMoneyflow: false,
      toggleTextOffNoPreDefMoneyflow: "einmalig",
      toggleTextOnNoPreDefMoneyflow: "Favorit",
      toggleTextOffPreDefMoneyflow: "belassen",
      toggleTextOnPreDefMoneyflow: "erneuern",
      toggleTextOff: "",
      toggleTextOn: "",
    };
  },
  async mounted() {
    this.resetForm();
    const allPreDefMoneyflows =
      await PreDefMoneyflowControllerHandler.fetchAllPreDefMoneyflow();
    const today = new Date();
    this.preDefMoneyflows = allPreDefMoneyflows.filter((mpm) => {
      return (
        !mpm.onceAMonth || !preDefMoneyflowAlreadyUsedThisMonth(today, mpm)
      );
    });
  },
  computed: {
    formIsValid() {
      return (
        this.bookingdateIsValid &&
        this.contractpartnerIsValid &&
        this.capitalsourceIsValid &&
        this.amountIsValid &&
        this.commentIsValid &&
        this.postingaccountIsValid
      );
    },
    bookingdateErrorData(): ErrorData {
      return generateErrorData(
        this.bookingdateIsValid,
        "Buchungsdatum",
        this.bookingdateErrorMessage
      );
    },
    contractpartnerErrorData(): ErrorData {
      return generateErrorData(
        this.contractpartnerIsValid,
        "Vertragspartner",
        this.contractpartnerErrorMessage
      );
    },
    capitalsourceErrorData(): ErrorData {
      return generateErrorData(
        this.capitalsourceIsValid,
        "Kapitalquelle",
        this.capitalsourceErrorMessage
      );
    },
    amountErrorData(): ErrorData {
      return generateErrorData(
        this.amountIsValid,
        "Betrag",
        this.amountErrorMessage
      );
    },
    commentErrorData(): ErrorData {
      return generateErrorData(
        this.commentIsValid,
        "Kommentar",
        this.commentErrorMessage
      );
    },
    postingaccountErrorData(): ErrorData {
      return generateErrorData(
        this.postingaccountIsValid,
        "Buchungskonto",
        this.postingaccountErrorMessage
      );
    },
    validityDate(): Date {
      if (this.invoicedate) {
        return new Date(this.invoicedate);
      } else if (this.bookingdateIsValid) {
        return new Date(this.bookingdate);
      } else {
        return new Date();
      }
    },
  },
  methods: {
    resetForm() {
      [this.bookingdate] = new Date().toISOString().split("T");
      this.invoicedate = "";
      this.mmf.contractpartnerId = 0;
      this.mmf.capitalsourceId = 0;
      this.mmf.postingAccountId = 0;
      this.mmf.amount = 0;
      this.mmf.comment = "";
      this.mmf.private = false;
      this.saveAsPreDefMoneyflow = false;
      this.preDefMoneyflowId = 0;

      this.bookingdateIsValid = null;
      this.contractpartnerIsValid = null;
      this.capitalsourceIsValid = null;
      this.amountIsValid = null;
      this.commentIsValid = null;
      this.postingaccountIsValid = null;

      this.previousCommentSetByContractpartnerDefaults = "";
      this.previousPostingAccountSetByContractpartnerDefaults = 0;

      this.toggleTextOff = this.toggleTextOffNoPreDefMoneyflow;
      this.toggleTextOn = this.toggleTextOnNoPreDefMoneyflow;
    },
    validateBookingdate() {
      [this.bookingdateIsValid, this.bookingdateErrorMessage] =
        validateInputField(this.bookingdate, "Datum angeben!");
    },
    validateContractpartner() {
      [this.contractpartnerIsValid, this.contractpartnerErrorMessage] =
        validateInputField(
          this.mmf.contractpartnerId,
          "Vertragspartner angeben!"
        );
    },
    validateCapitalsource() {
      [this.capitalsourceIsValid, this.capitalsourceErrorMessage] =
        validateInputField(this.mmf.capitalsourceId, "Kapitalquelle angeben!");
    },
    validateAmount() {
      [this.amountIsValid, this.amountErrorMessage] = validateInputField(
        this.mmf.amount,
        "Betrag angeben!"
      );
    },
    validateComment() {
      [this.commentIsValid, this.commentErrorMessage] = validateInputField(
        this.mmf.comment,
        "Kommentar angeben!"
      );
    },
    validatePostingaccount() {
      [this.postingaccountIsValid, this.postingaccountErrorMessage] =
        validateInputField(this.mmf.postingAccountId, "Buchungskonto angeben!");
    },
    onContractpartnerSelected(contractpartner: Contractpartner) {
      this.mmf.contractpartnerId = contractpartner.id;
      if (
        this.mmf.comment === this.previousCommentSetByContractpartnerDefaults
      ) {
        this.mmf.comment = contractpartner.moneyflowComment;
        this.previousCommentSetByContractpartnerDefaults =
          contractpartner.moneyflowComment;
        this.validateComment();
      }
      if (
        this.mmf.postingAccountId ===
        this.previousPostingAccountSetByContractpartnerDefaults
      ) {
        const mpaId = contractpartner.postingAccountId
          ? contractpartner.postingAccountId
          : 0;

        this.mmf.postingAccountId = mpaId;
        this.previousPostingAccountSetByContractpartnerDefaults = mpaId;
        this.validatePostingaccount();
      }
      this.validateContractpartner();
    },
    onCapitalsourceSelected(capitalsource: Capitalsource) {
      this.mmf.capitalsourceId = capitalsource.id;
      this.validateCapitalsource();
    },
    onPostingAccountSelected(postingAccount: PostingAccount) {
      this.mmf.postingAccountId = postingAccount.id;
      this.validatePostingaccount();
    },
    selectPreDefMoneyflow() {
      if (this.preDefMoneyflowId <= 0) {
        this.resetForm();
      } else {
        const preDefMoneyflow = this.preDefMoneyflows.find((mpm) => {
          return mpm.id === +this.preDefMoneyflowId;
        });
        if (preDefMoneyflow) {
          this.mmf.amount = preDefMoneyflow.amount;
          this.mmf.contractpartnerId = preDefMoneyflow.contractpartnerId;
          this.mmf.comment = preDefMoneyflow.comment;
          this.mmf.postingAccountId = preDefMoneyflow.postingAccountId;
          this.mmf.capitalsourceId = preDefMoneyflow.capitalsourceId;

          this.toggleTextOff = this.toggleTextOffPreDefMoneyflow;
          this.toggleTextOn = this.toggleTextOnPreDefMoneyflow;
        }
      }
    },
    saveMoneyflow() {
      this.validateAmount();
      this.validateBookingdate();
      this.validateCapitalsource();
      this.validateComment();
      this.validateContractpartner();
      this.validatePostingaccount();

      if (this.formIsValid) {
        this.mmf.bookingDate = new Date(this.bookingdate);
        if (this.invoicedate) this.mmf.invoiceDate = new Date(this.invoicedate);
        console.log(this.preDefMoneyflowId);
        console.log(this.saveAsPreDefMoneyflow);
        console.log(this.mmf);
        alert("save");
      }
    },
  },
  components: {
    ContractpartnerSelectVue,
    CapitalsourceSelectVue,
    PostingAccountSelectVue,
  },
});
</script>
