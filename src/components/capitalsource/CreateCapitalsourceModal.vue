<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form
        @submit.prevent="createCapitalsource"
        :id="'createCapitalsourceForm' + idSuffix"
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
                  v-model="mcs.comment"
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
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <select
                  v-model="mcs.type"
                  :id="'type' + idSuffix"
                  @change="validateType"
                  :class="
                    'form-select form-control ' + typeErrorData.inputClass
                  "
                >
                  <option :value="CapitalsourceType.__PLACEHOLDER"></option>
                  <option :value="CapitalsourceType.CURRENT_ASSET">
                    {{
                      capitalsourceTypeNames[CapitalsourceType.CURRENT_ASSET]
                    }}
                  </option>
                  <option :value="CapitalsourceType.LONG_TERM_ASSET">
                    {{
                      capitalsourceTypeNames[CapitalsourceType.LONG_TERM_ASSET]
                    }}
                  </option>
                  <option :value="CapitalsourceType.RESERVE_ASSET">
                    {{
                      capitalsourceTypeNames[CapitalsourceType.RESERVE_ASSET]
                    }}
                  </option>
                  <option :value="CapitalsourceType.PROVISION_ASSET">
                    {{
                      capitalsourceTypeNames[CapitalsourceType.PROVISION_ASSET]
                    }}
                  </option>
                  <option :value="CapitalsourceType.CREDIT">
                    {{ capitalsourceTypeNames[CapitalsourceType.CREDIT] }}
                  </option>
                </select>

                <label
                  :for="'type' + idSuffix"
                  :style="'color: ' + typeErrorData.fieldColor"
                  >{{ typeErrorData.fieldLabel }}</label
                >
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <select
                  v-model="mcs.state"
                  :id="'state' + idSuffix"
                  @change="validateState"
                  :class="
                    'form-select form-control ' + stateErrorData.inputClass
                  "
                >
                  <option :value="CapitalsourceState.__PLACEHOLDER"></option>
                  <option :value="CapitalsourceState.NON_CACHE">
                    {{ capitalsourceStateNames[CapitalsourceState.NON_CACHE] }}
                  </option>
                  <option :value="CapitalsourceState.CACHE">
                    {{ capitalsourceStateNames[CapitalsourceState.CACHE] }}
                  </option>
                </select>

                <label
                  :for="'state' + idSuffix"
                  :style="'color: ' + stateErrorData.fieldColor"
                  >{{ stateErrorData.fieldLabel }}</label
                >
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <input
                  v-model="mcs.accountNumber"
                  :id="'accountNumber' + idSuffix"
                  type="text"
                  class="form-control"
                />
                <label :for="'accountNumber' + idSuffix">IBAN</label>
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <input
                  v-model="mcs.bankCode"
                  :id="'bankCode' + idSuffix"
                  type="text"
                  class="form-control"
                />
                <label :for="'bankCode' + idSuffix">BIC</label>
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="input-group">
                <div class="form-floating">
                  <input
                    v-model="validFrom"
                    :id="'validFrom' + idSuffix"
                    type="date"
                    @change="validateValidFrom"
                    :class="' form-control ' + validFromErrorData.inputClass"
                  />
                  <label
                    :for="'validFrom' + idSuffix"
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
                    :id="'validTil' + idSuffix"
                    type="date"
                    @change="validateValidTil"
                    :class="' form-control ' + validTilErrorData.inputClass"
                  />
                  <label
                    :for="'validTil' + idSuffix"
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
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <select
                  v-model="groupUse"
                  :id="'groupUse' + idSuffix"
                  @change="validateGroupUse"
                  :class="
                    'form-select form-control ' + groupUseErrorData.inputClass
                  "
                >
                  <option value=""></option>
                  <option value="0">Nein</option>
                  <option value="1">Ja</option>
                </select>

                <label
                  :for="'groupUse' + idSuffix"
                  :style="'color: ' + groupUseErrorData.fieldColor"
                  >{{ groupUseErrorData.fieldLabel }}</label
                >
              </div>
            </div>
          </div>
          <div class="pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <select
                  v-model="mcs.importAllowed"
                  :id="'importAllowed' + idSuffix"
                  @change="validateImportAllowed"
                  :class="
                    'form-select form-control ' +
                    importAllowedErrorData.inputClass
                  "
                >
                  <option value=""></option>
                  <option :value="CapitalsourceImport.NOT_ALLOWED">
                    {{
                      capitalsourceImportNames[CapitalsourceImport.NOT_ALLOWED]
                    }}
                  </option>
                  <option :value="CapitalsourceImport.ALL_ALLOWED">
                    {{
                      capitalsourceImportNames[CapitalsourceImport.ALL_ALLOWED]
                    }}
                  </option>
                  <option :value="CapitalsourceImport.BALANCE_ALLOWED">
                    {{
                      capitalsourceImportNames[
                        CapitalsourceImport.BALANCE_ALLOWED
                      ]
                    }}
                  </option>
                </select>

                <label
                  :for="'importAllowed' + idSuffix"
                  :style="'color: ' + importAllowedErrorData.fieldColor"
                  >{{ importAllowedErrorData.fieldLabel }}</label
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
        :form="'createCapitalsourceForm' + idSuffix"
      >
        Speichern
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import CapitalsourceControllerHandler from "@/handler/CapitalsourceControllerHandler";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { validateInputField } from "@/tools/views/ValidateInputField";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";
import { getError } from "@/tools/views/ThrowError";
import {
  CapitalsourceImport,
  capitalsourceImportNames,
} from "@/model/capitalsource/CapitalsourceImport";
import {
  CapitalsourceType,
  capitalsourceTypeNames,
} from "@/model/capitalsource/CapitalsourceType";
import {
  CapitalsourceState,
  capitalsourceStateNames,
} from "@/model/capitalsource/CapitalsourceState";
import { mapActions } from "pinia";
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import type { ValidationResult } from "@/model/validation/ValidationResult";

