<template>
  <ModalVue :title="title" ref="modalComponent" zIndex="2001">
    <template #body
      ><form
        @submit.prevent="createContractpartnerAccount"
        :id="'createContractpartnerAccountForm' + idSuffix"
      >
        <div class="container-fluid">
          <DivError :server-errors="serverErrors" />
          <div class="row">
            <div class="col-xs-12">
              <InputStandard
                v-model="mca.accountNumber"
                :validation-schema="schema.accountNumber"
                :id="'accountNumber' + idSuffix"
                field-label="IBAN"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="mca.bankCode"
                :validation-schema="schema.bankCode"
                :id="'bankCode' + idSuffix"
                field-label="BIC"
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
        :form-id="'createContractpartnerAccountForm' + idSuffix"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useForm } from "vee-validate";
import { string, ZodType } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";

import { handleServerError } from "@/tools/views/ThrowError";
import { globErr } from "@/tools/views/ZodUtil";

import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";

import ContractpartnerAccountControllerHandler from "@/handler/ContractpartnerAccountControllerHandler";

const props = defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
  contractpartnerId: {
    type: Number,
    required: true,
  },
});

const serverErrors = ref(new Array<string>());

const schema: Partial<{ [key in keyof ContractpartnerAccount]: ZodType }> = {
  accountNumber: string(globErr("Bitte IBAN angeben!"))
    .min(1)
    .max(22, "Die IBAN darf maximal 22 Stellen haben!"),
  bankCode: string(globErr("Bitte BIC angeben!"))
    .min(1)
    .max(11, "Die BIC darf maximal 11 Stellen haben!"),
};

const mca = ref({} as ContractpartnerAccount);
const origMca = ref({} as ContractpartnerAccount | undefined);
const modalComponent = ref();
const emit = defineEmits([
  "contractpartnerAccountCreated",
  "contractpartnerAccountUpdated",
]);

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origMca.value === undefined
    ? "Vertragspartnerkonto hinzufügen"
    : "Vertragspartnerkonto bearbeiten";
});

const resetForm = () => {
  if (origMca.value) {
    Object.assign(mca.value, origMca.value);
  } else {
    mca.value = {
      contractpartnerid: props.contractpartnerId,
    } as ContractpartnerAccount;
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = async (_mca?: ContractpartnerAccount) => {
  origMca.value = _mca ? _mca : undefined;
  resetForm();
  modalComponent.value._show();
};

const createContractpartnerAccount = handleSubmit(() => {
  if (mca.value.id > 0) {
    //update
    ContractpartnerAccountControllerHandler.updateContractpartnerAccount(
      mca.value
    ).then((validationResult) => {
      if (!handleServerError(validationResult, serverErrors)) {
        modalComponent.value._hide();
        emit("contractpartnerAccountUpdated", mca.value);
      }
    });
  } else {
    //create
    ContractpartnerAccountControllerHandler.createContractpartnerAccount(
      mca.value
    ).then((contractpartnerAccountValidation) => {
      const validationResult =
        contractpartnerAccountValidation.validationResult;

      if (!handleServerError(validationResult, serverErrors)) {
        mca.value = contractpartnerAccountValidation.mca;
        modalComponent.value._hide();
        emit("contractpartnerAccountCreated", mca.value);
      }
    });
  }
});
defineExpose({ _show });
</script>
