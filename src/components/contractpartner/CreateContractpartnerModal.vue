<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form
        @submit.prevent="createContractpartner"
        :id="'createContractpartnerForm' + idSuffix"
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
                  v-model="mcp.name"
                  :id="'comment' + idSuffix"
                  type="text"
                  @input="validateComment"
                  :class="'form-control ' + nameErrorData.inputClass"
                />
                <label
                  :for="'comment' + idSuffix"
                  :style="'color: ' + nameErrorData.fieldColor"
                  >{{ nameErrorData.fieldLabel }}</label
                >
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <input
                  v-model="mcp.moneyflowComment"
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
                field-color="black"
                field-label="Buchungskonto"
                input-class=""
                :selected-id="mcp.postingAccountId"
                :id-suffix="idSuffix + 'CreateContractpartner'"
                @posting-account-selected="onPostingAccountSelected"
              />
            </div>
          </div>

          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <input
                  v-model="mcp.street"
                  :id="'street' + idSuffix"
                  type="text"
                  class="form-control"
                />
                <label :for="'street' + idSuffix">Stra&szlig;e</label>
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <input
                  v-model="mcp.postcode"
                  :id="'postcode' + idSuffix"
                  type="text"
                  class="form-control"
                />
                <label :for="'postcode' + idSuffix">Postleitzahl</label>
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <input
                  v-model="mcp.town"
                  :id="'town' + idSuffix"
                  type="text"
                  class="form-control"
                />
                <label :for="'town' + idSuffix">Stadt</label>
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <input
                  v-model="mcp.country"
                  :id="'country' + idSuffix"
                  type="text"
                  class="form-control"
                />
                <label :for="'country' + idSuffix">Land</label>
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <DatepickerVue
                :id="'validFrom' + idSuffix"
                :label="validFromErrorData.fieldLabel"
                :default-date="mcp.validFrom"
                :input-class="' form-control ' + validFromErrorData.inputClass"
                :label-style="'color: ' + validFromErrorData.fieldColor"
                @date-selected="validFromSelected"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <DatepickerVue
                :id="'validTil' + idSuffix"
                :label="validTilErrorData.fieldLabel"
                :default-date="mcp.validTil"
                :input-class="' form-control ' + validTilErrorData.inputClass"
                :label-style="'color: ' + validTilErrorData.fieldColor"
                @date-selected="validTilSelected"
              />
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
        :form="'createContractpartnerForm' + idSuffix"
      >
        Speichern
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import PostingAccountSelectVue from "@/components/postingaccount/PostingAccountSelect.vue";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import ContractpartnerControllerHandler from "@/handler/ContractpartnerControllerHandler";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { getError } from "@/tools/views/ThrowError";
import { validateInputField } from "@/tools/views/ValidateInputField";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";
import { mapActions } from "pinia";
import { useContractpartnerStore } from "@/stores/ContractpartnerStore";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import DatepickerVue from "../Datepicker.vue";

