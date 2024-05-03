<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form
        @submit.prevent="createEtfPreliminaryLumpSum"
        id="createEtfPreliminaryLumpSumForm"
      >
        <div class="container-fluid">
          <DivError :server-errors="serverErrors" />
          <div class="row">
            <div class="col-xs-12">
              <SelectStandard
                v-model="defaultEtfId"
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
                :field-label="$t('ETFFlow.bookingdate')"
                pick-mode="year"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="etfPreliminaryLumpSum.amountJanuary"
                :validation-schema="schema.amountJanuary"
                id="amountJanuary"
                step="0.01"
                field-type="number"
                :field-label="$t('ETFFlow.amountJanuary')"
              >
                <template #icon
                  ><span class="input-group-text"
                    ><i class="bi bi-currency-euro"></i></span
                ></template>
              </InputStandard>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="etfPreliminaryLumpSum.amountFebruary"
                :validation-schema="schema.amountFebruary"
                id="amountFebruary"
                step="0.01"
                field-type="number"
                :field-label="$t('ETFFlow.amount')"
              >
                <template #icon
                  ><span class="input-group-text"
                    ><i class="bi bi-currency-euro"></i></span
                ></template>
              </InputStandard>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="etfPreliminaryLumpSum.amountMarch"
                :validation-schema="schema.amountMarch"
                id="amountMarch"
                step="0.01"
                field-type="number"
                :field-label="$t('ETFFlow.amount')"
              >
                <template #icon
                  ><span class="input-group-text"
                    ><i class="bi bi-currency-euro"></i></span
                ></template>
              </InputStandard>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="etfPreliminaryLumpSum.amountApril"
                :validation-schema="schema.amountApril"
                id="amountApril"
                step="0.01"
                field-type="number"
                :field-label="$t('ETFFlow.amount')"
              >
                <template #icon
                  ><span class="input-group-text"
                    ><i class="bi bi-currency-euro"></i></span
                ></template>
              </InputStandard>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="etfPreliminaryLumpSum.amountMay"
                :validation-schema="schema.amountMay"
                id="amountMay"
                step="0.01"
                field-type="number"
                :field-label="$t('ETFFlow.amount')"
              >
                <template #icon
                  ><span class="input-group-text"
                    ><i class="bi bi-currency-euro"></i></span
                ></template>
              </InputStandard>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="etfPreliminaryLumpSum.amountJune"
                :validation-schema="schema.amountJune"
                id="amountJune"
                step="0.01"
                field-type="number"
                :field-label="$t('ETFFlow.amount')"
              >
                <template #icon
                  ><span class="input-group-text"
                    ><i class="bi bi-currency-euro"></i></span
                ></template>
              </InputStandard>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="etfPreliminaryLumpSum.amountJuly"
                :validation-schema="schema.amountJuly"
                id="amountJuly"
                step="0.01"
                field-type="number"
                :field-label="$t('ETFFlow.amount')"
              >
                <template #icon
                  ><span class="input-group-text"
                    ><i class="bi bi-currency-euro"></i></span
                ></template>
              </InputStandard>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="etfPreliminaryLumpSum.amountAugust"
                :validation-schema="schema.amountAugust"
                id="amountJune"
                step="0.01"
                field-type="number"
                :field-label="$t('ETFFlow.amount')"
              >
                <template #icon
                  ><span class="input-group-text"
                    ><i class="bi bi-currency-euro"></i></span
                ></template>
              </InputStandard>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="etfPreliminaryLumpSum.amountSeptember"
                :validation-schema="schema.amountSeptember"
                id="amountSeptember"
                step="0.01"
                field-type="number"
                :field-label="$t('ETFFlow.amount')"
              >
                <template #icon
                  ><span class="input-group-text"
                    ><i class="bi bi-currency-euro"></i></span
                ></template>
              </InputStandard>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="etfPreliminaryLumpSum.amountOctober"
                :validation-schema="schema.amountOctober"
                id="amountOctober"
                step="0.01"
                field-type="number"
                :field-label="$t('ETFFlow.amount')"
              >
                <template #icon
                  ><span class="input-group-text"
                    ><i class="bi bi-currency-euro"></i></span
                ></template>
              </InputStandard>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="etfPreliminaryLumpSum.amountNovember"
                :validation-schema="schema.amountNovember"
                id="amountNovember"
                step="0.01"
                field-type="number"
                :field-label="$t('ETFFlow.amount')"
              >
                <template #icon
                  ><span class="input-group-text"
                    ><i class="bi bi-currency-euro"></i></span
                ></template>
              </InputStandard>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="etfPreliminaryLumpSum.amountDecember"
                :validation-schema="schema.amountDecember"
                id="amountDecember"
                step="0.01"
                field-type="number"
                :field-label="$t('ETFFlow.amount')"
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
        form-id="createEtfPreliminaryLumpSumForm"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
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

