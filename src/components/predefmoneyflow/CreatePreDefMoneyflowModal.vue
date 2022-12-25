<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form
        @submit.prevent="createPreDefMoneyflow"
        :id="'createPreDefMoneyflowForm' + idSuffix"
      >
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
          <div class="row">
            <div class="col-xs-12">
              <div class="input-group">
                <div class="form-floating">
                  <input
                    v-model="mpm.amount"
                    :id="'amount' + idSuffix"
                    type="number"
                    step="0.01"
                    @change="validateAmount"
                    :class="
                      ' form-control text-end ' + amountErrorData.inputClass
                    "
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
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <ContractpartnerSelectVue
                :field-color="contractpartnerErrorData.fieldColor"
                :field-label="contractpartnerErrorData.fieldLabel"
                :input-class="contractpartnerErrorData.inputClass"
                :validity-date="validityDate"
                :selected-id="mpm.contractpartnerId"
                :id-suffix="'CreatePreDefMoneyflow' + idSuffix"
                @contractpartner-selected="onContractpartnerSelected"
              />
            </div>
          </div>

          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <input
                  v-model="mpm.comment"
                  :id="'moneyflowComment' + idSuffix"
                  type="text"
                  class="form-control"
                />
                <label :for="'moneyflowComment' + idSuffix"
                  >Standard-Kommentar der Geldbewegung</label
                >
              </div>
            </div>
          </div>

          <div class="row pt-2">
            <div class="col-xs-12">
              <PostingAccountSelectVue
                :field-color="postingaccountErrorData.fieldColor"
                :field-label="postingaccountErrorData.fieldLabel"
                :input-class="postingaccountErrorData.inputClass"
                :selected-id="mpm.postingAccountId"
                :id-suffix="'CreatePreDefMoneyflow' + idSuffix"
                @posting-account-selected="onPostingAccountSelected"
              />
            </div>
          </div>

          <div class="row pt-2">
            <div class="col-xs-12">
              <CapitalsourceSelectVue
                :field-color="capitalsourceErrorData.fieldColor"
                :field-label="capitalsourceErrorData.fieldLabel"
                :input-class="capitalsourceErrorData.inputClass"
                :validity-date="validityDate"
                :selected-id="mpm.capitalsourceId"
                :id-suffix="'CreatePreDefMoneyflow' + idSuffix"
                @capitalsource-selected="onCapitalsourceSelected"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <select
                  v-model="mpm.onceAMonth"
                  :id="'onceAMonth' + idSuffix"
                  class="form-select form-control"
                >
                  <option value="false">Nein</option>
                  <option value="true">Ja</option>
                </select>

                <label :for="'onceAMonth' + idSuffix">1x</label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary" @click="resetForm">
        r&uuml;cksetzen
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :form="'createPreDefMoneyflowForm' + idSuffix"
      >
        Speichern
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import CapitalsourceSelectVue from "@/components/capitalsource/CapitalsourceSelect.vue";
import ContractpartnerSelectVue from "@/components/contractpartner/ContractpartnerSelect.vue";
import PostingAccountSelectVue from "@/components/postingaccount/PostingAccountSelect.vue";

import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import PreDefMoneyflowControllerHandler from "@/handler/PreDefMoneyflowControllerHandler";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { getError } from "@/tools/views/ThrowError";
import { validateInputField } from "@/tools/views/ValidateInputField";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";

