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
        <DivError :server-errors="serverErrors" />

        <div class="form-section space-y-4">
          <div class="grid gap-1.5">
            <InputStandard
              v-model="mcs.comment"
              :validation-schema="schema.comment"
              id="comment-CreateCapitalsource"
              :field-label="$t('General.name')"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <SelectStandard
              v-model="mcs.type"
              :validation-schema="schema.type"
              id="type-CreateCapitalsource"
              :field-label="$t('Capitalsource.type')"
              :select-box-values="capitalsourceTypeValues"
            />
            <SelectStandard
              v-model="mcs.state"
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
                v-model="mcs.validFrom"
                :validation-schema="schema.validFrom"
                id="validFrom-CreateCapitalsource"
                :field-label="$t('General.validFrom')"
                picker-side="top"
              />
              <InputDate
                v-model="mcs.validTil"
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
                v-model="mcs.groupUse"
                :validation-schema="schema.groupUse"
                id="groupUse-CreateCapitalsource"
                :field-label="$t('Capitalsource.groupUse')"
                :select-box-values="groupUseValues"
              />
              <SelectStandard
                v-model="mcs.importAllowed"
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
              v-model="mcs.accountNumber"
              :validation-schema="schema.accountNumber"
              id="accountNumber-CreateCapitalsource"
              :field-label="$t('General.iban')"
            />
            <InputStandard
              v-model="mcs.bankCode"
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
        @click="resetForm"
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
import CapitalsourceService from "@/service/CapitalsourceService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";
import { Save, Undo2 } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import { computed, ref, toRaw, watch } from "vue";
import { useI18n } from "vue-i18n";
import { boolean, date, number, string, ZodType } from "zod";
import ButtonSubmit from "../common/ButtonSubmit.vue";
import DivError from "../common/DivError.vue";
import InputDate from "../common/InputDate.vue";
import InputStandard from "../common/InputStandard.vue";
import ModalVue from "../common/Modal.vue";
import SelectStandard from "../common/SelectStandard.vue";
import { useCreateCapitalsourceModalStore } from "./CreateCapitalsourceModal.store";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());
const mcs = ref({} as Capitalsource);
const origMcs = ref<Capitalsource | undefined>(undefined);
const { open, capitalsource, onDone } = storeToRefs(
  useCreateCapitalsourceModalStore(),
);

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

const title = computed(() =>
  origMcs.value === undefined
    ? t("Capitalsource.title.create")
    : t("Capitalsource.title.update"),
);

const resetForm = () => {
  if (origMcs.value) {
    mcs.value = structuredClone(toRaw(origMcs.value))!;
  } else {
    mcs.value = {
      validFrom: new Date(),
      validTil: new Date("2999-12-31"),
    } as Capitalsource;
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

watch(
  [open, capitalsource],
  ([isVisible, entry]) => {
    if (isVisible) {
      origMcs.value = entry;
      resetForm();
    }
  },
  { immediate: true },
);

const createCapitalsource = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  const serviceCall =
    mcs.value.id > 0
      ? CapitalsourceService.updateCapitalsource(mcs.value)
      : CapitalsourceService.createCapitalsource(mcs.value);

  serviceCall
    .then((result) => {
      const isUpdate = mcs.value.id > 0;
      if (!isUpdate) mcs.value = result as Capitalsource;
      open.value = false;
      onDone.value?.(mcs.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});
</script>
