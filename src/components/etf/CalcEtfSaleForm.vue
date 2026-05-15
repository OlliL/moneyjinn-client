<template>
  <div class="flex text-center" v-if="etf.id">
    <div class="w-full mb-4">
      <h4 class="text-2xl font-bold">{{ $t("ETFFlow.calculateSale") }}</h4>
    </div>
  </div>

  <form
    @submit.prevent="calculateEtfSale"
    v-if="etf.id"
    id="calculateEtfSaleForm"
  >
    <div class="flex justify-center">
      <div class="w-full max-w-xl mb-4">
        <div class="rounded-lg border bg-muted/20">
          <div class="p-4">
            <div class="space-y-4">
              <DivError :server-errors="serverErrors" />
              <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                <div class="w-full">
                  <InputStandard
                    v-model="calcEtfSalePieces"
                    :validation-schema="schema.pieces"
                    id="calcEtfSalePieces"
                    field-type="number"
                    step="1"
                    :field-label="$t('ETFFlow.amount')"
                  />
                </div>
                <div class="w-full">
                  <InputStandard
                    v-model="calcEtfBidPrice"
                    :validation-schema="schema.bidPrice"
                    id="calcEtfBidPrice"
                    field-type="number"
                    step="0.001"
                    :field-label="$t('ETFFlow.bid')"
                  >
                    <template #icon><Euro class="h-4 w-4" /></template>
                  </InputStandard>
                </div>
                <div class="w-full">
                  <InputStandard
                    v-model="calcEtfAskPrice"
                    :validation-schema="schema.askPrice"
                    id="calcEtfAskPrice"
                    field-type="number"
                    step="0.001"
                    :field-label="$t('ETFFlow.ask')"
                  >
                    <template #icon><Euro class="h-4 w-4" /></template>
                  </InputStandard>
                </div>
              </div>

              <div class="mb-1">
                <div class="w-full text-center mb-2 font-bold text-foreground">
                  {{ $t("ETFFlow.transactionCosts") }}
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                <div class="w-full">
                  <InputStandard
                    v-model="calcEtfTransactionCostsAbsolute"
                    :validation-schema="schema.transactionCostsAbsolute"
                    id="calcEtfTransactionCostsAbsolute"
                    field-type="number"
                    step="0.01"
                    :field-label="$t('ETFFlow.transactionCostsAbsolute')"
                  >
                    <template #icon><Euro class="h-4 w-4" /></template>
                  </InputStandard>
                </div>
                <div class="w-full">
                  <InputStandard
                    v-model="calcEtfTransactionCostsRelative"
                    :validation-schema="schema.transactionCostsRelative"
                    id="calcEtfTransactionCostsRelative"
                    field-type="number"
                    step="0.01"
                    :field-label="$t('ETFFlow.transactionCostsRelative')"
                  >
                    <template #icon><Percent class="h-4 w-4" /></template>
                  </InputStandard>
                </div>
                <div class="w-full">
                  <InputStandard
                    v-model="calcEtfTransactionCostsMaximum"
                    :validation-schema="schema.transactionCostsMaximum"
                    id="calcEtfTransactionCostsMaximum"
                    field-type="number"
                    step="0.01"
                    :field-label="$t('ETFFlow.transactionCostsMaximum')"
                  >
                    <template #icon><Euro class="h-4 w-4" /></template>
                  </InputStandard>
                </div>
              </div>
              <div>
                <div class="w-full justify-center flex">
                  <ButtonSubmit
                    :button-label="$t('ETFFlow.calculate')"
                    form-id="calculateEtfSaleForm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>

  <CalcEtfSaleResult :calcResults="calcResults" />
</template>

<script lang="ts" setup>
import type { Etf } from "@/model/etf/Etf";
import { Euro, Percent } from "lucide-vue-next";
import DivError from "../DivError.vue";
import InputStandard from "../InputStandard.vue";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import { ref, watch, type PropType } from "vue";
import { useForm } from "vee-validate";
import { amountSchema } from "@/tools/views/ZodUtil";
import { useI18n } from "vue-i18n";
import EtfService from "@/service/EtfService";
import type { EtfSalesCalculation } from "@/model/etf/EtfSalesCalculation";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import CalcEtfSaleResult from "./CalcEtfSaleResult.vue";
import ButtonSubmit from "../ButtonSubmit.vue";

const props = defineProps({
  etf: {
    type: Object as PropType<Etf>,
    required: true,
  },
  etfSummary: {
    type: Object as PropType<EtfSummary>,
    required: true,
  },
  pieces: {
    type: Number,
    required: false,
  },
});

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

const schema = {
  pieces: amountSchema(t("ETFFlow.validation.amount")),
  askPrice: amountSchema(t("ETFFlow.validation.askPrice"), 3),
  bidPrice: amountSchema(t("ETFFlow.validation.bidPrice"), 3),
  transactionCostsAbsolute: amountSchema(
    t("ETFFlow.validation.transactionCostsAbsolute"),
  ).optional(),
  transactionCostsRelative: amountSchema(
    t("ETFFlow.validation.transactionCostsRelative"),
  ).optional(),
  transactionCostsMaximum: amountSchema(
    t("ETFFlow.validation.transactionCostsMaximum"),
  ).optional(),
};

const calcEtfAskPrice = ref(0);
const calcEtfBidPrice = ref(0);
const calcEtfSalePieces = ref(0);
const calcEtfTransactionCostsAbsolute = ref(0 as number | undefined);
const calcEtfTransactionCostsRelative = ref(0 as number | undefined);
const calcEtfTransactionCostsMaximum = ref(0 as number | undefined);
const calcResults = ref({} as EtfSalesCalculation);

const { handleSubmit } = useForm();

const calculateEtfSale = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  EtfService.calcEtfSale(
    props.etf.id,
    calcEtfSalePieces.value,
    calcEtfBidPrice.value,
    calcEtfAskPrice.value,
    calcEtfTransactionCostsAbsolute.value,
    calcEtfTransactionCostsRelative.value,
    calcEtfTransactionCostsMaximum.value,
  )
    .then((_calcResults) => {
      calcResults.value = _calcResults;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});

watch(
  () => props.etf,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      calcResults.value = {} as EtfSalesCalculation;
      calcEtfTransactionCostsAbsolute.value = newVal.transactionCostsAbsolute;
      calcEtfTransactionCostsRelative.value = newVal.transactionCostsRelative;
      calcEtfTransactionCostsMaximum.value = newVal.transactionCostsMaximum;
    }
  },
  { immediate: true },
);

watch(
  () => props.etfSummary,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      calcEtfAskPrice.value = newVal.buyPrice ?? 0;
      calcEtfBidPrice.value = newVal.sellPrice ?? 0;
    }
  },
  { immediate: true },
);

watch(
  () => props.pieces,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      calcEtfSalePieces.value = newVal ?? 0;
    }
  },
  { immediate: true },
);
</script>
