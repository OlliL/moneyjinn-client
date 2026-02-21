<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form
        @submit.prevent="createEtfPreliminaryLumpSum"
        id="createEtfPreliminaryLumpSumYearForm"
      >
        <div class="container-fluid">
          <DivError :server-errors="serverErrors" />
          <div class="row pt-2">
            <div class="col-xs-12">
              <SelectStandard
                v-model="mep.etfId"
                :validation-schema="schema.etfId"
                id="etf"
                :field-label="$t('General.etf')"
                :select-box-values="etfs"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputDate
                v-model="year"
                :validation-schema="schema.year"
                id="bookingdate"
                :field-label="$t('General.year')"
                pick-mode="year"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="mep.amountDecember"
                :validation-schema="schema.amountDecember"
                id="amountPerYear"
                step="0.01"
                field-type="number"
                :field-label="$t('ETFPreliminaryLumpSum.price')"
              >
                <template #icon
                  ><span class="input-group-text"
                    ><i class="bi bi-currency-euro"></i></span
                ></template>
              </InputStandard>
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary" @click="resetForm">
        {{ $t("General.reset") }}
      </button>
      <ButtonSubmit
        :button-label="$t('General.save')"
        form-id="createEtfPreliminaryLumpSumYearForm"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { date, type ZodType, number } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputDate from "../InputDate.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";
import SelectStandard from "../SelectStandard.vue";

import { amountSchema, globErr } from "@/tools/views/ZodUtil";
import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import type { SelectBoxValue } from "@/model/SelectBoxValue";

import CrudEtfPreliminaryLumpSumService from "@/service/CrudEtfPreliminaryLumpSumService";
import { EtfPreliminaryLumpSumType } from "@/model/etf/EtfPreliminaryLumpSumType";
import { useEtfStore } from "@/stores/EtfStore";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

const schema: Partial<{ [key in keyof EtfPreliminaryLumpSum]: ZodType }> = {
  etfId: number(globErr(t("ETFPreliminaryLumpSum.validation.etfId"))).gt(0),
  year: date(globErr(t("ETFPreliminaryLumpSum.validation.year"))),
  amountDecember: amountSchema(t("ETFPreliminaryLumpSum.validation.amount"), 2),
};

const etfs = ref(new Array<SelectBoxValue>());
const mep = ref({} as EtfPreliminaryLumpSum);
const origMep = ref({} as EtfPreliminaryLumpSum | undefined);
const defaultEtfId = ref(0 as number | undefined);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits([
  "etfPreliminaryLumpSumCreated",
  "etfPreliminaryLumpSumUpdated",
]);
const year = ref(new Date());
const etfStore = useEtfStore();

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origMep.value === undefined
    ? t("ETFPreliminaryLumpSum.title.create")
    : t("ETFPreliminaryLumpSum.title.update");
});

const resetForm = () => {
  mep.value = {} as EtfPreliminaryLumpSum;
  if (origMep.value) {
    Object.assign(mep.value, origMep.value);
  } else {
    if (defaultEtfId.value !== undefined) mep.value.etfId = defaultEtfId.value;
    mep.value.year = new Date().getFullYear();
    mep.value.type = EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR;
  }

  const localYearDate = new Date();
  localYearDate.setFullYear(mep.value.year);
  localYearDate.setDate(1);
  localYearDate.setMonth(1);
  localYearDate.setHours(0, 0, 0, 0);
  year.value = localYearDate;

  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = (_etfId?: number, _mep?: EtfPreliminaryLumpSum) => {
  etfs.value = etfStore.getAsSelectBoxValues();
  defaultEtfId.value = _etfId;
  origMep.value = _mep ?? undefined;
  resetForm();
  modalComponent.value?._show();
};

const createEtfPreliminaryLumpSum = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  mep.value.year = year.value.getFullYear();

  if (mep.value.id > 0) {
    //update
    CrudEtfPreliminaryLumpSumService.updateEtfPreliminaryLumpSum(mep.value)
      .then(() => {
        modalComponent.value?._hide();
        emit("etfPreliminaryLumpSumUpdated", mep.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  } else {
    //create
    CrudEtfPreliminaryLumpSumService.createEtfPreliminaryLumpSum(mep.value)
      .then((_etfPreliminaryLumpSum) => {
        mep.value = _etfPreliminaryLumpSum;
        modalComponent.value?._hide();
        emit("etfPreliminaryLumpSumCreated", mep.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});

defineExpose({ _show });
</script>
