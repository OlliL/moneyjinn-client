<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body>
      <form
        @submit.prevent="createCapitalsource"
        :id="'createCapitalsourceForm' + idSuffix"
        class="space-y-4"
      >
        <DivError :server-errors="serverErrors" />

        <div class="flex flex-col gap-4">
          <InputStandard
            v-model="mcs.comment"
            :validation-schema="schema.comment"
            :id="'comment' + idSuffix"
            :field-label="$t('General.name')"
          />

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-7">
              <SelectStandard
                v-model="mcs.type"
                :validation-schema="schema.type"
                :id="'type' + idSuffix"
                :field-label="$t('Capitalsource.type')"
                :select-box-values="capitalsourceTypeValues"
              />
            </div>
            <div class="col-span-5">
              <SelectStandard
                v-model="mcs.state"
                :validation-schema="schema.state"
                :id="'state' + idSuffix"
                :field-label="$t('Capitalsource.state')"
                :select-box-values="capitalsourceStateValues"
              />
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-7">
              <InputStandard
                v-model="mcs.accountNumber"
                :validation-schema="schema.accountNumber"
                :id="'accountNumber' + idSuffix"
                :field-label="$t('General.iban')"
              />
            </div>
            <div class="col-span-5">
              <InputStandard
                v-model="mcs.bankCode"
                :validation-schema="schema.bankCode"
                :id="'bankCode' + idSuffix"
                :field-label="$t('General.bic')"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <InputDate
              v-model="mcs.validFrom"
              :validation-schema="schema.validFrom"
              :id="'validFrom' + idSuffix"
              :field-label="$t('General.validFrom')"
            />
            <InputDate
              v-model="mcs.validTil"
              :validation-schema="schema.validTil"
              :id="'validTil' + idSuffix"
              :field-label="$t('General.validTil')"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <SelectStandard
              v-model="mcs.groupUse"
              :validation-schema="schema.groupUse"
              :id="'groupUse' + idSuffix"
              :field-label="$t('Capitalsource.groupUse')"
              :select-box-values="groupUseValues"
            />
            <SelectStandard
              v-model="mcs.importAllowed"
              :validation-schema="schema.importAllowed"
              :id="'importAllowed' + idSuffix"
              :field-label="$t('Capitalsource.importAllowed')"
              :select-box-values="capitalsourceImportValues"
            />
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <Button
        type="button"
        variant="secondary"
        class="flex items-center gap-2 px-6"
        @click="resetForm"
      >
        <Undo2 class="h-4 w-4" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        :form-id="'createCapitalsourceForm' + idSuffix"
        ><template #icon><Save class="h-4 w-4" /></template
      ></ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { boolean, date, number, string, ZodType } from "zod";

import { Button } from "@/components/ui/button";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputDate from "../InputDate.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";
import SelectStandard from "../SelectStandard.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";

import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import { capitalsourceImportValues } from "@/model/capitalsource/CapitalsourceImport";
import { capitalsourceStateValues } from "@/model/capitalsource/CapitalsourceState";
import { capitalsourceTypeValues } from "@/model/capitalsource/CapitalsourceType";

import CapitalsourceService from "@/service/CapitalsourceService";
import { Save, Undo2 } from "lucide-vue-next";

const { t } = useI18n();

const props = defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
});

const serverErrors = ref(new Array<string>());
const mcs = ref({} as Capitalsource);
const origMcs = ref({} as Capitalsource | undefined);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");

const emit = defineEmits(["capitalsourceUpdated", "capitalsourceCreated"]);

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

const title = computed(() => {
  return origMcs.value === undefined
    ? t("Capitalsource.title.create")
    : t("Capitalsource.title.update");
});

const resetForm = () => {
  if (origMcs.value) {
    Object.assign(mcs.value, origMcs.value);
  } else {
    mcs.value = {
      validFrom: new Date(),
      validTil: new Date("2999-12-31"),
    } as Capitalsource;
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = async (_mcs?: Capitalsource) => {
  origMcs.value = _mcs ?? undefined;
  resetForm();
  modalComponent.value?._show();
};

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

      modalComponent.value?._hide();
      emit(
        isUpdate ? "capitalsourceUpdated" : "capitalsourceCreated",
        mcs.value,
      );
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});

defineExpose({ _show });
</script>
