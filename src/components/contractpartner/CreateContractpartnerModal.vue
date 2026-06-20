<template>
  <ModalVue
    :title="title"
    max-width="max-w-md"
    id-suffix="CreateContractpartner"
    v-model:open="open"
  >
    <template #body>
      <form
        @submit.prevent="createContractpartner"
        id="createContractpartnerForm"
        class="space-y-6"
      >
        <div class="form-section space-y-4">
          <InputStandard
            v-model="mData.name"
            :validation-schema="schema.name"
            id="name-CreateContractpartner"
            :field-label="$t('General.name')"
          />
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
            id="moneyflowComment-CreateContractpartner"
            :field-label="$t('General.comment')"
          />
          <SelectPostingAccount
            v-model="mData.postingAccountId"
            :validation-schema="schema.postingAccountId"
            id-suffix="-CreateContractpartner"
            :field-label="$t('General.postingAccount')"
          />
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div class="form-section flex flex-col justify-between">
            <span
              class="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2"
            >
              {{ $t("Contractpartner.validityData") }}
            </span>
            <div class="grid grid-cols-2 gap-4 mt-2">
              <InputDate
                v-model="mData.validFrom"
                :validation-schema="schema.validFrom"
                id="validFrom-CreateContractpartner"
                :field-label="$t('General.validFrom')"
                picker-side="top"
              />
              <InputDate
                v-model="mData.validTil"
                :validation-schema="schema.validTil"
                id="validTil-CreateContractpartner"
                :field-label="$t('General.validTil')"
                picker-side="top"
                picker-align="end"
              />
            </div>
          </div>
        </div>

        <Collapsible class="rounded-sm border bg-muted/30 overflow-hidden">
          <CollapsibleTrigger
            class="flex items-center justify-between w-full p-4 hover:bg-muted/30 text-left transition-colors group"
            data-testid="addressDataCollapsibleTrigger-CreateContractpartner"
          >
            <div class="flex items-center space-x-2">
              <span class="form-section-title">
                {{ $t("Contractpartner.adressData") }}
              </span>
            </div>
            <ChevronDown
              class="icon-medium text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </CollapsibleTrigger>

          <CollapsibleContent
            class="p-4 pt-0 space-y-3 border-t border-border/40 mt-3 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
          >
            <div class="grid grid-cols-3 gap-4 pt-3">
              <div class="col-span-2">
                <InputStandard
                  v-model="mData.street"
                  :validation-schema="schema.street"
                  id="street-CreateContractpartner"
                  :field-label="$t('Contractpartner.street')"
                />
              </div>
              <div class="col-span-1">
                <InputStandard
                  v-model="mData.country"
                  :validation-schema="schema.country"
                  id="country-CreateContractpartner"
                  :field-label="$t('Contractpartner.country')"
                />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div class="col-span-1">
                <InputStandard
                  v-model="mData.postcode"
                  :validation-schema="schema.postcode"
                  id="postcode-CreateContractpartner"
                  :field-label="$t('Contractpartner.postcode')"
                />
              </div>
              <div class="col-span-2">
                <InputStandard
                  v-model="mData.town"
                  :validation-schema="schema.town"
                  id="town-CreateContractpartner"
                  :field-label="$t('Contractpartner.town')"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </form>
    </template>

    <template #footer>
      <Button
        type="button"
        variant="secondary"
        class="button-with-icon hidden md:flex"
        data-testid="createContractpartnerResetButton"
        @click="resetForm(resetAll)"
      >
        <Undo2 class="icon-medium" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        form-id="createContractpartnerForm"
        test-id="createContractpartnerSaveButton"
      >
        <template #icon><Save class="icon-medium" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import { createFormContext } from "@/tools/views/ValidationUtil.ts";
import { globErr } from "@/tools/views/ZodUtil";
import { ChevronDown, Save, Undo2 } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { coerce, date, number, string, ZodType } from "zod";
import ButtonSubmit from "../common/ButtonSubmit.vue";
import InputDate from "../common/InputDate.vue";
import InputStandard from "../common/InputStandard.vue";
import ModalVue from "../common/Modal.vue";
import SelectPostingAccount from "../postingaccount/SelectPostingAccount.vue";
import Collapsible from "../ui/collapsible/Collapsible.vue";
import CollapsibleContent from "../ui/collapsible/CollapsibleContent.vue";
import CollapsibleTrigger from "../ui/collapsible/CollapsibleTrigger.vue";
import { useCreateContractpartnerModalStore } from "./CreateContractpartnerModal.store";

const { t } = useI18n();
const store = useCreateContractpartnerModalStore();
const { open, mData, title } = storeToRefs(store);
const { resetForm, save } = store;

const { handleSubmit, resetAll } = createFormContext();

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
const createContractpartner = save(handleSubmit);
</script>
