<template>
  <ModalVue :title="title" max-width="max-w-md" ref="modalComponent">
    <template #body
      ><form @submit.prevent="createEtf" :id="'createEtfForm' + idSuffix">
        <div class="space-y-4">
          <DivError :server-errors="serverErrors" />

          <div class="form-section space-y-4">
            <div class="flex items-end gap-3">
              <div class="flex-1">
                <InputStandard
                  v-model="met.name"
                  :validation-schema="schema.name"
                  :id="'name' + idSuffix"
                  :field-label="$t('General.name')"
                />
              </div>

              <button
                type="button"
                @click="markAsFavorite = !markAsFavorite"
                class="flex items-center justify-center p-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 transition-colors"
                :title="$t('General.markAsFav')"
              >
                <Star
                  class="h-5 w-5 transition-all"
                  :class="
                    markAsFavorite
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground'
                  "
                />
              </button>
            </div>
          </div>

          <div class="form-section space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <InputStandard
                  v-model="met.partialTaxExemption"
                  :validation-schema="schema.partialTaxExemption"
                  :id="'partialTaxExemption' + idSuffix"
                  field-type="number"
                  step="0.01"
                  :field-label="$t('ETF.partialTaxExemption')"
                >
                  <template #icon><Percent class="icon-medium" /></template>
                </InputStandard>
              </div>
              <div>
                <InputStandard
                  v-model="met.isin"
                  :validation-schema="schema.isin"
                  :id="'isin' + idSuffix"
                  :field-label="$t('ETF.isin')"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <InputStandard
                  v-model="met.wkn"
                  :validation-schema="schema.wkn"
                  :id="'wkn' + idSuffix"
                  :field-label="$t('ETF.wkn')"
                />
              </div>
              <div>
                <InputStandard
                  v-model="met.ticker"
                  :validation-schema="schema.ticker"
                  :id="'ticker' + idSuffix"
                  :field-label="$t('ETF.ticker')"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-2">
              <div>
                <InputStandard
                  v-model="met.chartUrl"
                  :validation-schema="schema.chartUrl"
                  :id="'chartUrl' + idSuffix"
                  :field-label="$t('ETF.chartUrl')"
                />
              </div>
            </div>
          </div>

          <div class="form-section space-y-4">
            <div
              class="flex items-center space-x-2 border-b border-border/40 pb-2"
            >
              <span class="form-section-title">
                {{ $t("ETFFlow.transactionCosts") }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <InputStandard
                  v-model="met.transactionCostsAbsolute"
                  :validation-schema="schema.transactionCostsAbsolute"
                  :id="'transactionCostsAbsolute' + idSuffix"
                  field-type="number"
                  step="0.01"
                  :field-label="$t('ETFFlow.transactionCostsAbsolute')"
                >
                  <template #icon><Euro class="icon-medium" /></template>
                </InputStandard>
              </div>

              <div>
                <InputStandard
                  v-model="met.transactionCostsRelative"
                  :validation-schema="schema.transactionCostsRelative"
                  :id="'transactionCostsRelative' + idSuffix"
                  field-type="number"
                  step="0.01"
                  :field-label="$t('ETFFlow.transactionCostsRelative')"
                >
                  <template #icon><Percent class="icon-medium" /></template>
                </InputStandard>
              </div>

              <div>
                <InputStandard
                  v-model="met.transactionCostsMaximum"
                  :validation-schema="schema.transactionCostsMaximum"
                  :id="'transactionCostsMaximum' + idSuffix"
                  field-type="number"
                  step="0.01"
                  :field-label="$t('ETFFlow.transactionCostsMaximum')"
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
        @click="resetForm"
      >
        <Undo2 class="icon-medium" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        :form-id="'createEtfForm' + idSuffix"
      >
        <template #icon><Save class="icon-medium" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import DivError from "@/components/common/DivError.vue";
import InputStandard from "@/components/common/InputStandard.vue";
import ModalVue from "@/components/common/Modal.vue";
import { Button } from "@/components/ui/button";
import type { Etf } from "@/model/etf/Etf";
import CrudEtfService from "@/service/CrudEtfService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { amountSchema, globErr } from "@/tools/views/ZodUtil";
import { Euro, Percent, Save, Star, Undo2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { computed, ref, toRaw, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { string, ZodType } from "zod";

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
  transactionCostsAbsolute: amountSchema(
    t("ETFFlow.validation.transactionCostsAbsolute"),
  ).optional(),
  transactionCostsRelative: amountSchema(
    t("ETFFlow.validation.transactionCostsRelative"),
  ).optional(),
  transactionCostsMaximum: amountSchema(
    t("ETFFlow.validation.transactionCostsMaximum"),
  ).optional(),
  partialTaxExemption: amountSchema(
    t("ETF.validation.partialTaxExemption"),
  ).optional(),
};

const met = ref({} as Etf);
const origMet = ref({} as Etf | undefined);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
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
    met.value = structuredClone(toRaw(origMet.value))!;
  } else {
    met.value = {} as Etf;
  }
  markAsFavorite.value = !!met.value.isFavorite;
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = (_met?: Etf) => {
  origMet.value = _met ?? undefined;
  resetForm();
  modalComponent.value?._show();
};

const createEtf = handleSubmit(() => {
  serverErrors.value = new Array<string>();
  met.value.isFavorite = markAsFavorite.value;

  if (met.value.id > 0) {
    //update
    CrudEtfService.updateEtf(met.value)
      .then(() => {
        modalComponent.value?._hide();
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
        modalComponent.value?._hide();
        emit("etfCreated", met.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});
defineExpose({ _show });
</script>