type CreateCapitalsourceModalData = {
  mcs: Capitalsource;
  origMcs: Capitalsource | undefined;
  validFrom: string;
  validTil: string;
  groupUse: string;
  serverError: Array<String>;
  commentIsValid: boolean | null;
  commentErrorMessage: string;
  typeIsValid: boolean | null;
  typeErrorMessage: string;
  stateIsValid: boolean | null;
  stateErrorMessage: string;
  validFromIsValid: boolean | null;
  validFromErrorMessage: string;
  validTilIsValid: boolean | null;
  validTilErrorMessage: string;
  groupUseIsValid: boolean | null;
  groupUseErrorMessage: string;
  importAllowedIsValid: boolean | null;
  importAllowedErrorMessage: string;
};
export default defineComponent({
  name: "CreateCapitalsourceModal",
  data(): CreateCapitalsourceModalData {
    return {
      mcs: {} as Capitalsource,
      origMcs: undefined,
      validFrom: "",
      validTil: "",
      groupUse: "",
      serverError: {} as Array<String>,
      commentIsValid: null,
      commentErrorMessage: "",
      typeIsValid: null,
      typeErrorMessage: "",
      stateIsValid: null,
      stateErrorMessage: "",
      validFromIsValid: null,
      validFromErrorMessage: "",
      validTilIsValid: null,
      validTilErrorMessage: "",
      groupUseIsValid: null,
      groupUseErrorMessage: "",
      importAllowedIsValid: null,
      importAllowedErrorMessage: "",
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
        this.commentIsValid &&
        this.typeIsValid &&
        this.stateIsValid &&
        this.validFromIsValid &&
        this.validTilIsValid &&
        this.groupUseIsValid &&
        this.importAllowedIsValid;
      if (isValid) {
        return true;
      }
      return false;
    },
    title(): string {
      return this.origMcs === undefined
        ? "Kapitalquelle hinzufügen"
        : "Kapitalquelle bearbeiten";
    },
    commentErrorData(): ErrorData {
      return generateErrorData(
        this.commentIsValid,
        "Kapitalquelle",
        this.commentErrorMessage
      );
    },
    typeErrorData(): ErrorData {
      return generateErrorData(this.typeIsValid, "Typ", this.typeErrorMessage);
    },
    stateErrorData(): ErrorData {
      return generateErrorData(
        this.stateIsValid,
        "Status",
        this.stateErrorMessage
      );
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
    groupUseErrorData(): ErrorData {
      return generateErrorData(
        this.groupUseIsValid,
        "Gruppe",
        this.groupUseErrorMessage
      );
    },
    importAllowedErrorData(): ErrorData {
      return generateErrorData(
        this.importAllowedIsValid,
        "Datenimport",
        this.importAllowedErrorMessage
      );
    },
    capitalsourceTypeNames() {
      return capitalsourceTypeNames;
    },
    CapitalsourceType() {
      return CapitalsourceType;
    },
    capitalsourceStateNames() {
      return capitalsourceStateNames;
    },
    CapitalsourceState() {
      return CapitalsourceState;
    },
    capitalsourceImportNames() {
      return capitalsourceImportNames;
    },
    CapitalsourceImport() {
      return CapitalsourceImport;
    },
  },
  methods: {
    async _show(mcs?: Capitalsource) {
      this.origMcs = mcs ? mcs : undefined;
      this.resetForm();
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    ...mapActions(useCapitalsourceStore, ["addCapitalsourceToStore"]),
    ...mapActions(useCapitalsourceStore, ["updateCapitalsourceInStore"]),
    resetForm() {
      if (this.origMcs) {
        this.mcs = JSON.parse(JSON.stringify(this.origMcs));
        [this.validFrom] = new Date(this.mcs.validFrom)
          .toISOString()
          .split("T");
        [this.validTil] = new Date(this.mcs.validTil).toISOString().split("T");
        this.groupUse = this.mcs.groupUse ? "1" : "0";
      } else {
        this.mcs = {} as Capitalsource;
        [this.validFrom] = new Date().toISOString().split("T");
        this.validTil = "2999-12-31";
        this.groupUse = "";
      }
      this.commentIsValid = null;
      this.commentErrorMessage = "";
      this.typeIsValid = null;
      this.typeErrorMessage = "";
      this.stateIsValid = null;
      this.stateErrorMessage = "";
      this.validFromIsValid = null;
      this.validFromErrorMessage = "";
      this.validTilIsValid = null;
      this.validTilErrorMessage = "";
      this.groupUseIsValid = null;
      this.groupUseErrorMessage = "";
      this.importAllowedIsValid = null;
      this.importAllowedErrorMessage = "";
      this.serverError = {} as Array<String>;
    },
    validateComment() {
      [this.commentIsValid, this.commentErrorMessage] = validateInputField(
        this.mcs.comment,
        "Kapitalquelle angeben!"
      );
    },
    validateType() {
      [this.typeIsValid, this.typeErrorMessage] = validateInputField(
        +this.mcs.type,
        "Typ auswählen!"
      );
    },
    validateState() {
      [this.stateIsValid, this.stateErrorMessage] = validateInputField(
        +this.mcs.state,
        "Status auswählen!"
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
    validateGroupUse() {
      [this.groupUseIsValid, this.groupUseErrorMessage] = validateInputField(
        this.groupUse,
        "Bitte Gruppennutzung auswählen!"
      );
    },
    validateImportAllowed() {
      let valid = true;
      if (
        this.mcs.importAllowed === undefined ||
        this.mcs.importAllowed + "" === ""
      )
        valid = false;
      [this.importAllowedIsValid, this.importAllowedErrorMessage] =
        validateInputField(valid, "Bitte Importart auswählen!");
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
    async createCapitalsource() {
      this.validateComment();
      this.validateType();
      this.validateState();
      this.validateValidFrom();
      this.validateValidTil();
      this.validateGroupUse();
      this.validateImportAllowed();

      if (this.formIsValid) {
        this.mcs.validFrom = new Date(this.validFrom);
        this.mcs.validTil = new Date(this.validTil);
        this.mcs.groupUse = this.groupUse === "1" ? true : false;

        if (this.mcs.id > 0) {
          //update
          const validationResult =
            await CapitalsourceControllerHandler.updateCapitalsource(this.mcs);
          if (!this.handleServerError(validationResult)) {
            (this.$refs.modalComponent as typeof ModalVue)._hide();
            this.updateCapitalsourceInStore(this.mcs);
            this.$emit("capitalsourceUpdated", this.mcs);
          }
        } else {
          //create
          const capitalsourceValidation =
            CapitalsourceControllerHandler.createCapitalsource(this.mcs);
          const validationResult = await (
            await capitalsourceValidation
          ).validationResult;

          if (!this.handleServerError(validationResult)) {
            this.mcs = (await capitalsourceValidation).mcs;
            (this.$refs.modalComponent as typeof ModalVue)._hide();
            this.addCapitalsourceToStore(this.mcs);
            this.$emit("capitalsourceCreated", this.mcs);
          }
        }
      }
    },
  },
  expose: ["_show"],
  emits: ["capitalsourceCreated", "capitalsourceUpdated"],
  components: { ModalVue },
});
</script>
