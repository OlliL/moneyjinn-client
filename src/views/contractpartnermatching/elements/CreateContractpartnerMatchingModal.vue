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
                v-model="mData.matchingText"
                :validation-schema="schema.matchingText"
                id="name"
                :field-label="$t('ContractpartnerMatching.matchingText')"
              />
              <SelectContractpartner
                v-model="mData.contractpartnerId"
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
              v-model="mData.moneyflowComment"
              :validation-schema="schema.moneyflowComment"
              id="moneyflowComment"
              :field-label="$t('General.comment')"
            />
            <SelectPostingAccount
              v-model="mData.postingAccountId"
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
        @click="resetForm(resetAll)"
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
import { createFormContext } from "@/tools/views/ValidationUtil";
import { globErr } from "@/tools/views/ZodUtil";
import { Save, Undo2 } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { number, string, ZodType } from "zod";
import { useCreateContractpartnerMatchingModalStore } from "./CreateContractpartnerMatchingModal.store";

const { t } = useI18n();

const store = useCreateContractpartnerMatchingModalStore();
const { open, mData, title } = storeToRefs(store);
const { resetForm, save } = store;

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

const { handleSubmit, resetAll } = createFormContext();
const createContractpartnerMatching = save(handleSubmit);
</script>
