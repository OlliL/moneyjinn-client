<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form
        @submit.prevent="createCapitalsource"
        :id="'createCapitalsourceForm' + idSuffix"
      >
        <div class="container-fluid">
          <DivError :server-errors="serverErrors" />
          <div class="row">
            <div class="col-xs-12">
              <div class="form-floating">
                <InputStandard
                  v-model="mcs.comment"
                  :validation-schema="schema.comment"
                  :id="'comment' + idSuffix"
                  field-label="Kapitalquelle"
                />
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <SelectStandard
                v-model="mcs.type"
                :validation-schema="schema.type"
                :id="'type' + idSuffix"
                field-label="Typ"
                :select-box-values="typeValues"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <SelectStandard
                v-model="mcs.state"
                :validation-schema="schema.state"
                :id="'state' + idSuffix"
                field-label="Status"
                :select-box-values="stateValues"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="mcs.accountNumber"
                :validation-schema="schema.accountNumber"
                :id="'accountNumber' + idSuffix"
                field-label="IBAN"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="mcs.bankCode"
                :validation-schema="schema.bankCode"
                :id="'bankCode' + idSuffix"
                field-label="BIC"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputDate
                v-model="mcs.validFrom"
                :validation-schema="schema.validFrom"
                :id="'validFrom' + idSuffix"
                field-label="Gültig ab"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputDate
                v-model="mcs.validTil"
                :validation-schema="schema.validTil"
                :id="'validTil' + idSuffix"
                field-label="Gültig bis"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <SelectStandard
                v-model="mcs.groupUse"
                :validation-schema="schema.groupUse"
                :id="'groupUse' + idSuffix"
                field-label="Gruppe"
                :select-box-values="groupUseValues"
              />
            </div>
          </div>
          <div class="pt-2">
            <div class="col-xs-12">
              <SelectStandard
                v-model="mcs.importAllowed"
                :validation-schema="schema.importAllowed"
                :id="'importAllowed' + idSuffix"
                field-label="DatenImport"
                :select-box-values="importAllowedValues"
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
      <ButtonSubmit
        button-label="Speichern"
        :form-id="'createCapitalsourceForm' + idSuffix"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import CapitalsourceControllerHandler from "@/handler/CapitalsourceControllerHandler";
import { computed, ref } from "vue";
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
import type { ValidationResult } from "@/model/validation/ValidationResult";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import { boolean, date, number, string } from "zod";
import { useForm } from "vee-validate";
import DivError from "../DivError.vue";
import InputStandard from "../InputStandard.vue";
import SelectStandard from "../SelectStandard.vue";
import InputDate from "../InputDate.vue";
import ButtonSubmit from "../ButtonSubmit.vue";

defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
});

const serverErrors = ref(new Array<String>());

const globErr = (message: string) => {
  return {
    errorMap: () => {
      return { message: message };
    },
  };
};

const schema = {
  comment: string(globErr("Bitte Kommentar angeben!")).min(1),
  type: number(globErr("Bitte Typ angeben!")).min(1),
  state: number(globErr("Bitte Status angeben!")).min(1).max(2),
  accountNumber: string().optional(),
  bankCode: string().optional(),
  validFrom: date(globErr("Bitte Gültig ab angeben!")),
  validTil: date(globErr("Bitte Gültig bis angeben!")),
  groupUse: boolean(globErr("Bitte Gruppennutzung auswählen!")),
  importAllowed: number(globErr("Bitte Importart auswählen!")).min(0).max(2),
};

const mcs = ref({} as Capitalsource);
const origMcs = ref({} as Capitalsource | undefined);
const modalComponent = ref();
const emit = defineEmits(["capitalsourceUpdated", "capitalsourceCreated"]);

/* select box values following */
const typeValues = new Array<SelectBoxValue>();
for (let type in CapitalsourceType) {
  const typeNum = Number(type);
  if (!isNaN(typeNum)) {
    typeValues.push({ id: typeNum, value: capitalsourceTypeNames[typeNum] });
  }
}
const stateValues = new Array<SelectBoxValue>();
for (let state in CapitalsourceState) {
  const stateNum = Number(state);
  if (!isNaN(stateNum)) {
    stateValues.push({
      id: stateNum,
      value: capitalsourceStateNames[stateNum],
    });
  }
}
const groupUseValues = [
  { id: undefined, value: "" },
  { id: false, value: "Nein" },
  { id: true, value: "Ja" },
] as Array<SelectBoxValue>;
const importAllowedValues = [
  { id: undefined, value: "" },
] as Array<SelectBoxValue>;
for (let importAllowed in CapitalsourceImport) {
  const importNum = Number(importAllowed);
  if (!isNaN(importNum)) {
    importAllowedValues.push({
      id: importNum,
      value: capitalsourceImportNames[importNum],
    });
  }
}

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origMcs.value === undefined
    ? "Kapitalquelle hinzufügen"
    : "Kapitalquelle bearbeiten";
});

const resetForm = () => {
  if (origMcs.value) {
    const validFrom = new Date(origMcs.value.validFrom);
    const validTil = new Date(origMcs.value.validTil);

    mcs.value = {
      accountNumber: origMcs.value.accountNumber,
      bankCode: origMcs.value.bankCode,
      comment: origMcs.value.comment,
      groupUse: origMcs.value.groupUse,
      id: origMcs.value.id,
      importAllowed: origMcs.value.importAllowed,
      state: origMcs.value.state,
      type: origMcs.value.type,
      userId: origMcs.value.userId,
      validFrom: validFrom,
      validTil: validTil,
    };
  } else {
    const validFrom = new Date();
    const validTil = new Date("2999-12-31");

    mcs.value = {} as Capitalsource;
    mcs.value.validFrom = validFrom;
    mcs.value.validTil = validTil;
  }
  serverErrors.value = new Array<String>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = async (_mcs?: Capitalsource) => {
  origMcs.value = _mcs ? _mcs : undefined;
  resetForm();
  modalComponent.value._show();
};

const handleServerError = (validationResult: ValidationResult): boolean => {
  if (!validationResult.result) {
    serverErrors.value = new Array<string>();
    for (let resultItem of validationResult.validationResultItems) {
      serverErrors.value.push(getError(resultItem.error));
    }
  }
  return !validationResult.result;
};

const createCapitalsource = handleSubmit(() => {
  if (mcs.value.id > 0) {
    //update
    CapitalsourceControllerHandler.updateCapitalsource(mcs.value).then(
      (validationResult) => {
        if (!handleServerError(validationResult)) {
          modalComponent.value._hide();
          emit("capitalsourceUpdated", mcs.value);
        }
      }
    );
  } else {
    //create
    CapitalsourceControllerHandler.createCapitalsource(mcs.value).then(
      (capitalsourceValidation) => {
        const validationResult = capitalsourceValidation.validationResult;

        if (!handleServerError(validationResult)) {
          mcs.value = capitalsourceValidation.mcs;
          modalComponent.value._hide();
          emit("capitalsourceCreated", mcs.value);
        }
      }
    );
  }
});
defineExpose({ _show });
</script>
