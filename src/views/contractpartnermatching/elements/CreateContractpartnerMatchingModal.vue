<template>
  <ModalVue
    :title="title"
    max-width="max-w-md"
    id-suffix="CreateContractpartnerMatching"
    v-model:open="open"
  >
    <template #body>
      <form
        @submit.prevent="createContractpartnerMatching"
        id="createContractpartnerMatchingForm"
      >
        <div class="space-y-4">
          <div class="form-section space-y-4">
            <div class="grid grid-cols-1 gap-4">
              <InputStandard
                v-model="mcm.matchingText"
                :validation-schema="schema.matchingText"
                id="name"
                :field-label="$t('ContractpartnerMatching.matchingText')"
              />
              <SelectContractpartner
                v-model="mcm.contractpartnerId"
                :validation-schema="schema.contractpartnerId"
                id-suffix="CreateContractpartnerMatching"
                :field-label="$t('General.contractpartner')"
              />
            </div>
          </div>

          <div class="form-section space-y-4">
            <div
              class="flex items-center space-x-2 border-b border-border/40 pb-2"
            >
              <span class="form-section-title">
                {{ $t("Contractpartner.moneyflowDefaults") }}
              </span>
            </div>
            <InputStandard
              v-model="mcm.moneyflowComment"
              :validation-schema="schema.moneyflowComment"
              id="moneyflowComment"
              :field-label="$t('General.comment')"
            />
            <SelectPostingAccount
              v-model="mcm.postingAccountId"
              :validation-schema="schema.postingAccountId"
              id-suffix="CreateContractpartnerMatchingModal"
              :field-label="$t('General.postingAccount')"
            />
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <Button
        type="button"
        variant="secondary"
        class="button-with-icon hidden md:flex"
        data-testid="createContractpartnerMatchingResetButton"
        @click="resetForm"
      >
        <Undo2 class="icon-medium" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        form-id="createContractpartnerMatchingForm"
        test-id="createContractpartnerMatchingSaveButton"
      >
        <template #icon><Save class="icon-medium" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import InputStandard from "@/components/common/InputStandard.vue";
import ModalVue from "@/components/common/Modal.vue";
import SelectContractpartner from "@/components/contractpartner/SelectContractpartner.vue";
import SelectPostingAccount from "@/components/postingaccount/SelectPostingAccount.vue";
import { Button } from "@/components/ui/button";
import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";
import ContractpartnerMatchingService from "@/service/ContractpartnerMatchingService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";
import { Save, Undo2 } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import { computed, ref, toRaw, watch } from "vue";
import { useI18n } from "vue-i18n";
import { number, string, ZodType } from "zod";
import useCreateContractpartnerMatchingModalStore from "./CreateContractpartnerMatchingModal.store";

const { t } = useI18n();

const { open, matching, onDone } = storeToRefs(
  useCreateContractpartnerMatchingModalStore(),
);

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
const origMcm = ref({} as ContractpartnerMatching | undefined);

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() =>
  origMcm.value === undefined
    ? t("ContractpartnerMatching.title.create")
    : t("ContractpartnerMatching.title.update"),
);

const resetForm = () => {
  if (origMcm.value) {
    mcm.value = structuredClone(toRaw(origMcm.value))!;
  } else {
    mcm.value = {} as ContractpartnerMatching;
  }
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

watch(
  [open, matching],
  ([isOpen, entry]) => {
    if (!isOpen) {
      origMcm.value = undefined;
      return;
    }
    if (entry === undefined) {
      origMcm.value = undefined;
    } else {
      origMcm.value = structuredClone(toRaw(entry));
    }
    resetForm();
  },
  { immediate: true },
);

const createContractpartnerMatching = handleSubmit(() => {
  const isUpdate = mcm.value.id > 0;
  const serviceCall = isUpdate
    ? ContractpartnerMatchingService.updateContractpartnerMatching(mcm.value)
    : ContractpartnerMatchingService.createContractpartnerMatching(mcm.value);

  serviceCall
    .then((result) => {
      if (!isUpdate) mcm.value = result as ContractpartnerMatching;
      open.value = false;
      onDone.value?.(mcm.value);
    })
    .catch(handleBackendError);
});
</script>
