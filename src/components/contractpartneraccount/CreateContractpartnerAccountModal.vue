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
                :field-label="$t('General.iban')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="mca.bankCode"
                :validation-schema="schema.bankCode"
                :id="'bankCode' + idSuffix"
                :field-label="$t('General.bic')"
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
        :form-id="'createContractpartnerAccountForm' + idSuffix"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { string, ZodType } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";

import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";

import ContractpartnerAccountService from "@/service/ContractpartnerAccountService";

const { t } = useI18n();

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
  accountNumber: string(
    globErr(t("ContractpartnerAccount.validation.accountNumber")),
  )
    .min(1)
    .max(22, t("ContractpartnerAccount.validation.accountNumberMax")),
  bankCode: string(globErr(t("ContractpartnerAccount.validation.bankCode")))
    .min(1)
    .max(11, t("ContractpartnerAccount.validation.bankCodeMax")),
};

const mca = ref({} as ContractpartnerAccount);
const origMca = ref({} as ContractpartnerAccount | undefined);
const modalComponent = useTemplateRef<typeof ModalVue>('modalComponent');
const emit = defineEmits([
  "contractpartnerAccountCreated",
  "contractpartnerAccountUpdated",
]);

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origMca.value === undefined
    ? t("ContractpartnerAccount.title.create")
    : t("ContractpartnerAccount.title.update");
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
  origMca.value = _mca ?? undefined;
  resetForm();
  modalComponent.value?._show();
};

const createContractpartnerAccount = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  if (mca.value.id > 0) {
    //update
    ContractpartnerAccountService.updateContractpartnerAccount(
      mca.value,
    )
      .then(() => {
        modalComponent.value?._hide();
        emit("contractpartnerAccountUpdated", mca.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  } else {
    //create
    ContractpartnerAccountService.createContractpartnerAccount(
      mca.value,
    )
      .then((_mca) => {
        mca.value = _mca;
        modalComponent.value?._hide();
        emit("contractpartnerAccountCreated", mca.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});
defineExpose({ _show });
</script>
