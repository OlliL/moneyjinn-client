<template>
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
      <DatepickerVue
        id="bookingdate"
        :label="bookingdateErrorData.fieldLabel"
        :default-date="mmf.bookingDate"
        :input-class="' form-control ' + bookingdateErrorData.inputClass"
        :label-style="'color: ' + bookingdateErrorData.fieldColor"
        @date-selected="bookingdateSelected"
      />
    </div>
    <div class="col-md-2 col-xs-12">
      <DatepickerVue
        id="invoicedate"
        label="Rechnungsdatum"
        :default-date="mmf.invoiceDate"
        @date-selected="invoicedateSelected"
      />
    </div>
    <div class="col-md-4 col-xs-12">
      <ContractpartnerSelectVue
        :field-color="contractpartnerErrorData.fieldColor"
        :field-label="contractpartnerErrorData.fieldLabel"
        :input-class="contractpartnerErrorData.inputClass"
        :validity-date="validityDate"
        :selected-id="mmf.contractpartnerId"
        :id-suffix="'CreateMoneyflow' + idSuffix"
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
        :id-suffix="'CreateMoneyflow' + idSuffix"
        @capitalsource-selected="onCapitalsourceSelected"
      />
    </div>
  </div>

  <div class="row no-gutters flex-lg-nowrap mb-4">
    <div class="col-md-2 col-xs-12">
      <div class="input-group">
        <div class="form-floating">
          <input
            v-model="amount"
            :id="'amount' + idSuffix"
            type="number"
            step="0.01"
            @change="validateAmount"
            :class="' form-control text-end ' + amountErrorData.inputClass"
            ref="amountRef"
          />
          <label
            :for="'amount' + idSuffix"
            :style="'color: ' + amountErrorData.fieldColor"
            >{{ amountErrorData.fieldLabel }}</label
          >
        </div>
        <span class="input-group-text"
          ><i class="bi bi-currency-euro"></i
        ></span>
      </div>
    </div>
    <div class="col-md-7" v-show="!showMoneyflowFields"></div>
    <div class="col-md-4 col-xs-12" v-show="showMoneyflowFields">
      <div class="form-floating">
        <input
          v-model="mmf.comment"
          :id="'comment' + idSuffix"
          type="text"
          @input="validateComment"
          :class="'form-control ' + commentErrorData.inputClass"
        />
        <label
          :for="'comment' + idSuffix"
          :style="'color: ' + commentErrorData.fieldColor"
          >{{ commentErrorData.fieldLabel }}</label
        >
      </div>
    </div>
    <div class="col-md-3 col-xs-12" v-show="showMoneyflowFields">
      <PostingAccountSelectVue
        :field-color="postingaccountErrorData.fieldColor"
        :field-label="postingaccountErrorData.fieldLabel"
        :input-class="postingaccountErrorData.inputClass"
        :selected-id="mmf.postingAccountId"
        :id-suffix="'CreateMoneyflow' + idSuffix"
        @posting-account-selected="onPostingAccountSelected"
      />
    </div>
    <div
      class="col-md-3 col-xs-12 d-flex align-items-center justify-content-center"
    >
      <div class="btn-group mx-2" role="group">
        <input
          type="radio"
          class="btn-check"
          name="public-private"
          :id="'public' + idSuffix"
          autocomplete="off"
          v-model="mmf.private"
          :value="false"
        />
        <label class="btn btn-outline-success" :for="'public' + idSuffix"
          ><small>&ouml;ffentlich</small></label
        >

        <input
          type="radio"
          class="btn-check"
          name="public-private"
          :id="'private' + idSuffix"
          autocomplete="off"
          v-model="mmf.private"
          :value="true"
        />
        <label class="btn btn-outline-danger" :for="'private' + idSuffix"
          ><small>privat</small></label
        >
      </div>
      <div class="btn-group mx-2" role="group">
        <input
          type="radio"
          class="btn-check"
          name="once-favorite"
          :id="'once' + idSuffix"
          autocomplete="off"
          v-model="saveAsPreDefMoneyflow"
          :value="false"
        />
        <label class="btn btn-outline-secondary" :for="'once' + idSuffix"
          ><small>{{ toggleTextOff }}</small></label
        >

        <input
          type="radio"
          class="btn-check"
          name="once-favorite"
          :id="'favorite' + idSuffix"
          autocomplete="off"
          v-model="saveAsPreDefMoneyflow"
          :value="true"
        />
        <label class="btn btn-outline-primary" :for="'favorite' + idSuffix"
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
            :href="'#collapseSplitEntries' + idSuffix"
            :id="'mseContainer' + idSuffix"
            ref="mseContainer"
            >Unterbuchungen</a
          >
        </div>
        <div class="collapse" :id="'collapseSplitEntries' + idSuffix">
          <div class="card-body">
            <EditMoneyflowSplitEntryRowVue
              v-for="(mse, index) in mmf.moneyflowSplitEntries"
              ref="mseRow"
              :key="mse.id"
              :amount="mse.amount"
              :comment="mse.comment"
              :moneyflowComment="mmf.comment"
              :moneyflowPostingAccountId="mmf.postingAccountId"
              :posting-account-id="mse.postingAccountId"
              :is-last-row="index + 1 === mmf.moneyflowSplitEntries?.length"
              :index="index"
              :remainder="mseRemainder"
              :remainder-is-valid="mseRemainderIsValid"
              @delete-moneyflow-split-entry-row="onDeleteMoneyflowSplitEntryRow"
              @add-moneyflow-split-entry-row="onAddMoneyflowSplitEntryRow"
              @amount-changed="onMoneyflowSplitEntryRowAmountChanged"
              @comment-changed="onMoneyflowSplitEntryRowCommentChanged"
              @posting-account-id-changed="
                onMoneyflowSplitEntryRowPostingAccountIdChanged
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import CapitalsourceSelectVue from "@/components/capitalsource/CapitalsourceSelect.vue";
import ContractpartnerSelectVue from "@/components/contractpartner/ContractpartnerSelect.vue";
import EditMoneyflowSplitEntryRowVue from "@/components/moneyflow/EditMoneyflowSplitEntryRow.vue";
import PostingAccountSelectVue from "@/components/postingaccount/PostingAccountSelect.vue";
import DatepickerVue from "@/components/Datepicker.vue";

