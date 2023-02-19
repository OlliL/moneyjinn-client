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
                :select-box-values="capitalsourceTypeValues"
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
                :select-box-values="capitalsourceStateValues"
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
                :select-box-values="capitalsourceImportValues"
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
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { boolean, date, number, string, ZodType } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputDate from "../InputDate.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";
import SelectStandard from "../SelectStandard.vue";

import { handleBackendError } from "@/tools/views/ThrowError";
import { globErr } from "@/tools/views/ZodUtil";

import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import { capitalsourceImportValues } from "@/model/capitalsource/CapitalsourceImport";
import { capitalsourceStateValues } from "@/model/capitalsource/CapitalsourceState";
import { capitalsourceTypeValues } from "@/model/capitalsource/CapitalsourceType";

import CapitalsourceControllerHandler from "@/handler/CapitalsourceControllerHandler";

defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
});

const serverErrors = ref(new Array<string>());

const schema: Partial<{ [key in keyof Capitalsource]: ZodType }> = {
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

const groupUseValues = [
  { id: undefined, value: "" },
  { id: false, value: "Nein" },
  { id: true, value: "Ja" },
] as Array<SelectBoxValue>;

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origMcs.value === undefined
    ? "Kapitalquelle hinzufügen"
    : "Kapitalquelle bearbeiten";
});

const resetForm = () => {
  if (origMcs.value) {
    Object.assign(mcs.value, origMcs.value);
  } else {
    mcs.value = {
      validFrom: new Date(),
      validTil: new Date("2999-12-31"),
    } as Capitalsource;
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = async (_mcs?: Capitalsource) => {
  origMcs.value = _mcs ? _mcs : undefined;
  resetForm();
  modalComponent.value._show();
};

const createCapitalsource = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  if (mcs.value.id > 0) {
    //update
    CapitalsourceControllerHandler.updateCapitalsource(mcs.value)
      .then(() => {
        modalComponent.value._hide();
        emit("capitalsourceUpdated", mcs.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  } else {
    //create
    CapitalsourceControllerHandler.createCapitalsource(mcs.value)
      .then((capitalsourceValidation) => {
        mcs.value = capitalsourceValidation.mcs;
        modalComponent.value._hide();
        emit("capitalsourceCreated", mcs.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});
defineExpose({ _show });
</script>
