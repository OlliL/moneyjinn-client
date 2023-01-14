<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form
        @submit.prevent="createContractpartner"
        :id="'createContractpartnerForm' + idSuffix"
      >
        <div class="container-fluid">
          <DivError :server-errors="serverErrors" />
          <div class="row">
            <div class="col-xs-12">
              <div class="form-floating">
                <InputStandard
                  v-model="mcp.name"
                  :validation-schema="schema.name"
                  :id="'name' + idSuffix"
                  field-label="Name"
                />
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="mcp.moneyflowComment"
                :validation-schema="schema.moneyflowComment"
                :id="'moneyflowComment' + idSuffix"
                field-label="Standard-Kommentar der Geldbewegung"
              />
            </div>
          </div>

          <div class="row pt-2">
            <div class="col-xs-12">
              <SelectPostingAccount
                v-model="mcp.postingAccountId"
                :validation-schema="schema.postingAccountId"
                :id-suffix="idSuffix + 'CreateContractpartner'"
                field-label="Buchungskonto"
              />
            </div>
          </div>

          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="mcp.street"
                :validation-schema="schema.street"
                :id="'street' + idSuffix"
                field-label="Stra&szlig;e"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="mcp.postcode"
                :validation-schema="schema.postcode"
                :id="'postcode' + idSuffix"
                field-label="Postleitzahl"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="mcp.town"
                :validation-schema="schema.town"
                :id="'town' + idSuffix"
                field-label="Stadt"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="mcp.country"
                :validation-schema="schema.country"
                :id="'country' + idSuffix"
                field-label="Land"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputDate
                v-model="mcp.validFrom"
                :validation-schema="schema.validFrom"
                :id="'validFrom' + idSuffix"
                field-label="Gültig ab"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputDate
                v-model="mcp.validTil"
                :validation-schema="schema.validTil"
                :id="'validTil' + idSuffix"
                field-label="Gültig bis"
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
        :form-id="'createContractpartnerForm' + idSuffix"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { coerce, date, number, string, ZodType } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputDate from "../InputDate.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";

import { handleServerError } from "@/tools/views/ThrowError";
import { globErr } from "@/tools/views/ZodUtil";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import ContractpartnerControllerHandler from "@/handler/ContractpartnerControllerHandler";
import SelectPostingAccount from "../postingaccount/SelectPostingAccount.vue";

defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
});

const serverErrors = ref(new Array<string>());

const schema: Partial<{ [key in keyof Contractpartner]: ZodType }> = {
  name: string(globErr("Bitte Name angeben!")).min(1),
  moneyflowComment: string().optional(),
  postingAccountId: number().optional(),
  street: string().optional(),
  postcode: coerce
    .number(globErr("Postleitzahl muss nummerisch sein!"))
    .optional(),
  town: string().optional(),
  country: string().optional(),
  validFrom: date(globErr("Bitte Gültig ab angeben!")),
  validTil: date(globErr("Bitte Gültig bis angeben!")),
};

const mcp = ref({} as Contractpartner);
const origMcp = ref({} as Contractpartner | undefined);
const modalComponent = ref();
const emit = defineEmits(["contractpartnerCreated", "contractpartnerUpdated"]);

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origMcp.value === undefined
    ? "Vertragspartner hinzufügen"
    : "Vertragspartner bearbeiten";
});

const resetForm = () => {
  if (origMcp.value) {
    Object.assign(mcp.value, origMcp.value);
  } else {
    mcp.value = {
      validFrom: new Date(),
      validTil: new Date("2999-12-31"),
    } as Contractpartner;
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = async (_mcp?: Contractpartner) => {
  origMcp.value = _mcp ? _mcp : undefined;
  resetForm();
  modalComponent.value._show();
};

const createContractpartner = handleSubmit(() => {
  if (mcp.value.id > 0) {
    //update
    ContractpartnerControllerHandler.updateContractpartner(mcp.value).then(
      (validationResult) => {
        if (!handleServerError(validationResult, serverErrors)) {
          modalComponent.value._hide();
          emit("contractpartnerUpdated", mcp.value);
        }
      }
    );
  } else {
    //create
    ContractpartnerControllerHandler.createContractpartner(mcp.value).then(
      (contractpartnerValidation) => {
        const validationResult = contractpartnerValidation.validationResult;

        if (!handleServerError(validationResult, serverErrors)) {
          mcp.value = contractpartnerValidation.mcp;
          modalComponent.value._hide();
          emit("contractpartnerCreated", mcp.value);
        }
      }
    );
  }
});
defineExpose({ _show });
</script>
