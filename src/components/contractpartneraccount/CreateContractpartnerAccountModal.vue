<template>
  <ModalVue :title="title" ref="modalComponent" :z-index="zIndex">
    <template #body>
      <form
        @submit.prevent="createContractpartnerAccount"
        :id="'createContractpartnerAccountForm' + idSuffix"
        class="space-y-4"
      >
        <DivError :server-errors="serverErrors" />

        <div class="flex flex-col gap-4">
          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-3">
              <InputStandard
                v-model="mca.accountNumber"
                :validation-schema="schema.accountNumber"
                :id="'accountNumber' + idSuffix"
                :field-label="$t('General.iban')"
              />
            </div>
            <div class="col-span-1">
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
      <Button class="!rounded-md" variant="outline" @click="resetForm">
        {{ $t("General.reset") }}
      </Button>

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

// Shadcn UI Komponenten
import { Button } from "@/components/ui/button";

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
  zIndex: {
    type: String,
    default: "2001",
  },
});

const serverErrors = ref(new Array<string>());
const mca = ref({} as ContractpartnerAccount);
const origMca = ref({} as ContractpartnerAccount | undefined);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");

const emit = defineEmits([
  "contractpartnerAccountCreated",
  "contractpartnerAccountUpdated",
]);

const { handleSubmit, values, setFieldTouched } = useForm();

const schema: Partial<{ [key in keyof ContractpartnerAccount]: ZodType }> = {
  accountNumber: string(
    globErr(t("ContractpartnerAccount.validation.accountNumber")),
  )
    .min(1)
    .max(34, t("ContractpartnerAccount.validation.length.accountNumber")),
  bankCode: string()
    .max(11, t("ContractpartnerAccount.validation.length.bankCode"))
    .optional(),
};

const title = computed(() => {
  return origMca.value === undefined
    ? t("ContractpartnerAccount.title.create")
    : t("ContractpartnerAccount.title.update");
});

const resetForm = () => {
  if (origMca.value) {
    Object.assign(mca.value, JSON.parse(JSON.stringify(origMca.value)));
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

  const serviceCall =
    mca.value.id > 0
      ? ContractpartnerAccountService.updateContractpartnerAccount(mca.value)
      : ContractpartnerAccountService.createContractpartnerAccount(mca.value);

  serviceCall
    .then((result) => {
      const isUpdate = mca.value.id > 0;
      if (!isUpdate) mca.value = result as ContractpartnerAccount;

      modalComponent.value?._hide();
      emit(
        isUpdate
          ? "contractpartnerAccountUpdated"
          : "contractpartnerAccountCreated",
        mca.value,
      );
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});

defineExpose({ _show });
</script>
