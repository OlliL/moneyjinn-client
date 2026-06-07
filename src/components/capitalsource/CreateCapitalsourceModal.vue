<template>
  <ModalVue
    :title="title"
    max-width="max-w-md"
    id-suffix="CreateCapitalsource"
    v-model:open="open"
  >
    <template #body>
      <form
        @submit.prevent="createCapitalsource"
        id="createCapitalsourceForm-CreateCapitalsource"
        class="space-y-6"
      >
        <div class="form-section space-y-4">
          <div class="grid gap-1.5">
            <InputStandard
              v-model="mData.comment"
              :validation-schema="schema.comment"
              id="comment-CreateCapitalsource"
              :field-label="$t('General.name')"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <SelectStandard
              v-model="mData.type"
              :validation-schema="schema.type"
              id="type-CreateCapitalsource"
              :field-label="$t('Capitalsource.type')"
              :select-box-values="capitalsourceTypeValues"
            />
            <SelectStandard
              v-model="mData.state"
              :validation-schema="schema.state"
              id="state-CreateCapitalsource"
              :field-label="$t('Capitalsource.state')"
              :select-box-values="capitalsourceStateValues"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="form-section space-y-4">
            <span
              class="text-xs font-bold uppercase tracking-wider text-muted-foreground block"
            >
              {{ $t("Capitalsource.validityData") }}
            </span>
            <div class="space-y-4">
              <InputDate
                v-model="mData.validFrom"
                :validation-schema="schema.validFrom"
                id="validFrom-CreateCapitalsource"
                :field-label="$t('General.validFrom')"
                picker-side="top"
              />
              <InputDate
                v-model="mData.validTil"
                :validation-schema="schema.validTil"
                id="validTil-CreateCapitalsource"
                :field-label="$t('General.validTil')"
                picker-side="top"
              />
            </div>
          </div>

          <div class="form-section space-y-4">
            <span
              class="text-xs font-bold uppercase tracking-wider text-muted-foreground block"
            >
              {{ $t("Capitalsource.permissions") }}
            </span>
            <div class="space-y-4">
              <SelectStandard
                v-model="mData.groupUse"
                :validation-schema="schema.groupUse"
                id="groupUse-CreateCapitalsource"
                :field-label="$t('Capitalsource.groupUse')"
                :select-box-values="groupUseValues"
              />
              <SelectStandard
                v-model="mData.importAllowed"
                :validation-schema="schema.importAllowed"
                id="importAllowed-CreateCapitalsource"
                :field-label="$t('Capitalsource.importAllowed')"
                :select-box-values="capitalsourceImportValues"
              />
            </div>
          </div>
        </div>

        <div class="form-section space-y-4">
          <div class="flex items-center space-x-2">
            <span class="form-section-title">
              {{ $t("Capitalsource.accountData") }}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <InputStandard
              v-model="mData.accountNumber"
              :validation-schema="schema.accountNumber"
              id="accountNumber-CreateCapitalsource"
              :field-label="$t('General.iban')"
            />
            <InputStandard
              v-model="mData.bankCode"
              :validation-schema="schema.bankCode"
              id="bankCode-CreateCapitalsource"
              :field-label="$t('General.bic')"
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
        data-testid="createCapitalsourceResetButton"
        @click="resetForm(values, setFieldTouched)"
      >
        <Undo2 class="icon-medium" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        form-id="createCapitalsourceForm-CreateCapitalsource"
        test-id="createCapitalsourceSaveButton"
      >
        <template #icon><Save class="icon-medium" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { capitalsourceImportValues } from "@/model/capitalsource/CapitalsourceImport";
import { capitalsourceStateValues } from "@/model/capitalsource/CapitalsourceState";
import { capitalsourceTypeValues } from "@/model/capitalsource/CapitalsourceType";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import { globErr } from "@/tools/views/ZodUtil";
import { Save, Undo2 } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import { useI18n } from "vue-i18n";
import { boolean, date, number, string, ZodType } from "zod";
import ButtonSubmit from "../common/ButtonSubmit.vue";
import InputDate from "../common/InputDate.vue";
import InputStandard from "../common/InputStandard.vue";
import ModalVue from "../common/Modal.vue";
import SelectStandard from "../common/SelectStandard.vue";
import { useCreateCapitalsourceModalStore } from "./CreateCapitalsourceModal.store";

const { t } = useI18n();
const store = useCreateCapitalsourceModalStore();
const { open, mData, title } = storeToRefs(store);
const { resetForm, save } = store;

const groupUseValues = [
  { id: undefined, value: "" },
  { id: false, value: t("General.no") },
  { id: true, value: t("General.yes") },
] as Array<SelectBoxValue>;

const { handleSubmit, values, setFieldTouched } = useForm();

const schema: Partial<{ [key in keyof Capitalsource]: ZodType }> = {
  comment: string(globErr(t("Capitalsource.validation.comment")))
    .min(1)
    .max(255, t("Capitalsource.validation.length.comment")),
  type: number(globErr(t("Capitalsource.validation.type"))).min(1),
  state: number(globErr(t("Capitalsource.validation.state")))
    .min(1)
    .max(2),
  accountNumber: string()
    .max(34, t("Capitalsource.validation.length.accountNumber"))
    .optional(),
  bankCode: string()
    .max(11, t("Capitalsource.validation.length.bankCode"))
    .optional(),
  validFrom: date(globErr(t("General.validation.validFrom"))),
  validTil: date(globErr(t("General.validation.validTil"))),
  groupUse: boolean(globErr(t("Capitalsource.validation.groupUse"))),
  importAllowed: number(globErr(t("Capitalsource.validation.importAllowed")))
    .min(0)
    .max(2),
};
const createCapitalsource = save(handleSubmit);
</script>