type CreatePreDefMoneyflowModalData = {
  mpm: PreDefMoneyflow;
  origMpm: PreDefMoneyflow | undefined;
  validityDate: Date;
  serverError: Array<String>;
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
};
export default defineComponent({
  name: "CreatePreDefMoneyflowModal",
  data(): CreatePreDefMoneyflowModalData {
    return {
      mpm: {} as PreDefMoneyflow,
      origMpm: undefined,
      serverError: {} as Array<String>,
      validityDate: new Date(),
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
    };
  },
  props: {
    idSuffix: {
      type: String,
      default: "",
    },
  },
  computed: {
    formIsValid(): boolean {
      const isValid =
        this.contractpartnerIsValid &&
        this.capitalsourceIsValid &&
        this.amountIsValid &&
        this.commentIsValid &&
        this.postingaccountIsValid;
      if (isValid === null || isValid === undefined || isValid === true) {
        return true;
      }
      return false;
    },
    title(): string {
      return this.origMpm === undefined
        ? "Vordefinierte Geldbewegung hinzufügen"
        : "Vordefinierte Geldbewegung bearbeiten";
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
  },
  methods: {
    async _show(mpm?: PreDefMoneyflow) {
      this.origMpm = mpm ? mpm : undefined;
      this.resetForm();
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    resetForm() {
      if (this.origMpm) {
        this.mpm = JSON.parse(JSON.stringify(this.origMpm));
      } else {
        this.mpm = {} as PreDefMoneyflow;
        this.mpm.contractpartnerId = 0;
        this.mpm.contractpartnerName = "";
        this.mpm.capitalsourceId = 0;
        this.mpm.capitalsourceComment = "";
        this.mpm.postingAccountId = 0;
        this.mpm.postingAccountName = "";
        this.mpm.comment = "";
      }
      this.contractpartnerIsValid = null;
      this.capitalsourceIsValid = null;
      this.amountIsValid = null;
      this.commentIsValid = null;
      this.postingaccountIsValid = null;
      this.serverError = {} as Array<String>;
      this.validityDate = new Date();
    },
    validateContractpartner() {
      [this.contractpartnerIsValid, this.contractpartnerErrorMessage] =
        validateInputField(
          this.mpm.contractpartnerId,
          "Vertragspartner angeben!"
        );
    },
    validateCapitalsource() {
      [this.capitalsourceIsValid, this.capitalsourceErrorMessage] =
        validateInputField(this.mpm.capitalsourceId, "Kapitalquelle angeben!");
    },
    validateAmount() {
      [this.amountIsValid, this.amountErrorMessage] = validateInputField(
        this.mpm.amount,
        "Betrag angeben!"
      );
    },
    validateComment() {
      [this.commentIsValid, this.commentErrorMessage] = validateInputField(
        this.mpm.comment,
        "Kommentar angeben!"
      );
    },
    validatePostingaccount() {
      [this.postingaccountIsValid, this.postingaccountErrorMessage] =
        validateInputField(this.mpm.postingAccountId, "Buchungskonto angeben!");
    },
    onContractpartnerSelected(contractpartner: Contractpartner) {
      if (contractpartner) {
        this.mpm.contractpartnerId = contractpartner.id;
        this.mpm.contractpartnerName = contractpartner.name;
      } else {
        this.mpm.contractpartnerId = 0;
        this.mpm.contractpartnerName = "";
      }
      this.validateContractpartner();
    },
    onCapitalsourceSelected(capitalsource: Capitalsource) {
      if (capitalsource) {
        this.mpm.capitalsourceId = capitalsource.id;
        this.mpm.capitalsourceComment = capitalsource.comment;
      } else {
        this.mpm.capitalsourceId = 0;
        this.mpm.capitalsourceComment = "";
      }
      this.validateCapitalsource();
    },
    onPostingAccountSelected(postingAccount: PostingAccount) {
      if (postingAccount) {
        this.mpm.postingAccountId = postingAccount.id;
        this.mpm.postingAccountName = postingAccount.name;
      } else {
        this.mpm.postingAccountId = 0;
        this.mpm.postingAccountName = "";
      }
      this.validatePostingaccount();
    },
    handleServerError(validationResult: ValidationResult): boolean {
      if (!validationResult.result) {
        this.serverError = new Array<string>();
        for (let resultItem of validationResult.validationResultItems) {
          this.serverError.push(getError(resultItem.error));
        }
      }
      return !validationResult.result;
    },
    async createPreDefMoneyflow() {
      this.validateAmount();
      this.validateCapitalsource();
      this.validateComment();
      this.validateContractpartner();
      this.validatePostingaccount();

      if (this.formIsValid) {
        if (this.mpm.id > 0) {
          //update
          const validationResult =
            await PreDefMoneyflowControllerHandler.updatePreDefMoneyflow(
              this.mpm
            );
          if (!this.handleServerError(validationResult)) {
            (this.$refs.modalComponent as typeof ModalVue)._hide();
            this.$emit("preDefMoneyflowUpdated", this.mpm);
          }
        } else {
          //create
          const preDefMoneyflowValidation =
            PreDefMoneyflowControllerHandler.createPreDefMoneyflow(this.mpm);
          const validationResult = await (
            await preDefMoneyflowValidation
          ).validationResult;

          if (!this.handleServerError(validationResult)) {
            this.mpm = (await preDefMoneyflowValidation).preDefMoneyflow;
            (this.$refs.modalComponent as typeof ModalVue)._hide();
            this.$emit("preDefMoneyflowCreated", this.mpm);
          }
        }
      }
    },
  },
  expose: ["_show"],
  emits: ["preDefMoneyflowCreated", "preDefMoneyflowUpdated"],
  components: {
    ModalVue,
    PostingAccountSelectVue,
    ContractpartnerSelectVue,
    CapitalsourceSelectVue,
  },
});
</script>
