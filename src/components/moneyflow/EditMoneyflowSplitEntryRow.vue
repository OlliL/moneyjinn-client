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
            v-model="mse.amount"
            id="amount"
            type="number"
            step="0.01"
            @change="validateAmount"
            :class="' form-control ' + amountErrorData.inputClass"
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
          v-model="mse.comment"
          id="comment"
          type="text"
          @input="validateComment"
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
        :selected-id="mse.postingAccountId"
        @posting-account-selected="onPostingAccountSelected"
      />
    </div>
    <div class="col-md-2 col-xs-12" v-if="isLastRow">
      <div class="input-group">
        <span class="input-group-text" role="button" @click="useRemainder"
          ><i class="bi bi-arrow-left"></i
        ></span>
        <div class="form-floating">
          <input
            id="remainder"
            disabled
            type="number"
            :class="'form-control ' + remainderErrorData.inputClass"
            :value="remainder"
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

import type { MoneyflowSplitEntry } from "@/model/moneyflow/MoneyflowSplitEntry";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { validateInputField } from "@/tools/views/ValidateInputField";
import { defineComponent } from "vue";

type EditMoneyflowSplitEntryData = {
  mse: MoneyflowSplitEntry;
  amountIsValid: boolean | null;
  amountErrorMessage: string;
  commentIsValid: boolean | null;
  commentErrorMessage: string;
  postingaccountIsValid: boolean | null;
  postingaccountErrorMessage: string;
};
export default defineComponent({
  name: "EditMoneyflowSplitEntryRow",
  data(): EditMoneyflowSplitEntryData {
    return {
      mse: {} as MoneyflowSplitEntry,
      amountIsValid: null,
      amountErrorMessage: "",
      commentIsValid: null,
      commentErrorMessage: "",
      postingaccountIsValid: null,
      postingaccountErrorMessage: "",
    };
  },
  emits: [
    "deleteMoneyflowSplitEntryRow",
    "addMoneyflowSplitEntryRow",
    "amountChanged",
    "commentChanged",
    "postingAccountIdChanged",
  ],
  expose: ["validateRow", "rowEmpty"],
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
  },
  watch: {
    amount: function (newVal: number, oldVal: number) {
      if (newVal != oldVal) this.mse.amount = newVal;
    },
    comment: function (newVal: string, oldVal: string) {
      if (newVal != oldVal) this.mse.comment = newVal;
    },
    postingAccountId: function (newVal: number, oldVal: number) {
      if (newVal != oldVal) this.mse.postingAccountId = newVal;
    },
  },
  computed: {
    rowEmpty() {
      return (
        !this.mse.amount && !this.mse.comment && !this.mse.postingAccountId
      );
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
    validateAmount() {
      if (!this.rowEmpty) {
        [this.amountIsValid, this.amountErrorMessage] = validateInputField(
          this.mse.amount,
          "Betrag angeben!"
        );
        if (this.amountIsValid)
          this.$emit("amountChanged", this.index, this.mse.amount);
      }
    },
    validateComment() {
      if (!this.rowEmpty) {
        [this.commentIsValid, this.commentErrorMessage] = validateInputField(
          this.mse.comment,
          "Kommentar angeben!"
        );
        if (this.commentIsValid)
          this.$emit("commentChanged", this.index, this.mse.comment);
      }
    },
    validatePostingaccount() {
      if (!this.rowEmpty) {
        [this.postingaccountIsValid, this.postingaccountErrorMessage] =
          validateInputField(
            this.mse.postingAccountId,
            "Buchungskonto angeben!"
          );
        if (this.postingaccountIsValid)
          this.$emit(
            "postingAccountIdChanged",
            this.index,
            this.mse.postingAccountId
          );
      }
    },
    validateRow(): boolean {
      this.validateAmount();
      this.validateComment();
      this.validatePostingaccount();
      return !!this.formIsValid;
    },
    onPostingAccountSelected(postingAccount: PostingAccount) {
      this.mse.postingAccountId = postingAccount.id;
      this.validatePostingaccount();
    },
    useRemainder() {
      this.mse.amount = this.remainder;
      this.validateAmount();
    },
  },
  components: { PostingAccountSelectVue },
});
</script>
