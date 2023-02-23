<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form
        @submit.prevent="createPreDefMoneyflow"
        :id="'createPreDefMoneyflowForm' + idSuffix"
      >
        <div class="container-fluid">
          <DivError :server-errors="serverErrors" />
          <div class="row">
            <div class="col-xs-12">
              <InputStandard
                v-model="mpm.amount"
                :validation-schema="schema.amount"
                id="amount"
                field-type="number"
                step="0.01"
                field-label="Betrag"
              >
                <template #icon
                  ><span class="input-group-text"
                    ><i class="bi bi-currency-euro"></i></span
                ></template>
              </InputStandard>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <SelectContractpartner
                v-model="mpm.contractpartnerId"
                :validation-schema="schema.contractpartnerId"
                :id-suffix="'CreatePreDefMoneyflow' + idSuffix"
                field-label="Vertragspartner"
                :validity-date="validityDate"
              />
            </div>
          </div>

          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="mpm.comment"
                :validation-schema="schema.comment"
                :id="'comment' + idSuffix"
                field-label="Kommentar"
              />
            </div>
          </div>

          <div class="row pt-2">
            <div class="col-xs-12">
              <SelectPostingAccount
                v-model="mpm.postingAccountId"
                :validation-schema="schema.postingAccountId"
                :id-suffix="'CreatePreDefMoneyflow' + idSuffix"
                field-label="Buchungskonto"
              />
            </div>
          </div>

          <div class="row pt-2">
            <div class="col-xs-12">
              <SelectCapitalsource
                v-model="mpm.capitalsourceId"
                :validation-schema="schema.capitalsourceId"
                :id-suffix="'CreatePreDefMoneyflow' + idSuffix"
                field-label="Kapitalquelle"
                :validity-date="validityDate"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <SelectStandard
                v-model="mpm.onceAMonth"
                :validation-schema="schema.onceAMonth"
                :id="'onceAMonth' + idSuffix"
                field-label="nur 1x pro Monat"
                :select-box-values="onceAMonthValues"
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
        :form-id="'createPreDefMoneyflowForm' + idSuffix"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { boolean, number, string, ZodType } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";
import SelectStandard from "../SelectStandard.vue";
import SelectPostingAccount from "../postingaccount/SelectPostingAccount.vue";
import SelectContractpartner from "../contractpartner/SelectContractpartner.vue";
import SelectCapitalsource from "../capitalsource/SelectCapitalsource.vue";

import { handleBackendError } from "@/tools/views/ThrowError";
import { amountSchema, globErr } from "@/tools/views/ZodUtil";

import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import type { SelectBoxValue } from "@/model/SelectBoxValue";

import PreDefMoneyflowControllerHandler from "@/handler/PreDefMoneyflowControllerHandler";

defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
});

const serverErrors = ref(new Array<string>());

const schema: Partial<{ [key in keyof PreDefMoneyflow]: ZodType }> = {
  amount: amountSchema("Bitte Betrag angeben!"),
  contractpartnerId: number(globErr("Bitte Vertragspartner angeben!")).gt(0),
  comment: string(globErr("Bitte Kommentar angeben!")).min(1),
  postingAccountId: number(globErr("Bitte Buchungskonto angeben!")).gt(0),
  capitalsourceId: number(globErr("Bitte Kapitalquelle angeben!")).gt(0),
  onceAMonth: boolean(globErr("Bitte ob nur 1x pro Monat auswählen!")),
};

const mpm = ref({} as PreDefMoneyflow);
const origMpm = ref({} as PreDefMoneyflow | undefined);
const modalComponent = ref();
const validityDate = new Date();
validityDate.setHours(0, 0, 0, 0);
const emit = defineEmits(["preDefMoneyflowCreated", "preDefMoneyflowUpdated"]);

const onceAMonthValues = [
  { id: undefined, value: "" },
  { id: false, value: "Nein" },
  { id: true, value: "Ja" },
] as Array<SelectBoxValue>;

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origMpm.value === undefined
    ? "Vordefinierte Geldbewegung hinzufügen"
    : "Vordefinierte Geldbewegung bearbeiten";
});

const resetForm = () => {
  if (origMpm.value) {
    Object.assign(mpm.value, origMpm.value);
  } else {
    mpm.value = {} as PreDefMoneyflow;
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = async (_mpm?: PreDefMoneyflow) => {
  origMpm.value = _mpm ? _mpm : undefined;
  resetForm();
  modalComponent.value._show();
};

const createPreDefMoneyflow = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  if (mpm.value.id > 0) {
    //update
    PreDefMoneyflowControllerHandler.updatePreDefMoneyflow(mpm.value)
      .then(() => {
        modalComponent.value._hide();
        emit("preDefMoneyflowUpdated", mpm.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  } else {
    //create
    PreDefMoneyflowControllerHandler.createPreDefMoneyflow(mpm.value)
      .then((_mpm) => {
        mpm.value = _mpm;
        modalComponent.value._hide();
        emit("preDefMoneyflowCreated", mpm.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});
defineExpose({ _show });
</script>
