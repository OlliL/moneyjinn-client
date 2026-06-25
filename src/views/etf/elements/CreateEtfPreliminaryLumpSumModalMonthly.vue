<template>
  <ModalVue
    :title="title"
    max-width="max-w-md"
    id-suffix="CreateEtfPreliminaryLumpSumMonthly"
    v-model:open="open"
  >
    <template #body>
      <form
        @submit.prevent="createEtfPreliminaryLumpSum"
        id="createEtfPreliminaryLumpSumForm"
      >
        <div class="space-y-4">
          <div class="form-section space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div class="sm:col-span-9">
                <SelectStandard
                  v-model="mep.etfId"
                  :validation-schema="schema.etfId"
                  id="etf"
                  :field-label="$t('General.etf')"
                  :select-box-values="etfs"
                />
              </div>
              <div class="sm:col-span-3">
                <InputDate
                  v-model="year"
                  :validation-schema="schema.year"
                  id="bookingdate"
                  :field-label="$t('General.year')"
                  pick-mode="year"
                />
              </div>
            </div>
          </div>

          <div class="form-section space-y-4">
            <div
              class="flex items-center space-x-2 border-b border-border/40 pb-2"
            >
              <span class="form-section-title">
                {{ $t("ETFPreliminaryLumpSum.amounts") }}
              </span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="month in months" :key="month.id">
                <InputStandard
                  v-model="mep[month.property]"
                  :validation-schema="schema[month.property]"
                  :id="month.property"
                  step="0.01"
                  field-type="number"
                  :field-label="getMonthName(month.id)"
                  :focus="month.id === 1"
                >
                  <template #icon><Euro class="icon-medium" /></template>
                </InputStandard>
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
        data-testid="createEtfPreliminaryLumpSumMonthlyResetButton"
        @click="resetForm"
      >
        <Undo2 class="icon-medium" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        form-id="createEtfPreliminaryLumpSumForm"
        test-id="createEtfPreliminaryLumpSumMonthlySaveButton"
      >
        <template #icon><Save class="icon-medium" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import InputDate from "@/components/common/InputDate.vue";
import InputStandard from "@/components/common/InputStandard.vue";
import ModalVue from "@/components/common/Modal.vue";
import SelectStandard from "@/components/common/SelectStandard.vue";
import { Button } from "@/components/ui/button";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import { EtfPreliminaryLumpSumType } from "@/model/etf/EtfPreliminaryLumpSumType";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import CrudEtfPreliminaryLumpSumService from "@/service/CrudEtfPreliminaryLumpSumService";
import { useEtfStore } from "@/stores/EtfStore";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { getMonthName } from "@/tools/views/MonthName";
import { createFormContext } from "@/tools/views/ValidationUtil";
import { amountSchema, globErr } from "@/tools/views/ZodUtil";
import { Euro, Save, Undo2 } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { computed, ref, toRaw, watch } from "vue";
import { useI18n } from "vue-i18n";
import { date, number, type ZodType } from "zod";
import useCreateEtfPreliminaryLumpSumModalMonthlyStore from "./CreateEtfPreliminaryLumpSumModalMonthly.store";

const { t } = useI18n();

const modalStore = useCreateEtfPreliminaryLumpSumModalMonthlyStore();

