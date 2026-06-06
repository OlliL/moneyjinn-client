<template>
  <ModalVue
    :title="title"
    max-width="max-w-md"
    id-suffix="CreateContractpartnerAccount"
    v-model:open="open"
    :z-index="zIndex"
  >
    <template #body>
      <form
        @submit.prevent="createContractpartnerAccount"
        id="createContractpartnerAccountFormCreateContractpartnerAccount"
      >
        <div class="space-y-4">
          <DivError :server-errors="serverErrors" />

          <div class="form-section space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div class="sm:col-span-8">
                <InputStandard
                  v-model="mca.accountNumber"
                  :validation-schema="schema.accountNumber"
                  id="accountNumber-CreateContractpartnerAccount"
                  :field-label="$t('General.iban')"
                />
              </div>

              <div class="sm:col-span-4">
                <InputStandard
                  v-model="mca.bankCode"
                  :validation-schema="schema.bankCode"
                  id="bankCode-CreateContractpartnerAccount"
                  :field-label="$t('General.bic')"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <Button
        type="button"
        variant="secondary"
        class="button-with-icon hidden md:flex"
        @click="resetForm"
      >
        <Undo2 class="icon-medium" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        form-id="createContractpartnerAccountFormCreateContractpartnerAccount"
      >
        <template #icon><Save class="icon-medium" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import DivError from "@/components/common/DivError.vue";
import InputStandard from "@/components/common/InputStandard.vue";
import ModalVue from "@/components/common/Modal.vue";
import { Button } from "@/components/ui/button";
import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import ContractpartnerAccountService from "@/service/ContractpartnerAccountService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";
import { Save, Undo2 } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import { computed, ref, toRaw, watch } from "vue";
import { useI18n } from "vue-i18n";
import { string, ZodType } from "zod";
import useCreateContractpartnerAccountModalStore from "./CreateContractpartnerAccountModal.store";

const { t } = useI18n();

const { open, account, onDone } = storeToRefs(
  useCreateContractpartnerAccountModalStore(),
);

withDefaults(
  defineProps<{
    zIndex?: string;
  }>(),
  {
    zIndex: "2001",
  },
);

const serverErrors = ref(new Array<string>());
const mca = ref({} as ContractpartnerAccount);
const origMca = ref<ContractpartnerAccount | undefined>(undefined);

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

const title = computed(() =>
  origMca.value === undefined
    ? t("ContractpartnerAccount.title.create")
    : t("ContractpartnerAccount.title.update"),
);

const resetForm = () => {
  if (origMca.value) {
    mca.value = structuredClone(toRaw(origMca.value))!;
  } else {
    mca.value = {
      contractpartnerid: account.value?.contractpartnerid,
    } as ContractpartnerAccount;
  }

  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

watch(
  [open, account],
  ([isVisible, entry]) => {
    if (isVisible) {
      origMca.value = entry && entry.id > 0 ? entry : undefined;
      resetForm();
    }
  },
  { immediate: true },
);

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

      open.value = false;
      onDone.value?.();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});
</script>
