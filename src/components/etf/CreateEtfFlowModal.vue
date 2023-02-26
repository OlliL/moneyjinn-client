<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form @submit.prevent="createEtfFlow" id="createEtfFlowForm">
        <div class="container-fluid">
          <DivError :server-errors="serverErrors" />
          <div class="row">
            <div class="col-xs-12">
              <SelectStandard
                v-model="etfFlow.isin"
                :validation-schema="schema.isin"
                id="etf"
                :field-label="$t('ETF.etf')"
                :select-box-values="etfs"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputDate
                v-model="bookingdate"
                :validation-schema="schema.timestamp"
                id="bookingdate"
                :field-label="$t('ETF.bookingdate')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="bookingtime"
                :validation-schema="schema.nanoseconds"
                id="bookingtime"
                :field-label="$t('ETF.bookingtime')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="etfFlow.amount"
                :validation-schema="schema.amount"
                id="amount"
                field-type="number"
                step="0.001"
                :field-label="$t('ETF.amount')"
              />
            </div>
          </div>

          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="etfFlow.price"
                :validation-schema="schema.price"
                id="price"
                step="0.01"
                field-type="number"
                :field-label="$t('ETF.price')"
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
        form-id="createEtfFlowForm"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { coerce, date, string, type ZodType, union } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputDate from "../InputDate.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";
import SelectStandard from "../SelectStandard.vue";

import { formatTime } from "@/tools/views/FormatDate";
import { globErr } from "@/tools/views/ZodUtil";
import { handleBackendError } from "@/tools/views/ThrowError";

import type { Etf } from "@/model/etf/Etf";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import type { SelectBoxValue } from "@/model/SelectBoxValue";

import EtfFlowControllerHandler from "@/handler/EtfControllerHandler";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

const amountErrMsg = globErr(t("ETF.validation.amount"));
const priceErrMsg = globErr(t("ETF.validation.price"));

const schema: Partial<{ [key in keyof EtfFlow]: ZodType }> = {
  isin: string(globErr(t("ETF.validation.isin"))),
  timestamp: date(globErr(t("ETF.validation.timestamp"))),
  nanoseconds: string(globErr(t("ETF.validation.nanoseconds"))).regex(
    new RegExp("^[0-9][0-9]:[0-9][0-9]:[0-9][0-9]:[0-9]{3}$")
  ),
  amount: union(
    [coerce.number(amountErrMsg).gt(0), coerce.number(amountErrMsg).lt(0)],
    amountErrMsg
  ),
  price: union(
    [coerce.number(priceErrMsg).gt(0), coerce.number(priceErrMsg).lt(0)],
    priceErrMsg
  ),
};

const etfs = ref(new Array<SelectBoxValue>());
const etfFlow = ref({} as EtfFlow);
const origEtfFlow = ref({} as EtfFlow | undefined);
const bookingdate = ref(new Date());
const bookingtime = ref("");
const modalComponent = ref();
const emit = defineEmits(["etfFlowCreated", "etfFlowUpdated"]);

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return etfFlow.value === undefined
    ? t("ETF.title.create")
    : t("ETF.title.update");
});

const resetForm = () => {
  if (origEtfFlow.value) {
    Object.assign(etfFlow.value, origEtfFlow.value);
    bookingdate.value = new Date(origEtfFlow.value.timestamp);
    bookingdate.value.setHours(0, 0, 0, 0);

    bookingtime.value =
      formatTime(origEtfFlow.value.timestamp) +
      ":" +
      String(origEtfFlow.value.nanoseconds + 1000000000).substring(1, 4); //80000000 -> 1080000000 -> 080
  } else {
    etfFlow.value = {
      isin: etfs.value[0].id,
    } as EtfFlow;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    bookingdate.value = today;
    bookingtime.value = "";
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = (_etfs: Array<Etf>, _etfFlow?: EtfFlow) => {
  etfs.value = new Array<SelectBoxValue>();
  for (let etf of _etfs) {
    etfs.value.push({ id: etf.isin, value: etf.name });
  }
  origEtfFlow.value = _etfFlow ? _etfFlow : undefined;
  resetForm();
  modalComponent.value._show();
};

const createEtfFlow = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  const times: Array<string> = bookingtime.value.split(":");
  const bookingDate = bookingdate.value;
  if (times && times.length == 4 && bookingDate) {
    etfFlow.value.timestamp = bookingDate;
    etfFlow.value.timestamp.setHours(+times[0], +times[1], +times[2], 0);
    etfFlow.value.nanoseconds = +times[3] * 1000000;

    if (etfFlow.value.etfflowid > 0) {
      //update
      EtfFlowControllerHandler.updateEtfFlow(etfFlow.value)
        .then(() => {
          modalComponent.value._hide();
          emit("etfFlowUpdated", etfFlow.value);
        })
        .catch((backendError) => {
          handleBackendError(backendError, serverErrors);
        });
    } else {
      //create
      EtfFlowControllerHandler.createEtfFlow(etfFlow.value)
        .then((_etfFlow) => {
          etfFlow.value = _etfFlow;
          modalComponent.value._hide();
          emit("etfFlowCreated", etfFlow.value);
        })
        .catch((backendError) => {
          handleBackendError(backendError, serverErrors);
        });
    }
  }
});
defineExpose({ _show });
</script>