const schema: Partial<{ [key in keyof EtfPreliminaryLumpSum]: ZodType }> = {
  etfId: number(globErr(t("ETFFlow.validation.etfId"))).gt(0),
  year: date(globErr(t("ETFPreliminaryLumpSum.validation.year"))),
  amountJanuary: amountSchema(t("ETFPreliminaryLumpSum.validation.amount")),
  amountFebruary: amountSchema(t("ETFPreliminaryLumpSum.validation.amount")),
  amountMarch: amountSchema(t("ETFPreliminaryLumpSum.validation.amount")),
  amountApril: amountSchema(t("ETFPreliminaryLumpSum.validation.amount")),
  amountMay: amountSchema(t("ETFPreliminaryLumpSum.validation.amount")),
  amountJune: amountSchema(t("ETFPreliminaryLumpSum.validation.amount")),
  amountJuly: amountSchema(t("ETFPreliminaryLumpSum.validation.amount")),
  amountAugust: amountSchema(t("ETFPreliminaryLumpSum.validation.amount")),
  amountSeptember: amountSchema(t("ETFPreliminaryLumpSum.validation.amount")),
  amountOctober: amountSchema(t("ETFPreliminaryLumpSum.validation.amount")),
  amountNovember: amountSchema(t("ETFPreliminaryLumpSum.validation.amount")),
  amountDecember: amountSchema(t("ETFPreliminaryLumpSum.validation.amount")),
};

// Original month mappings for the loop
const months: Array<{
  id: number;
  property: keyof EtfPreliminaryLumpSum;
}> = [
  { id: 1, property: "amountJanuary" },
  { id: 2, property: "amountFebruary" },
  { id: 3, property: "amountMarch" },
  { id: 4, property: "amountApril" },
  { id: 5, property: "amountMay" },
  { id: 6, property: "amountJune" },
  { id: 7, property: "amountJuly" },
  { id: 8, property: "amountAugust" },
  { id: 9, property: "amountSeptember" },
  { id: 10, property: "amountOctober" },
  { id: 11, property: "amountNovember" },
  { id: 12, property: "amountDecember" },
];

const etfs = ref(new Array<SelectBoxValue>());
const mep = ref({} as EtfPreliminaryLumpSum);
const origMep = ref({} as EtfPreliminaryLumpSum | undefined);
const {
  open,
  lumpSum: etfPreliminaryLumpSumModel,
  defaultEtfId,
  onDone,
} = storeToRefs(modalStore);
const year = ref(new Date());
const etfStore = useEtfStore();

const { handleSubmit, resetAll } = createFormContext();

const title = computed(() =>
  origMep.value === undefined
    ? t("ETFPreliminaryLumpSum.title.create")
    : t("ETFPreliminaryLumpSum.title.update"),
);

const resetForm = () => {
  mep.value = {} as EtfPreliminaryLumpSum;
  if (origMep.value) {
    mep.value = structuredClone(toRaw(origMep.value))!;
  } else {
    if (defaultEtfId.value !== undefined) mep.value.etfId = defaultEtfId.value;
    mep.value.year = new Date().getFullYear();
    mep.value.type = EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH;
  }

  const localYearDate = new Date();
  localYearDate.setFullYear(mep.value.year);
  localYearDate.setDate(1);
  localYearDate.setMonth(1);
  localYearDate.setHours(0, 0, 0, 0);
  year.value = localYearDate;

  resetAll();
};

watch(
  [open, etfPreliminaryLumpSumModel, defaultEtfId],
  ([newOpen, newEtfPreliminaryLumpSum]) => {
    if (newOpen) {
      etfs.value = etfStore.getAsSelectBoxValues();
      origMep.value = newEtfPreliminaryLumpSum ?? undefined;
      resetForm();
    }
  },
  { immediate: true },
);

const createEtfPreliminaryLumpSum = handleSubmit(() => {
  mep.value.year = year.value.getFullYear();

  // Update
  if (mep.value.id > 0) {
    //update
    CrudEtfPreliminaryLumpSumService.updateEtfPreliminaryLumpSum(mep.value)
      .then(() => {
        open.value = false;
        onDone.value?.(mep.value);
      })
      .catch(handleBackendError);
  } else {
    // Create
    CrudEtfPreliminaryLumpSumService.createEtfPreliminaryLumpSum(mep.value)
      .then((_etfPreliminaryLumpSum) => {
        mep.value = _etfPreliminaryLumpSum;
        open.value = false;
        onDone.value?.(mep.value);
      })
      .catch(handleBackendError);
  }
});
</script>
