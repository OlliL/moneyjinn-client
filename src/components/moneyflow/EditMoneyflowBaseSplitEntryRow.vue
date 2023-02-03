<template>
  <div class="row p-1">
    <div class="col-md-1 d-flex align-items-center justify-content-start">
      <div class="btn-group" role="group">
        <button
          type="button"
          class="btn btn-primary"
          @click="deleteMoneyflowSplitEntryRow"
        >
          <i class="bi bi-dash"></i></button
        ><button
          type="button"
          class="btn btn-primary"
          @click="addMoneyflowSplitEntryRow"
          v-if="isLastRow"
        >
          <i class="bi bi-plus"></i>
        </button>
      </div>
    </div>
    <div class="col-md-2 col-xs-12">
      <div class="input-group">
        <div class="form-floating">
          <input
            v-model="mseAmount"
            id="amount"
            type="number"
            step="0.01"
            @change="amountChangedWithNewRow"
            :class="' form-control text-end ' + amountErrorData.inputClass"
          />
          <label for="amount" :style="'color: ' + amountErrorData.fieldColor">{{
            amountErrorData.fieldLabel
          }}</label>
        </div>
        <span class="input-group-text"
          ><i class="bi bi-currency-euro"></i
        ></span>
      </div>
    </div>
    <div class="col-md-4 col-xs-12">
      <div class="form-floating">
        <input
          v-model="mseComment"
          id="comment"
          type="text"
          @change="commentChangedWithNewRow"
          :class="'form-control ' + commentErrorData.inputClass"
        />
        <label for="comment" :style="'color: ' + commentErrorData.fieldColor">{{
          commentErrorData.fieldLabel
        }}</label>
      </div>
    </div>
    <div class="col-md-3 col-xs-12">
      <PostingAccountSelectVue
        :field-color="postingaccountErrorData.fieldColor"
        :field-label="postingaccountErrorData.fieldLabel"
        :input-class="postingaccountErrorData.inputClass"
        :selected-id="msePostingAccountId"
        @posting-account-selected="onPostingAccountSelected"
      />
    </div>
    <div class="col-md-2 col-xs-12" v-if="showRemainder">
      <div class="input-group">
        <span class="input-group-text" role="button" @click="useRemainder"
          ><i class="bi bi-arrow-left"></i
        ></span>
        <div class="form-floating">
          <input
            id="remainder"
            disabled
            type="text"
            :class="'form-control ' + remainderErrorData.inputClass"
            :value="remainder.toFixed(2)"
          />
          <label
            for="comment"
            :style="'color: ' + remainderErrorData.fieldColor"
            >{{ remainderErrorData.fieldLabel }}</label
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import PostingAccountSelectVue from "@/components/postingaccount/PostingAccountSelect.vue";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { validateInputField } from "@/tools/views/ValidateInputField";
import { defineComponent } from "vue";

