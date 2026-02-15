<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form
        @submit.prevent="createContractpartnerMatching"
        :id="'createContractpartnerMatchingForm' + idSuffix"
      >
        <div class="container-fluid">
          <DivError :server-errors="serverErrors" />
          <div class="row">
            <div class="col-xs-12">
              <InputStandard
                v-model="mcm.matchingText"
                :validation-schema="schema.matchingText"
                :id="'name' + idSuffix"
                :field-label="$t('ContractpartnerMatching.matchingText')"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12">
              <SelectContractpartner
                v-model="mcm.contractpartnerId"
                :validation-schema="schema.contractpartnerId"
                :id-suffix="'CreateContractpartnerMatching' + idSuffix"
                :field-label="$t('General.contractpartner')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="mcm.moneyflowComment"
                :validation-schema="schema.moneyflowComment"
                :id="'moneyflowComment' + idSuffix"
                :field-label="$t('Contractpartner.moneyflowComment')"
              />
            </div>
          </div>

          <div class="row pt-2">
            <div class="col-xs-12">
              <SelectPostingAccount
                v-model="mcm.postingAccountId"
                :validation-schema="schema.postingAccountId"
                :id-suffix="idSuffix + 'CreateContractpartner'"
                :field-label="$t('General.postingAccount')"
              />
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary" @click="resetForm">
        {{ $t("General.reset") }}
      </button>
      <ButtonSubmit
        :button-label="$t('General.save')"
        :form-id="'createContractpartnerMatchingForm' + idSuffix"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { number, string, ZodType } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";

import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";

import ContractpartnerMatchingService from "@/service/ContractpartnerMatchingService";
import SelectContractpartner from "../contractpartner/SelectContractpartner.vue";
import SelectPostingAccount from "../postingaccount/SelectPostingAccount.vue";

const { t } = useI18n();

defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
});

const serverErrors = ref(new Array<string>());

const schema: Partial<{ [key in keyof ContractpartnerMatching]: ZodType }> = {
  matchingText: string(
    globErr(t("ContractpartnerMatching.validation.matchingText")),
  )
    .min(1)
    .max(50, t("ContractpartnerMatching.validation.matchingTextMax")),
  contractpartnerId: number(
    globErr(t("Moneyflow.validation.contractpartnerId")),
  ).gt(0),
  moneyflowComment: string()
    .max(100, t("Contractpartner.validation.length.moneyflowComment"))
    .optional(),
  postingAccountId: number().optional(),
};

const mcm = ref({} as ContractpartnerMatching);
const origMpa = ref({} as ContractpartnerMatching | undefined);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits([
  "contractpartnerMatchingCreated",
  "contractpartnerMatchingUpdated",
]);

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origMpa.value === undefined
    ? t("ContractpartnerMatching.title.create")
    : t("ContractpartnerMatching.title.update");
});

const resetForm = () => {
  if (origMpa.value) {
    Object.assign(mcm.value, origMpa.value);
  } else {
    mcm.value = {} as ContractpartnerMatching;
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = async (_mcm?: ContractpartnerMatching) => {
  origMpa.value = _mcm ?? undefined;
  resetForm();
  modalComponent.value?._show();
};

const createContractpartnerMatching = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  if (mcm.value.id > 0) {
    //update
    ContractpartnerMatchingService.updateContractpartnerMatching(mcm.value)
      .then(() => {
        modalComponent.value?._hide();
        emit("contractpartnerMatchingUpdated", mcm.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  } else {
    //create
    ContractpartnerMatchingService.createContractpartnerMatching(mcm.value)
      .then((_mcm) => {
        mcm.value = _mcm;
        modalComponent.value?._hide();
        emit("contractpartnerMatchingCreated", mcm.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});
defineExpose({ _show });
</script>
