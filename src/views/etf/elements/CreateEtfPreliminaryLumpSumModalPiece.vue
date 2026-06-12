<template>
  <ModalVue
    :title="title"
    max-width="max-w-md"
    id-suffix="CreateEtfPreliminaryLumpSumPiece"
    v-model:open="open"
  >
    <template #body>
      <form
        @submit.prevent="createEtfPreliminaryLumpSum"
        id="createEtfPreliminaryLumpSumPieceForm"
      >
        <div class="space-y-4">
          <div class="form-section space-y-4">
            <div class="grid grid-cols-2 sm:grid-cols-12 gap-4">
              <div class="col-span-2 sm:col-span-9">
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
                  picker-side="top"
                />
              </div>

              <div class="sm:col-span-12">
                <InputStandard
                  v-model="mep.amountPerPiece"
                  :validation-schema="schema.amountPerPiece"
                  id="amountPerPiece"
                  step="0.00000001"
                  field-type="number"
                  :field-label="$t('ETFPreliminaryLumpSum.price')"
                  :focus="true"
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
        data-testid="createEtfPreliminaryLumpSumPieceResetButton"
        @click="resetForm"
      >
        <Undo2 class="icon-medium" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        form-id="createEtfPreliminaryLumpSumPieceForm"
        test-id="createEtfPreliminaryLumpSumPieceSaveButton"
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
import { amountSchema, globErr } from "@/tools/views/ZodUtil";
import { Euro, Save, Undo2 } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import { computed, ref, toRaw, watch } from "vue";
import { useI18n } from "vue-i18n";
import { date, number, type ZodType } from "zod";
import useCreateEtfPreliminaryLumpSumModalPieceStore from "./CreateEtfPreliminaryLumpSumModalPiece.store";

const { t } = useI18n();

const modalStore = useCreateEtfPreliminaryLumpSumModalPieceStore();

const schema: Partial<{ [key in keyof EtfPreliminaryLumpSum]: ZodType }> = {
  etfId: number(globErr(t("ETFPreliminaryLumpSum.validation.etfId"))).gt(0),
  year: date(globErr(t("ETFPreliminaryLumpSum.validation.year"))),
  amountPerPiece: amountSchema(t("ETFPreliminaryLumpSum.validation.amount"), 8),
};

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

const { handleSubmit, values, setFieldTouched } = useForm();

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
    mep.value.type = EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE;
  }

  const localYearDate = new Date();
  localYearDate.setFullYear(mep.value.year);
  localYearDate.setDate(1);
  localYearDate.setMonth(1);
  localYearDate.setHours(0, 0, 0, 0);
  year.value = localYearDate;

  Object.keys(values).forEach((field) => setFieldTouched(field, false));
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