import type { Etf } from "@/model/etf/Etf";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import type { SelectBoxValue } from "@/model/SelectBoxValue";

import CrudEtfPreliminaryLumpSumControllerHandler from "@/handler/CrudEtfPreliminaryLumpSumControllerHandler";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

const schema: Partial<{ [key in keyof EtfPreliminaryLumpSum]: ZodType }> = {
  etfId: number(globErr(t("ETFFlow.validation.etfId"))).gt(0),
  year: date(globErr(t("ETFFlow.validation.timestamp"))),
  amountJanuary: amountSchema(t("Moneyflow.validation.amount")),
  amountFebruary: amountSchema(t("Moneyflow.validation.amount")),
  amountMarch: amountSchema(t("Moneyflow.validation.amount")),
  amountApril: amountSchema(t("Moneyflow.validation.amount")),
  amountMay: amountSchema(t("Moneyflow.validation.amount")),
  amountJune: amountSchema(t("Moneyflow.validation.amount")),
  amountJuly: amountSchema(t("Moneyflow.validation.amount")),
  amountAugust: amountSchema(t("Moneyflow.validation.amount")),
  amountSeptember: amountSchema(t("Moneyflow.validation.amount")),
  amountOctober: amountSchema(t("Moneyflow.validation.amount")),
  amountNovember: amountSchema(t("Moneyflow.validation.amount")),
  amountDecember: amountSchema(t("Moneyflow.validation.amount")),
};

const etfs = ref(new Array<SelectBoxValue>());
const etfPreliminaryLumpSum = ref({} as EtfPreliminaryLumpSum);
const origEtfPreliminaryLumpSum = ref({} as EtfPreliminaryLumpSum | undefined);
const defaultEtfId = ref(0);
const defaultYear = ref(0);
const modalComponent = ref();
const emit = defineEmits([
  "etfPreliminaryLumpSumCreated",
  "etfPreliminaryLumpSumUpdated",
]);
const year = ref(new Date());

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return etfPreliminaryLumpSum.value === undefined
    ? t("ETFFlow.title.create")
    : t("ETFFlow.title.update");
});

const resetForm = () => {
  if (origEtfPreliminaryLumpSum.value) {
    Object.assign(etfPreliminaryLumpSum.value, origEtfPreliminaryLumpSum.value);
  }

  const localYearDate = new Date();
  localYearDate.setFullYear(defaultYear.value);
  localYearDate.setDate(1);
  localYearDate.setMonth(1);
  localYearDate.setHours(0, 0, 0, 0);
  year.value = localYearDate;

  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = (_etfs: Array<Etf>, _etfId?: number, _year?: number) => {
  etfs.value = new Array<SelectBoxValue>();
  for (let etf of _etfs) {
    etfs.value.push({ id: etf.id, value: etf.name });
  }
  if (_etfId && _year) {
    CrudEtfPreliminaryLumpSumControllerHandler.fetchEtfPreliminaryLumpSum(
      _etfId,
      _year,
    )
      .then((response) => {
        origEtfPreliminaryLumpSum.value = response;
        defaultEtfId.value = response.etfId;
        defaultYear.value = response.year;
        resetForm();
        modalComponent.value._show();
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  } else {
    origEtfPreliminaryLumpSum.value = undefined;
    defaultEtfId.value = _etfId ?? 0;
    defaultYear.value = _year ?? new Date().getFullYear();
    resetForm();
    modalComponent.value._show();
  }
};

const createEtfPreliminaryLumpSum = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  etfPreliminaryLumpSum.value.etfId = defaultEtfId.value;

  if (origEtfPreliminaryLumpSum.value) {
    //update
    CrudEtfPreliminaryLumpSumControllerHandler.updateEtfPreliminaryLumpSum(
      etfPreliminaryLumpSum.value,
    )
      .then(() => {
        modalComponent.value._hide();
        emit("etfPreliminaryLumpSumUpdated", etfPreliminaryLumpSum.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  } else {
    //create
    CrudEtfPreliminaryLumpSumControllerHandler.createEtfPreliminaryLumpSum(
      etfPreliminaryLumpSum.value,
    )
      .then((_etfPreliminaryLumpSum) => {
        etfPreliminaryLumpSum.value = _etfPreliminaryLumpSum;
        modalComponent.value._hide();
        emit("etfPreliminaryLumpSumCreated", etfPreliminaryLumpSum.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});

defineExpose({ _show });
</script>
