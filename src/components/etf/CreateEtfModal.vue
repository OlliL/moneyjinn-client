<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form @submit.prevent="createEtf" :id="'createEtfForm' + idSuffix">
        <div class="container-fluid">
          <DivError :server-errors="serverErrors" />
          <div class="row">
            <div class="col-xs-12">
              <InputStandard
                v-model="met.name"
                :validation-schema="schema.name"
                :id="'name' + idSuffix"
                :field-label="$t('General.name')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="met.isin"
                :validation-schema="schema.isin"
                :id="'isin' + idSuffix"
                :field-label="$t('ETF.isin')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="met.wkn"
                :validation-schema="schema.wkn"
                :id="'wkn' + idSuffix"
                :field-label="$t('ETF.wkn')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="met.ticker"
                :validation-schema="schema.ticker"
                :id="'ticker' + idSuffix"
                :field-label="$t('ETF.ticker')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="met.chartUrl"
                :validation-schema="schema.chartUrl"
                :id="'chartUrl' + idSuffix"
                :field-label="$t('ETF.chartUrl')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="met.transactionCostsAbsolute"
                :validation-schema="schema.transactionCostsAbsolute"
                :id="'transactionCostsAbsolute' + idSuffix"
                field-type="number"
                step="0.01"
                :field-label="
                  $t('ETFFlow.transactionCosts') +
                  ' ' +
                  $t('ETFFlow.transactionCostsAbsolute')
                "
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
                v-model="met.transactionCostsRelative"
                :validation-schema="schema.transactionCostsRelative"
                :id="'transactionCostsRelative' + idSuffix"
                field-type="number"
                step="0.01"
                :field-label="
                  $t('ETFFlow.transactionCosts') +
                  ' ' +
                  $t('ETFFlow.transactionCostsRelative')
                "
              >
                <template #icon
                  ><span class="input-group-text"
                    ><i class="bi bi-percent"></i></span
                ></template>
              </InputStandard>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="met.transactionCostsMaximum"
                :validation-schema="schema.transactionCostsMaximum"
                :id="'transactionCostsMaximum' + idSuffix"
                field-type="number"
                step="0.01"
                :field-label="
                  $t('ETFFlow.transactionCosts') +
                  ' ' +
                  $t('ETFFlow.transactionCostsMaximum')
                "
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
                v-model="met.partialTaxExemption"
                :validation-schema="schema.partialTaxExemption"
                :id="'partialTaxExemption' + idSuffix"
                field-type="number"
                step="0.01"
                :field-label="$t('ETF.partialTaxExemption')"
              >
                <template #icon
                  ><span class="input-group-text"
                    ><i class="bi bi-percent"></i></span
                ></template>
              </InputStandard>
            </div>
          </div>
          <div class="row pt-3">
            <div class="col-xs-12">
              <div class="form-check form-check-inline form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="markAsFavorite"
                  id="markAsFavorite"
                />
                <label class="form-check-label" for="markAsFavorite">
                  {{ $t("ETF.markAsFav") }}
                </label>
              </div>
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
        :form-id="'createEtfForm' + idSuffix"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { string, union, ZodType, coerce } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";
import { amountSchema, globErr } from "@/tools/views/ZodUtil";

import type { Etf } from "@/model/etf/Etf";
import CrudEtfService from "@/service/CrudEtfService";

const { t } = useI18n();

defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
});

const serverErrors = ref(new Array<string>());

const schema: Partial<{ [key in keyof Etf]: ZodType }> = {
  isin: string(globErr(t("ETF.validation.isin")))
    .min(1)
    .max(30, t("ETF.validation.length.isin")),
  name: string(globErr(t("ETF.validation.name")))
    .min(1)
    .max(60, t("ETF.validation.length.name")),
  wkn: string(globErr(t("ETF.validation.wkn")))
    .min(1)
    .max(10, t("ETF.validation.length.wkn")),
  ticker: string(globErr(t("ETF.validation.ticker")))
    .min(1)
    .max(10, t("ETF.validation.length.ticker")),
  chartUrl: string().max(255, t("ETF.validation.length.chartUrl")).optional(),
  transactionCostsAbsolute: union([
    amountSchema(t("ETFFlow.validation.transactionCostsAbsolute")).optional(),
    coerce.string().length(0),
  ]),
  transactionCostsRelative: union([
    amountSchema(t("ETFFlow.validation.transactionCostsRelative")).optional(),
    coerce.string().length(0),
  ]),
  transactionCostsMaximum: union([
    amountSchema(t("ETFFlow.validation.transactionCostsMaximum")).optional(),
    coerce.string().length(0),
  ]),
  partialTaxExemption: union([
    amountSchema(t("ETF.validation.partialTaxExemption")).optional(),
    coerce.string().length(0),
  ]),
};

const met = ref({} as Etf);
const origMet = ref({} as Etf | undefined);
const modalComponent = ref();
const emit = defineEmits(["etfCreated", "etfUpdated"]);
const markAsFavorite = ref(false);

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origMet.value === undefined
    ? t("ETF.title.create")
    : t("ETF.title.update");
});

const resetForm = () => {
  if (origMet.value) {
    Object.assign(met.value, origMet.value);
  } else {
    met.value = {} as Etf;
  }
  if (met.value.isFavorite) {
    markAsFavorite.value = true;
  } else {
    markAsFavorite.value = false;
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = async (_met?: Etf) => {
  origMet.value = _met ?? undefined;
  resetForm();
  modalComponent.value._show();
};

const createEtf = handleSubmit(() => {
  serverErrors.value = new Array<string>();
  met.value.isFavorite = markAsFavorite.value;

  if (met.value.id > 0) {
    //update
    CrudEtfService.updateEtf(met.value)
      .then(() => {
        modalComponent.value._hide();
        emit("etfUpdated", met.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  } else {
    //create
    CrudEtfService.createEtf(met.value)
      .then((etf) => {
        met.value = etf;
        modalComponent.value._hide();
        emit("etfCreated", met.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});
defineExpose({ _show });
</script>
