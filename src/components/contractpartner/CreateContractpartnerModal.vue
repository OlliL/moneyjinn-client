<template>
  <ModalVue title="Kapitalquelle hinzuf&uuml;gen" ref="modalComponent">
    <template #body
      ><form
        @submit.prevent="createContractpartner"
        id="createContractpartnerForm"
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
                  id="comment"
                  type="text"
                  @input="validateComment"
                  :class="'form-control ' + nameErrorData.inputClass"
                />
                <label
                  for="comment"
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
                  id="moneyflowComment"
                  type="text"
                  class="form-control"
                />
                <label for="moneyflowComment"
                  >Standard-Kommentar der Geldbewegung</label
                >
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <input
                  v-model="mcp.street"
                  id="street"
                  type="text"
                  class="form-control"
                />
                <label for="street">Stra&szlig;e</label>
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <input
                  v-model="mcp.postcode"
                  id="postcode"
                  type="text"
                  class="form-control"
                />
                <label for="postcode">Postleitzahl</label>
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <input
                  v-model="mcp.town"
                  id="town"
                  type="text"
                  class="form-control"
                />
                <label for="town">Stadt</label>
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <input
                  v-model="mcp.country"
                  id="country"
                  type="text"
                  class="form-control"
                />
                <label for="country">Land</label>
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="input-group">
                <div class="form-floating">
                  <input
                    v-model="validFrom"
                    id="validFrom"
                    type="date"
                    @change="validateValidFrom"
                    :class="' form-control ' + validFromErrorData.inputClass"
                  />
                  <label
                    for="validFrom"
                    :style="'color: ' + validFromErrorData.fieldColor"
                    >{{ validFromErrorData.fieldLabel }}</label
                  >
                </div>
                <span class="input-group-text"
                  ><i class="bi bi-calendar-date"></i
                ></span>
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="input-group">
                <div class="form-floating">
                  <input
                    v-model="validTil"
                    id="validTil"
                    type="date"
                    @change="validateValidTil"
                    :class="' form-control ' + validTilErrorData.inputClass"
                  />
                  <label
                    for="validTil"
                    :style="'color: ' + validTilErrorData.fieldColor"
                    >{{ validTilErrorData.fieldLabel }}</label
                  >
                </div>
                <span class="input-group-text"
                  ><i class="bi bi-calendar-date"></i
                ></span>
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
        form="createContractpartnerForm"
      >
        Speichern
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import ContractpartnerControllerHandler from "@/handler/ContractpartnerControllerHandler";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { validateInputField } from "@/tools/views/ValidateInputField";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";
import { getError } from "@/tools/views/ThrowError";

type CreateContractpartnerModalData = {
  mcp: Contractpartner;
  validFrom: string;
  validTil: string;
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
      validFrom: "",
      validTil: "",
      serverError: {} as Array<String>,
      nameIsValid: null,
      nameErrorMessage: "",
      validFromIsValid: null,
      validFromErrorMessage: "",
      validTilIsValid: null,
      validTilErrorMessage: "",
    };
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
    async _show() {
      this.resetForm();
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    resetForm() {
      this.mcp = {} as Contractpartner;
      [this.validFrom] = new Date().toISOString().split("T");
      this.validTil = "2999-12-31";
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
        "Kapitalquelle angeben!"
      );
    },
    validateValidFrom() {
      [this.validFromIsValid, this.validFromErrorMessage] = validateInputField(
        this.validFrom,
        "Gültig ab muss angegeben werden!"
      );
    },
    validateValidTil() {
      [this.validTilIsValid, this.validTilErrorMessage] = validateInputField(
        this.validTil,
        "Gültig bis muss angegeben werden!"
      );
    },
    async createContractpartner() {
      this.validateComment();
      this.validateValidFrom();
      this.validateValidTil();

      if (this.formIsValid) {
        this.mcp.validFrom = new Date(this.validFrom);
        this.mcp.validTil = new Date(this.validTil);

        const contractpartnerValidation =
          ContractpartnerControllerHandler.createContractpartner(this.mcp);
        const validationResult = await (
          await contractpartnerValidation
        ).validationResult;

        if (!validationResult.result) {
          this.serverError = new Array<string>();
          for (let resultItem of validationResult.validationResultItems) {
            this.serverError.push(getError(resultItem.error));
          }
        } else {
          this.mcp = (await contractpartnerValidation).mcp;
          (this.$refs.modalComponent as typeof ModalVue)._hide();
          this.$emit("contractpartnerCreated", this.mcp);
        }
      }
    },
  },
  expose: ["_show"],
  emits: ["contractpartnerCreated"],
  components: { ModalVue },
});
</script>