type CreateContractpartnerModalData = {
  mcp: Contractpartner;
  origMcp: Contractpartner | undefined;
  serverError: Array<String>;
  nameIsValid: boolean | null;
  nameErrorMessage: string;
  validFromIsValid: boolean | null;
  validFromErrorMessage: string;
  validTilIsValid: boolean | null;
  validTilErrorMessage: string;
};
export default defineComponent({
  name: "CreateContractpartnerModal",
  data(): CreateContractpartnerModalData {
    return {
      mcp: {} as Contractpartner,
      origMcp: undefined,
      serverError: {} as Array<String>,
      nameIsValid: null,
      nameErrorMessage: "",
      validFromIsValid: null,
      validFromErrorMessage: "",
      validTilIsValid: null,
      validTilErrorMessage: "",
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
        this.nameIsValid && this.validFromIsValid && this.validTilIsValid;
      if (isValid) {
        return true;
      }
      return false;
    },
    title(): string {
      return this.origMcp === undefined
        ? "Vertragspartner hinzufügen"
        : "Vertragspartner bearbeiten";
    },
    nameErrorData(): ErrorData {
      return generateErrorData(this.nameIsValid, "Name", this.nameErrorMessage);
    },
    validFromErrorData(): ErrorData {
      return generateErrorData(
        this.validFromIsValid,
        "Gültig ab",
        this.validFromErrorMessage
      );
    },
    validTilErrorData(): ErrorData {
      return generateErrorData(
        this.validTilIsValid,
        "Gültig bis",
        this.validTilErrorMessage
      );
    },
  },
  methods: {
    async _show(mcp?: Contractpartner) {
      this.origMcp = mcp ? mcp : undefined;
      this.resetForm();
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    ...mapActions(useContractpartnerStore, ["addContractpartnerToStore"]),
    ...mapActions(useContractpartnerStore, ["updateContractpartnerInStore"]),
    resetForm() {
      if (this.origMcp) {
        const validFrom = new Date(this.origMcp.validFrom);
        const validTil = new Date(this.origMcp.validTil);

        this.mcp = {
          country: this.origMcp.country,
          id: this.origMcp.id,
          moneyflowComment: this.origMcp.moneyflowComment,
          name: this.origMcp.name,
          postcode: this.origMcp.postcode,
          postingAccountId: this.origMcp.postingAccountId,
          postingAccountName: this.origMcp.postingAccountName,
          street: this.origMcp.street,
          town: this.origMcp.town,
          userId: this.origMcp.userId,
          validFrom: validFrom,
          validTil: validTil,
        };
      } else {
        const validFrom = new Date();
        const validTil = new Date("2999-12-31");

        this.mcp = {} as Contractpartner;
        this.mcp.validFrom = validFrom;
        this.mcp.validTil = validTil;
      }
      this.nameIsValid = null;
      this.nameErrorMessage = "";
      this.validFromIsValid = null;
      this.validFromErrorMessage = "";
      this.validTilIsValid = null;
      this.validTilErrorMessage = "";
      this.serverError = {} as Array<String>;
    },
    validateComment() {
      [this.nameIsValid, this.nameErrorMessage] = validateInputField(
        this.mcp.name,
        "Bitte Namen angeben!"
      );
    },
    validateValidFrom() {
      [this.validFromIsValid, this.validFromErrorMessage] = validateInputField(
        this.mcp.validFrom,
        "Gültig ab muss angegeben werden!"
      );
    },
    validateValidTil() {
      [this.validTilIsValid, this.validTilErrorMessage] = validateInputField(
        this.mcp.validTil,
        "Gültig bis muss angegeben werden!"
      );
    },
    onPostingAccountSelected(postingAccount: PostingAccount) {
      if (postingAccount) {
        this.mcp.postingAccountId = postingAccount.id;
        this.mcp.postingAccountName = postingAccount.name;
      } else {
        this.mcp.postingAccountId = 0;
        this.mcp.postingAccountName = "";
      }
    },
    validFromSelected(date: Date) {
      this.mcp.validFrom = date;
      this.validateValidFrom();
    },
    validTilSelected(date: Date) {
      this.mcp.validTil = date;
      this.validateValidTil();
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
    async createContractpartner() {
      this.validateComment();
      this.validateValidFrom();
      this.validateValidTil();

      if (this.formIsValid) {
        if (this.mcp.id > 0) {
          //update
          const validationResult =
            await ContractpartnerControllerHandler.updateContractpartner(
              this.mcp
            );
          if (!this.handleServerError(validationResult)) {
            (this.$refs.modalComponent as typeof ModalVue)._hide();
            this.updateContractpartnerInStore(this.mcp);
            this.$emit("contractpartnerUpdated", this.mcp);
          }
        } else {
          //create
          const contractpartnerValidation =
            ContractpartnerControllerHandler.createContractpartner(this.mcp);
          const validationResult = await (
            await contractpartnerValidation
          ).validationResult;

          if (!this.handleServerError(validationResult)) {
            this.mcp = (await contractpartnerValidation).mcp;
            (this.$refs.modalComponent as typeof ModalVue)._hide();
            this.addContractpartnerToStore(this.mcp);
            this.$emit("contractpartnerCreated", this.mcp);
          }
        }
      }
    },
  },
  expose: ["_show"],
  emits: ["contractpartnerCreated", "contractpartnerUpdated"],
  components: { ModalVue, PostingAccountSelectVue, DatepickerVue },
});
</script>