import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { MoneyflowSplitEntry } from "@/model/moneyflow/MoneyflowSplitEntry";
import type { MoneyflowValidation } from "@/model/moneyflow/MoneyflowValidation";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import type { ValidationResult } from "@/model/validation/ValidationResult";

import MoneyflowControllerHandler from "@/handler/MoneyflowControllerHandler";
import { useContractpartnerStore } from "@/stores/ContractpartnerStore";

import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { getError } from "@/tools/views/ThrowError";
import { validateInputField } from "@/tools/views/ValidateInputField";
import ImportedMoneyflowControllerHandler from "@/handler/ImportedMoneyflowControllerHandler";
import type { ImportedMoneyflow } from "@/model/moneyflow/ImportedMoneyflow";
import { toFixed } from "@/tools/math";
import { mapActions } from "pinia";

type EditMoneyflowData = {
  serverError: Array<String> | undefined;
  mmf: Moneyflow;
  amount: number | undefined;
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
  previousCommentSetByContractpartnerDefaults: string;
  previousPostingAccountSetByContractpartnerDefaults: number;
  preDefMoneyflowId: number;
  saveAsPreDefMoneyflow: boolean;
  toggleTextOffNoPreDefMoneyflow: string;
  toggleTextOnNoPreDefMoneyflow: string;
  toggleTextOffPreDefMoneyflow: string;
  toggleTextOnPreDefMoneyflow: string;
  toggleTextOff: string;
  toggleTextOn: string;
  mseRowsAreValid: boolean | null;
  mseRemainderIsValid: boolean | undefined;
  showMoneyflowFields: boolean;
  originalMoneyflowSplitEntryIds: Array<number>;
};
export default defineComponent({
  name: "EditMoneyflow",
  data(): EditMoneyflowData {
    return {
      serverError: undefined,
      mmf: {} as Moneyflow,
      amount: undefined,
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
      previousCommentSetByContractpartnerDefaults: "",
      previousPostingAccountSetByContractpartnerDefaults: 0,
      preDefMoneyflowId: 0,
      saveAsPreDefMoneyflow: false,
      toggleTextOffNoPreDefMoneyflow: "einmalig",
      toggleTextOnNoPreDefMoneyflow: "Favorit",
      toggleTextOffPreDefMoneyflow: "belassen",
      toggleTextOnPreDefMoneyflow: "erneuern",
      toggleTextOff: "",
      toggleTextOn: "",
      mseRowsAreValid: null,
      mseRemainderIsValid: undefined,
      showMoneyflowFields: true,
      originalMoneyflowSplitEntryIds: new Array<number>(),
    };
  },
  props: {
    mmfToEdit: {
      type: Object as PropType<Moneyflow>,
      required: false,
    },
    selectedPreDefMoneyflow: {
      type: Object as PropType<PreDefMoneyflow>,
      required: false,
    },
    idSuffix: {
      type: String,
      default: "",
    },
    fillContractpartnerDefaults: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    if (this.fillContractpartnerDefaults) this.resetForm();
  },
  watch: {
    selectedPreDefMoneyflow: function (
      newVal: PreDefMoneyflow | undefined,
      oldVal: PreDefMoneyflow
    ) {
      if (newVal !== oldVal) this.selectPreDefMoneyflow(newVal);
    },
    mmfToEdit: {
      handler(newVal: Moneyflow | undefined, oldVal: Moneyflow) {
        if (newVal !== oldVal) this.resetForm();
      },
    },
  },
  computed: {
    editMode(): boolean {
      if (this.mmfToEdit) {
        return true;
      }
      return false;
    },
    formIsValid(): boolean {
      const isValid =
        this.bookingdateIsValid &&
        this.contractpartnerIsValid &&
        this.capitalsourceIsValid &&
        this.amountIsValid &&
        this.commentIsValid &&
        this.postingaccountIsValid &&
        this.mseRowsAreValid &&
        this.mseRemainderIsValid;
      if (isValid === null || isValid === undefined || isValid === true) {
        return true;
      }
      return false;
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
      if (this.mmf.invoiceDate) {
        return this.mmf.invoiceDate;
      } else if (this.bookingdateIsValid) {
        return this.mmf.bookingDate;
      } else {
        return new Date();
      }
    },
    mseRemainder(): number {
      // avoid floating arithmetic problems by using fixed point arithmetics
      let remainder = 0;
      if (this.amount) {
        remainder = toFixed(this.amount, 2);
        if (this.mmf.moneyflowSplitEntries != undefined) {
          for (const mse of this.mmf.moneyflowSplitEntries) {
            if (mse.amount) remainder = toFixed(remainder - mse.amount, 2);
          }
        }
      }
      return remainder;
    },
  },
  methods: {
    ...mapActions(useContractpartnerStore, ["getContractpartner"]),
    resetForm() {
      if (this.mmfToEdit && this.mmfToEdit.bookingDate) {
        const bookingDate = new Date(this.mmfToEdit.bookingDate);
        const invoiceDate = this.mmfToEdit.invoiceDate
          ? new Date(this.mmfToEdit.invoiceDate)
          : undefined;

        this.mmf = {
          amount: this.mmfToEdit.amount,
          bookingDate: bookingDate,
          capitalsourceId: this.mmfToEdit.capitalsourceId,
          comment: this.mmfToEdit.comment,
          contractpartnerId: this.mmfToEdit.contractpartnerId,
          hasReceipt: this.mmfToEdit.hasReceipt,
          id: this.mmfToEdit.id,
          invoiceDate: invoiceDate,
          postingAccountId: this.mmfToEdit.postingAccountId,
          private: this.mmfToEdit.private,
          userId: this.mmfToEdit.userId,
          capitalsourceComment: this.mmfToEdit.capitalsourceComment,
          contractpartnerName: this.mmfToEdit.contractpartnerName,
          moneyflowSplitEntries: this.mmfToEdit.moneyflowSplitEntries,
          postingAccountName: this.mmfToEdit.postingAccountName,
        };

        this.amount = this.mmf.amount;
        this.originalMoneyflowSplitEntryIds = new Array<number>();
        if (
          this.fillContractpartnerDefaults &&
          this.mmf.contractpartnerId > 0
        ) {
          this.previousCommentSetByContractpartnerDefaults = this.mmf.comment;
          this.previousPostingAccountSetByContractpartnerDefaults =
            this.mmf.postingAccountId;

          const contractpartner = this.getContractpartner(
            this.mmf.contractpartnerId
          );
          if (contractpartner) {
            this.onContractpartnerSelected(contractpartner);
          }
        } else {
          this.previousCommentSetByContractpartnerDefaults = "";
          this.previousPostingAccountSetByContractpartnerDefaults = 0;
        }

        if (this.mmf.moneyflowSplitEntries == undefined) {
          this.mmf.moneyflowSplitEntries = new Array<MoneyflowSplitEntry>();
          this.addNewMoneyflowSplitEntryRow();
          this.addNewMoneyflowSplitEntryRow();
          document
            .getElementById("collapseSplitEntries")
            ?.classList.remove("show");
        } else {
          for (let mse of this.mmf.moneyflowSplitEntries) {
            this.originalMoneyflowSplitEntryIds.push(mse.id);
          }
          this.addNewMoneyflowSplitEntryRow();
          document
            .getElementById("collapseSplitEntries")
            ?.classList.add("show");
        }
        this.toggleMoneyflowFieldsForMse();
      } else {
        this.amount = undefined;

        const bookingDate = new Date();
        this.mmf.bookingDate = bookingDate;
        this.mmf.invoiceDate = undefined;
        this.mmf.contractpartnerId = 0;
        this.mmf.contractpartnerName = "";
        this.mmf.capitalsourceId = 0;
        this.mmf.capitalsourceComment = "";
        this.mmf.postingAccountId = 0;
        this.mmf.postingAccountName = "";
        this.mmf.comment = "";
        this.mmf.private = false;

        this.mmf.moneyflowSplitEntries = new Array<MoneyflowSplitEntry>();
        this.addNewMoneyflowSplitEntryRow();
        this.addNewMoneyflowSplitEntryRow();
        this.showMoneyflowFields = true;

        (this.$refs.amountRef as any).focus();
        this.previousCommentSetByContractpartnerDefaults = "";
        this.previousPostingAccountSetByContractpartnerDefaults = 0;
      }
      this.serverError = undefined;
      this.mseRowsAreValid = null;
      this.mseRemainderIsValid = undefined;

      this.saveAsPreDefMoneyflow = false;
      this.preDefMoneyflowId = 0;

      this.bookingdateIsValid = null;
      this.contractpartnerIsValid = null;
      this.capitalsourceIsValid = null;
      this.amountIsValid = null;
      this.commentIsValid = null;
      this.postingaccountIsValid = null;

      this.toggleTextOff = this.toggleTextOffNoPreDefMoneyflow;
      this.toggleTextOn = this.toggleTextOnNoPreDefMoneyflow;
    },
    /*
     * Moneyflow Split Entry handling
     */
    addNewMoneyflowSplitEntryRow() {
      if (this.mmf.moneyflowSplitEntries !== undefined) {
        const mse = this.mmf.moneyflowSplitEntries;
        const mseLength = mse.length;
        let newMseId = -1;
        if (mseLength > 0) {
          // existing MoneyflowSplitEntries have positive IDs, new created rows must always have negative IDs
          newMseId =
            Math.abs(this.mmf.moneyflowSplitEntries[mseLength - 1].id) * -1 - 1;
        }
        const newMse = {
          id: newMseId,
          moneyflowId: this.mmf.id,
          amount: 0,
          comment: "",
          postingAccountId: 0,
        } as MoneyflowSplitEntry;
        mse.push(newMse);
      }
    },
    onDeleteMoneyflowSplitEntryRow(index: number) {
      const mse = this.mmf.moneyflowSplitEntries;
      if (mse !== undefined) {
        if (mse.length === 2) {
          this.addNewMoneyflowSplitEntryRow();
        }
        mse.splice(index, 1);
        this.validateMseRemainder();
        this.toggleMoneyflowFieldsForMse();
      }
    },
    onAddMoneyflowSplitEntryRow() {
      this.addNewMoneyflowSplitEntryRow();
    },
    onMoneyflowSplitEntryRowAmountChanged(index: number, amount: number) {
      const mse = this.mmf.moneyflowSplitEntries;
      if (mse !== undefined) {
        mse[index]["amount"] = amount;
      }
      this.validateMseRemainder();
      this.toggleMoneyflowFieldsForMse();
    },
    onMoneyflowSplitEntryRowCommentChanged(index: number, comment: string) {
      const mse = this.mmf.moneyflowSplitEntries;
      if (mse !== undefined) {
        mse[index]["comment"] = comment;
      }
      this.validateMseRemainder();
      this.toggleMoneyflowFieldsForMse();
    },
    onMoneyflowSplitEntryRowPostingAccountIdChanged(
      index: number,
      postingAccountId: number,
      postingAccountName: string
    ) {
      const mse = this.mmf.moneyflowSplitEntries;
      if (mse !== undefined) {
        mse[index]["postingAccountId"] = postingAccountId;
        mse[index]["postingAccountName"] = postingAccountName;
      }
      this.validateMseRemainder();
      this.toggleMoneyflowFieldsForMse();
    },
    toggleMoneyflowFieldsForMse() {
      this.showMoneyflowFields = this.allMseRowsAreEmpty();
    },
    allMseRowsAreEmpty(): boolean {
      let allMseRowsAreEmpty = true;
      const mse = this.mmf.moneyflowSplitEntries;
      if (mse !== undefined) {
        for (let entry of mse) {
          if (
            entry.amount !== 0 ||
            entry.comment != "" ||
            entry.postingAccountId !== 0
          ) {
            allMseRowsAreEmpty = false;
            break;
          }
        }
      }
      return allMseRowsAreEmpty;
    },
    validateMseRemainder() {
      if (this.allMseRowsAreEmpty() || this.mseRemainder === 0) {
        this.mseRemainderIsValid = undefined;
      } else {
        this.mseRemainderIsValid = false;
      }
    },
    validateMseRows() {
      let mseRowsValid = true;

      const mseRowRefs = this.$refs.mseRow as Array<
        typeof EditMoneyflowSplitEntryRowVue
      >;
      for (let ref of mseRowRefs) {
        const valid = ref.validateRow() as boolean;
        mseRowsValid &&= valid;
      }

      this.mseRowsAreValid = mseRowsValid;
    },
    /*
     * Moneyflow handling
     */
    validateBookingdate() {
      [this.bookingdateIsValid, this.bookingdateErrorMessage] =
        validateInputField(this.mmf.bookingDate, "Datum angeben!");
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
        this.amount,
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
      if (contractpartner) {
        this.mmf.contractpartnerId = contractpartner.id;
        this.mmf.contractpartnerName = contractpartner.name;
        if (
          this.mmf.comment === this.previousCommentSetByContractpartnerDefaults
        ) {
          this.mmf.comment = contractpartner.moneyflowComment;
          this.previousCommentSetByContractpartnerDefaults =
            contractpartner.moneyflowComment;
          if (contractpartner.moneyflowComment) this.validateComment();
          else this.commentIsValid = null;
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
          if (contractpartner.postingAccountId) this.validatePostingaccount();
          else this.postingaccountIsValid = null;
        }
      } else {
        this.mmf.contractpartnerId = 0;
        this.mmf.contractpartnerName = "";
        if (
          this.mmf.comment === this.previousCommentSetByContractpartnerDefaults
        ) {
          this.mmf.comment = "";
          this.previousCommentSetByContractpartnerDefaults = "";
          this.commentIsValid = null;
        }
        if (
          this.mmf.postingAccountId ===
          this.previousPostingAccountSetByContractpartnerDefaults
        ) {
          this.mmf.postingAccountId = 0;
          this.previousPostingAccountSetByContractpartnerDefaults = 0;
          this.postingaccountIsValid = null;
        }
      }
      this.validateContractpartner();
    },
    onCapitalsourceSelected(capitalsource: Capitalsource) {
      if (capitalsource) {
        this.mmf.capitalsourceId = capitalsource.id;
        this.mmf.capitalsourceComment = capitalsource.comment;
      } else {
        this.mmf.capitalsourceId = 0;
        this.mmf.capitalsourceComment = "";
      }
      this.validateCapitalsource();
    },
    onPostingAccountSelected(postingAccount: PostingAccount) {
      if (postingAccount) {
        this.mmf.postingAccountId = postingAccount.id;
        this.mmf.postingAccountName = postingAccount.name;
      } else {
        this.mmf.postingAccountId = 0;
        this.mmf.postingAccountName = "";
      }
      this.validatePostingaccount();
    },
    selectPreDefMoneyflow(preDefMoneyflow: PreDefMoneyflow | undefined) {
      if (preDefMoneyflow === undefined) {
        this.resetForm();
      } else {
        if (preDefMoneyflow) {
          this.amount = preDefMoneyflow.amount;
          this.mmf.contractpartnerId = preDefMoneyflow.contractpartnerId;
          this.mmf.comment = preDefMoneyflow.comment;
          this.mmf.postingAccountId = preDefMoneyflow.postingAccountId;
          this.mmf.capitalsourceId = preDefMoneyflow.capitalsourceId;

          this.toggleTextOff = this.toggleTextOffPreDefMoneyflow;
          this.toggleTextOn = this.toggleTextOnPreDefMoneyflow;
        }
      }
    },
    bookingdateSelected(date: Date) {
      this.mmf.bookingDate = date;
      this.validateBookingdate();
    },
    invoicedateSelected(date: Date) {
      this.mmf.invoiceDate = date;
    },
    prepareServerCall(): boolean {
      this.validateMseRows();
      this.validateMseRemainder();
      if (!this.allMseRowsAreEmpty() && this.mmf.moneyflowSplitEntries) {
        let mse = {} as MoneyflowSplitEntry;
        for (let filledMse of this.mmf.moneyflowSplitEntries) {
          if (filledMse.comment && filledMse.postingAccountId) {
            mse = filledMse;
            break;
          }
        }
        if (!this.mmf.comment) {
          this.mmf.comment = mse.comment;
        }
        if (!this.mmf.postingAccountId) {
          this.mmf.postingAccountId = mse.postingAccountId;
        }
      }

      this.validateAmount();
      this.validateBookingdate();
      this.validateCapitalsource();
      this.validateComment();
      this.validateContractpartner();
      this.validatePostingaccount();

      if (this.formIsValid) {
        if (this.amount) this.mmf.amount = this.amount;
        // remove empty rows
        if (this.mmf.moneyflowSplitEntries) {
          this.mmf.moneyflowSplitEntries =
            this.mmf.moneyflowSplitEntries.filter(
              (mse) => mse.amount && mse.comment && mse.postingAccountId
            );
        }
        return true;
      }
      return false;
    },
    followUpServerCall(validationResult: ValidationResult): boolean {
      if (!validationResult.result) {
        this.serverError = new Array<string>();
        for (let resultItem of validationResult.validationResultItems) {
          this.serverError.push(getError(resultItem.error));
        }
        if (this.mmf.moneyflowSplitEntries) {
          while (this.mmf.moneyflowSplitEntries.length < 2) {
            this.addNewMoneyflowSplitEntryRow();
          }
        }
        return false;
      }
      return true;
    },
    async importImportedMoneyflow(mim: ImportedMoneyflow) {
      if (this.prepareServerCall()) {
        const importedMoneyflow: ImportedMoneyflow = {
          ...this.mmf,
          accountNumber: mim.accountNumber,
          bankCode: mim.bankCode,
          externalid: mim.externalid,
          name: mim.name,
          usage: mim.usage,
          accountNumberCapitalsource: mim.accountNumberCapitalsource,
          bankCodeCapitalsource: mim.bankCodeCapitalsource,
        };
        const validationResult =
          await ImportedMoneyflowControllerHandler.importImportedMoneyflow(
            importedMoneyflow
          );
        if (this.followUpServerCall(validationResult)) {
          return true;
        }
      }
      return false;
    },
    async deleteImportedMoneyflow(id: number) {
      await ImportedMoneyflowControllerHandler.deleteImportedMoneyflow(id);
    },
    async createMoneyflow(): Promise<boolean> {
      if (this.prepareServerCall()) {
        const validationResult =
          await MoneyflowControllerHandler.createMoneyflow(
            this.mmf,
            this.preDefMoneyflowId,
            this.saveAsPreDefMoneyflow
          );
        if (this.followUpServerCall(validationResult)) {
          return true;
        }
      }
      return false;
    },
    async updateMoneyflow(): Promise<Moneyflow | undefined> {
      if (this.prepareServerCall()) {
        const createMses = new Array<MoneyflowSplitEntry>();
        const updateMses = new Array<MoneyflowSplitEntry>();
        const updateMseIds = new Array<number>();
        if (this.mmf.moneyflowSplitEntries) {
          for (let mse of this.mmf.moneyflowSplitEntries) {
            if (mse.id < 0) {
              createMses.push(mse);
            } else {
              updateMses.push(mse);
              updateMseIds.push(mse.id);
            }
          }
        }
        const deleteMseIds = this.originalMoneyflowSplitEntryIds.filter(
          (mseId) => !updateMseIds.includes(mseId)
        );

        const moneyflowValidation: MoneyflowValidation =
          await MoneyflowControllerHandler.updateMoneyflow(
            this.mmf,
            createMses,
            updateMses,
            deleteMseIds
          );
        const validationResult: ValidationResult =
          moneyflowValidation.validationResult;
        if (this.followUpServerCall(validationResult)) {
          return moneyflowValidation.mmf;
        }
      }
      return undefined;
    },
  },
  expose: [
    "createMoneyflow",
    "updateMoneyflow",
    "resetForm",
    "importImportedMoneyflow",
    "deleteImportedMoneyflow",
  ],
  components: {
    ContractpartnerSelectVue,
    CapitalsourceSelectVue,
    PostingAccountSelectVue,
    EditMoneyflowSplitEntryRowVue,
    DatepickerVue,
  },
});
</script>