type EditMoneyflowSplitEntryData = {
  mseAmount: number | undefined;
  mseComment: string | undefined;
  msePostingAccountId: number;
  msePostingAccountName: string | undefined;
  amountIsValid: boolean | null;
  amountErrorMessage: string;
  commentIsValid: boolean | null;
  commentErrorMessage: string;
  postingaccountIsValid: boolean | null;
  postingaccountErrorMessage: string;
};
export default defineComponent({
  name: "EditMoneyflowBaseSplitEntryRow",
  data(): EditMoneyflowSplitEntryData {
    return {
      amountIsValid: null,
      amountErrorMessage: "",
      commentIsValid: null,
      commentErrorMessage: "",
      postingaccountIsValid: null,
      postingaccountErrorMessage: "",
      mseAmount: undefined,
      mseComment: undefined,
      msePostingAccountId: 0,
      msePostingAccountName: undefined,
    };
  },
  emits: [
    "deleteMoneyflowSplitEntryRow",
    "addMoneyflowSplitEntryRow",
    "amountChanged",
    "commentChanged",
    "postingAccountIdChanged",
  ],
  expose: ["validateRow"],
  props: {
    amount: {
      type: Number,
      required: false,
    },
    comment: {
      type: String,
      required: false,
    },
    postingAccountId: {
      type: Number,
      required: false,
    },
    isLastRow: {
      type: Boolean,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    remainder: {
      type: Number,
      required: true,
    },
    remainderIsValid: {
      type: Boolean,
      required: false,
    },
    moneyflowComment: {
      type: String,
      required: false,
    },
    moneyflowPostingAccountId: {
      type: Number,
      required: false,
    },
  },
  watch: {
    amount: {
      handler(newVal: number, oldVal: number) {
        // we want to display an empty amount field when 0 is the amount!
        if (newVal === 0) this.mseAmount = undefined;
        else if (newVal !== oldVal) this.mseAmount = newVal;
      },
      immediate: true,
    },
    comment: {
      handler(newVal: string, oldVal: string) {
        if (newVal != oldVal) this.mseComment = newVal;
      },
      immediate: true,
    },
    postingAccountId: {
      handler(newVal: number, oldVal: number) {
        if (newVal != oldVal) this.msePostingAccountId = newVal;
      },
      immediate: true,
    },
    rowEmpty: function (newVal: boolean, oldVal: boolean) {
      // remove all form errors when the row becomes empty again
      if (newVal != oldVal && newVal == true) this.validateRow();
    },
  },
  computed: {
    showRemainder() {
      return this.isLastRow && this.remainder != 0;
    },
    rowEmpty() {
      return !this.mseAmount && !this.mseComment && !this.msePostingAccountId;
    },
    formIsValid() {
      return (
        this.rowEmpty ||
        (this.amountIsValid &&
          this.commentIsValid &&
          this.postingaccountIsValid)
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
    remainderErrorData(): ErrorData {
      return generateErrorData(
        this.remainderIsValid,
        "Rest",
        "Rest muss 0 sein!"
      );
    },
  },
  methods: {
    deleteMoneyflowSplitEntryRow() {
      this.$emit("deleteMoneyflowSplitEntryRow", this.index);
    },
    addMoneyflowSplitEntryRow() {
      this.$emit("addMoneyflowSplitEntryRow");
    },
    /*
     * Amount
     */
    amountChangedWithNewRow() {
      this.amountChanged();
      if (this.isLastRow) this.addMoneyflowSplitEntryRow();
    },
    amountChanged() {
      this.validateAmount();
      let amount = this.mseAmount;
      // when amount is empty, we must send 0 because its a number
      if (!amount) amount = 0;
      this.$emit("amountChanged", this.index, amount);
    },
    validateAmount() {
      if (!this.rowEmpty) {
        [this.amountIsValid, this.amountErrorMessage] = validateInputField(
          this.mseAmount,
          "Betrag angeben!"
        );
      } else {
        this.amountIsValid = null;
      }
    },
    /*
     * Comment
     */
    commentChangedWithNewRow() {
      this.commentChanged();
      if (this.isLastRow) this.addMoneyflowSplitEntryRow();
    },
    commentChanged() {
      this.validateComment();
      this.$emit("commentChanged", this.index, this.mseComment);
    },
    validateComment() {
      if (!this.rowEmpty) {
        [this.commentIsValid, this.commentErrorMessage] = validateInputField(
          this.mseComment,
          "Kommentar angeben!"
        );
      } else {
        this.commentIsValid = null;
      }
    },
    /*
     * PostingAccount
     */
    postingaccountChangedWithNewRow() {
      this.postingaccountChanged();
      if (this.isLastRow) this.addMoneyflowSplitEntryRow();
    },
    postingaccountChanged() {
      this.validatePostingaccount();
      this.$emit(
        "postingAccountIdChanged",
        this.index,
        this.msePostingAccountId,
        this.msePostingAccountName
      );
    },
    validatePostingaccount() {
      if (!this.rowEmpty) {
        [this.postingaccountIsValid, this.postingaccountErrorMessage] =
          validateInputField(
            this.msePostingAccountId,
            "Buchungskonto angeben!"
          );
      } else {
        this.postingaccountIsValid = null;
      }
    },
    validateRow(): boolean {
      this.validateAmount();
      this.validateComment();
      this.validatePostingaccount();
      return !!this.formIsValid;
    },
    onPostingAccountSelected(postingAccount: PostingAccount) {
      // can be undefined when first empty option is selected
      if (postingAccount) {
        this.msePostingAccountId = postingAccount.id;
        this.msePostingAccountName = postingAccount.name;
      } else {
        this.msePostingAccountId = 0;
        this.msePostingAccountName = "";
      }
      this.postingaccountChangedWithNewRow();
    },
    useRemainder() {
      this.mseAmount = this.remainder;
      this.amountChanged();

      if (this.moneyflowComment) {
        this.mseComment = this.moneyflowComment;
        this.commentChanged();
      }

      if (this.moneyflowPostingAccountId) {
        this.msePostingAccountId = this.moneyflowPostingAccountId;
        this.postingaccountChanged();
      }

      if (this.isLastRow) this.addMoneyflowSplitEntryRow();
    },
  },
  components: { PostingAccountSelectVue },
});
</script>
