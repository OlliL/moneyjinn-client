<template>
  <ModalVue :title="title" ref="modalComponent" zIndex="2001">
    <template #body
      ><form
        @submit.prevent="createContractpartnerAccount"
        :id="'createContractpartnerAccountForm' + idSuffix"
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
              <div class="form-floating">
                <input
                  v-model="mca.accountNumber"
                  :id="'comment' + idSuffix"
                  type="text"
                  @input="validateAccountNumber"
                  :class="'form-control ' + accountNumberErrorData.inputClass"
                />
                <label
                  :for="'comment' + idSuffix"
                  :style="'color: ' + accountNumberErrorData.fieldColor"
                  >{{ accountNumberErrorData.fieldLabel }}</label
                >
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <input
                  v-model="mca.bankCode"
                  :id="'comment' + idSuffix"
                  type="text"
                  @input="validateBankCode"
                  :class="'form-control ' + bankCodeErrorData.inputClass"
                />
                <label
                  :for="'comment' + idSuffix"
                  :style="'color: ' + bankCodeErrorData.fieldColor"
                  >{{ bankCodeErrorData.fieldLabel }}</label
                >
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
        :form="'createContractpartnerAccountForm' + idSuffix"
      >
        Speichern
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import ContractpartnerAccountControllerHandler from "@/handler/ContractpartnerAccountControllerHandler";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { validateInputField } from "@/tools/views/ValidateInputField";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";
import { getError } from "@/tools/views/ThrowError";
import type { ValidationResult } from "@/model/validation/ValidationResult";

type CreateContractpartnerAccountModalData = {
  mca: ContractpartnerAccount;
  origMca: ContractpartnerAccount | undefined;
  serverError: Array<String>;
  accountNumberIsValid: boolean | null;
  accountNumberErrorMessage: string;
  bankCodeIsValid: boolean | null;
  bankCodeErrorMessage: string;
};
export default defineComponent({
  name: "CreateContractpartnerAccountModal",
  data(): CreateContractpartnerAccountModalData {
    return {
      mca: {} as ContractpartnerAccount,
      origMca: undefined,
      serverError: {} as Array<String>,
      accountNumberIsValid: null,
      accountNumberErrorMessage: "",
      bankCodeIsValid: null,
      bankCodeErrorMessage: "",
    };
  },
  props: {
    idSuffix: {
      type: String,
      default: "",
    },
    contractpartnerId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    formIsValid(): boolean {
      const isValid = this.accountNumberIsValid && this.bankCodeIsValid;
      if (isValid) {
        return true;
      }
      return false;
    },
    title(): string {
      return this.origMca === undefined
        ? "Vertragspartnerkonto  hinzufügen"
        : "Vertragspartnerkonto  bearbeiten";
    },
    accountNumberErrorData(): ErrorData {
      return generateErrorData(
        this.accountNumberIsValid,
        "IBAN",
        this.accountNumberErrorMessage
      );
    },
    bankCodeErrorData(): ErrorData {
      return generateErrorData(
        this.bankCodeIsValid,
        "BIC",
        this.bankCodeErrorMessage
      );
    },
  },
  methods: {
    async _show(mca?: ContractpartnerAccount) {
      this.origMca = mca ? mca : undefined;
      this.resetForm();
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    resetForm() {
      if (this.origMca) {
        this.mca = JSON.parse(JSON.stringify(this.origMca));
      } else {
        this.mca = {} as ContractpartnerAccount;
        this.mca.contractpartnerid = this.contractpartnerId;
      }
      this.accountNumberIsValid = null;
      this.accountNumberErrorMessage = "";
      this.bankCodeIsValid = null;
      this.bankCodeErrorMessage = "";
      this.serverError = {} as Array<String>;
    },
    validateAccountNumber() {
      [this.accountNumberIsValid, this.accountNumberErrorMessage] =
        validateInputField(this.mca.accountNumber, "IBAN angeben!");
    },
    validateBankCode() {
      [this.bankCodeIsValid, this.bankCodeErrorMessage] = validateInputField(
        this.mca.bankCode,
        "BIC angeben!"
      );
    },
    handleServerError(validationResult: ValidationResult): boolean {
      if (!validationResult.result) {
        this.serverError = new Array<string>();
        for (let resultItem of validationResult.validationResultItems) {
          this.serverError.push(
            getError(resultItem.error, resultItem.variableArray)
          );
        }
      }
      return !validationResult.result;
    },
    async createContractpartnerAccount() {
      this.validateAccountNumber();
      this.validateBankCode();

      if (this.formIsValid) {
        if (this.mca.id > 0) {
          //update
          const validationResult =
            await ContractpartnerAccountControllerHandler.updateContractpartnerAccount(
              this.mca
            );
          if (!this.handleServerError(validationResult)) {
            (this.$refs.modalComponent as typeof ModalVue)._hide();
            this.$emit("contractpartnerAccountUpdated", this.mca);
          }
        } else {
          // create
          const contractpartnerAccountValidation =
            ContractpartnerAccountControllerHandler.createContractpartnerAccount(
              this.mca
            );
          const validationResult = await (
            await contractpartnerAccountValidation
          ).validationResult;
          if (!this.handleServerError(validationResult)) {
            this.mca = (await contractpartnerAccountValidation).mca;
            (this.$refs.modalComponent as typeof ModalVue)._hide();
            this.$emit("contractpartnerAccountCreated", this.mca);
          }
        }
      }
    },
  },
  expose: ["_show"],
  emits: ["contractpartnerAccountCreated", "contractpartnerAccountUpdated"],
  components: { ModalVue },
});
</script>
