<template>
  <ModalVue
    :title="title"
    maxWidth="max-w-[calc(100%-2rem)] md:max-w-2xl lg:max-w-2xl w-full mx-auto"
    ref="modalComponent"
  >
    <template #body>
      <form
        @submit.prevent="createPreDefMoneyflow"
        :id="'createPreDefMoneyflowForm' + idSuffix"
      >
        <div class="space-y-4">
          <DivError :server-errors="serverErrors" />

          <div class="form-section space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div class="sm:col-span-4">
                <InputStandard
                  v-model="mpm.amount"
                  :validation-schema="schema.amount"
                  id="amount"
                  field-type="number"
                  step="0.01"
                  :field-label="$t('General.amount')"
                >
                  <template #icon><Euro class="icon-medium" /></template>
                </InputStandard>
              </div>
              <div class="sm:col-span-8">
                <InputStandard
                  v-model="mpm.comment"
                  :validation-schema="schema.comment"
                  :id="'comment' + idSuffix"
                  :field-label="$t('General.comment')"
                />
              </div>

              <div class="sm:col-span-8">
                <SelectContractpartner
                  v-model="mpm.contractpartnerId"
                  :validation-schema="schema.contractpartnerId"
                  :id-suffix="'CreatePreDefMoneyflow' + idSuffix"
                  :field-label="$t('General.contractpartner')"
                />
              </div>
              <div class="sm:col-span-4">
                <SelectStandard
                  v-model="mpm.onceAMonth"
                  :validation-schema="schema.onceAMonth"
                  :id="'onceAMonth' + idSuffix"
                  :field-label="$t('PreDefMoneyflow.onceAMonth')"
                  :select-box-values="onceAMonthValues"
                />
              </div>

              <div class="sm:col-span-6">
                <SelectCapitalsource
                  v-model="mpm.capitalsourceId"
                  :validation-schema="schema.capitalsourceId"
                  :id-suffix="'CreatePreDefMoneyflow' + idSuffix"
                  :field-label="$t('General.capitalsource')"
                  :validity-date="validityDate"
                />
              </div>
              <div class="sm:col-span-6">
                <SelectPostingAccount
                  v-model="mpm.postingAccountId"
                  :validation-schema="schema.postingAccountId"
                  :id-suffix="'CreatePreDefMoneyflow' + idSuffix"
                  :field-label="$t('General.postingAccount')"
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
        :form-id="'createPreDefMoneyflowForm' + idSuffix"
      >
        <template #icon><Save class="icon-medium" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { amountSchema, globErr } from "@/tools/views/ZodUtil";
import { Euro, Save, Undo2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { computed, ref, toRaw, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { boolean, number, string, ZodType } from "zod";
import SelectCapitalsource from "../capitalsource/SelectCapitalsource.vue";
import ButtonSubmit from "../common/ButtonSubmit.vue";
import DivError from "../common/DivError.vue";
import InputStandard from "../common/InputStandard.vue";
import ModalVue from "../common/Modal.vue";
import SelectStandard from "../common/SelectStandard.vue";
import SelectContractpartner from "../contractpartner/SelectContractpartner.vue";
import SelectPostingAccount from "../postingaccount/SelectPostingAccount.vue";

const { t } = useI18n();

defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
});

const serverErrors = ref(new Array<string>());

const schema: Partial<{ [key in keyof PreDefMoneyflow]: ZodType }> = {
  amount: amountSchema(t("Moneyflow.validation.amount")),
  contractpartnerId: number(
    globErr(t("Moneyflow.validation.contractpartnerId")),
  ).gt(0),
  comment: string(globErr(t("Moneyflow.validation.comment")))
    .min(1)
    .max(100, t("Moneyflow.validation.length.comment")),
  postingAccountId: number(
    globErr(t("Moneyflow.validation.postingAccountId")),
  ).gt(0),
  capitalsourceId: number(globErr(t("General.validation.capitalsource"))).gt(0),
  onceAMonth: boolean(globErr(t("PreDefMoneyflow.validation.onceAMonth"))),
};

const mpm = ref({} as PreDefMoneyflow);
const origMpm = ref({} as PreDefMoneyflow | undefined);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const validityDate = new Date();
validityDate.setHours(0, 0, 0, 0);
const emit = defineEmits(["preDefMoneyflowCreated", "preDefMoneyflowUpdated"]);

const onceAMonthValues = [
  { id: undefined, value: "" },
  { id: false, value: t("General.no") },
  { id: true, value: t("General.yes") },
] as Array<SelectBoxValue>;

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origMpm.value === undefined
    ? t("PreDefMoneyflow.title.create")
    : t("PreDefMoneyflow.title.update");
});

const resetForm = () => {
  if (origMpm.value) {
    mpm.value = structuredClone(toRaw(origMpm.value))!;
  } else {
    mpm.value = {} as PreDefMoneyflow;
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = async (_mpm?: PreDefMoneyflow) => {
  origMpm.value = _mpm ?? undefined;
  resetForm();
  modalComponent.value?._show();
};

const createPreDefMoneyflow = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  if (mpm.value.id > 0) {
    //update
    PreDefMoneyflowService.updatePreDefMoneyflow(mpm.value)
      .then(() => {
        modalComponent.value?._hide();
        emit("preDefMoneyflowUpdated", mpm.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  } else {
    //create
    PreDefMoneyflowService.createPreDefMoneyflow(mpm.value)
      .then((_mpm) => {
        mpm.value = _mpm;
        modalComponent.value?._hide();
        emit("preDefMoneyflowCreated", mpm.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});
defineExpose({ _show });
</script>
