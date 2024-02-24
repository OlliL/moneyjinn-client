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
              <InputStandard
                v-model="mcp.name"
                :validation-schema="schema.name"
                :id="'name' + idSuffix"
                :field-label="$t('General.name')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="mcp.moneyflowComment"
                :validation-schema="schema.moneyflowComment"
                :id="'moneyflowComment' + idSuffix"
                :field-label="$t('Contractpartner.moneyflowComment')"
              />
            </div>
          </div>

          <div class="row pt-2">
            <div class="col-xs-12">
              <SelectPostingAccount
                v-model="mcp.postingAccountId"
                :validation-schema="schema.postingAccountId"
                :id-suffix="idSuffix + 'CreateContractpartner'"
                :field-label="$t('General.postingAccount')"
              />
            </div>
          </div>

          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="mcp.street"
                :validation-schema="schema.street"
                :id="'street' + idSuffix"
                :field-label="$t('Contractpartner.street')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="mcp.postcode"
                :validation-schema="schema.postcode"
                :id="'postcode' + idSuffix"
                :field-label="$t('Contractpartner.postcode')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="mcp.town"
                :validation-schema="schema.town"
                :id="'town' + idSuffix"
                :field-label="$t('Contractpartner.town')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="mcp.country"
                :validation-schema="schema.country"
                :id="'country' + idSuffix"
                :field-label="$t('Contractpartner.country')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputDate
                v-model="mcp.validFrom"
                :validation-schema="schema.validFrom"
                :id="'validFrom' + idSuffix"
                :field-label="$t('General.validFrom')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputDate
                v-model="mcp.validTil"
                :validation-schema="schema.validTil"
                :id="'validTil' + idSuffix"
                :field-label="$t('General.validTil')"
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
        :form-id="'createContractpartnerForm' + idSuffix"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { coerce, date, number, string, ZodType } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputDate from "../InputDate.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import ContractpartnerControllerHandler from "@/handler/ContractpartnerControllerHandler";
import SelectPostingAccount from "../postingaccount/SelectPostingAccount.vue";

const { t } = useI18n();

defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
});

const serverErrors = ref(new Array<string>());

const schema: Partial<{ [key in keyof Contractpartner]: ZodType }> = {
  name: string(globErr(t("Contractpartner.validation.name")))
    .min(1)
    .max(100, t("Contractpartner.validation.length.name")),
  moneyflowComment: string()
    .max(100, t("Contractpartner.validation.length.moneyflowComment"))
    .optional(),
  postingAccountId: number().optional(),
  street: string()
    .max(100, t("Contractpartner.validation.length.street"))
    .optional(),
  postcode: coerce
    .number(globErr(t("Contractpartner.validation.postcode")))
    .optional(),
  town: string()
    .max(100, t("Contractpartner.validation.length.town"))
    .optional(),
  country: string()
    .max(100, t("Contractpartner.validation.length.country"))
    .optional(),
  validFrom: date(globErr(t("General.validation.validFrom"))),
  validTil: date(globErr(t("General.validation.validTil"))),
};

const mcp = ref({} as Contractpartner);
const origMcp = ref({} as Contractpartner | undefined);
const modalComponent = ref();
const emit = defineEmits(["contractpartnerCreated", "contractpartnerUpdated"]);

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origMcp.value === undefined
    ? t("Contractpartner.title.create")
    : t("Contractpartner.title.update");
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
  serverErrors.value = new Array<string>();

  if (mcp.value.id > 0) {
    //update
    ContractpartnerControllerHandler.updateContractpartner(mcp.value)
      .then(() => {
        modalComponent.value._hide();
        emit("contractpartnerUpdated", mcp.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  } else {
    //create
    ContractpartnerControllerHandler.createContractpartner(mcp.value)
      .then((contractpartner) => {
        mcp.value = contractpartner;
        modalComponent.value._hide();
        emit("contractpartnerCreated", mcp.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});
defineExpose({ _show });
</script>
