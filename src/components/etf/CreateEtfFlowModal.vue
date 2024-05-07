<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form @submit.prevent="createEtfFlow" id="createEtfFlowForm">
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
                v-model="bookingdate"
                :validation-schema="schema.timestamp"
                id="bookingdate"
                :field-label="$t('ETFFlow.bookingdate')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="bookingtime"
                :validation-schema="schema.nanoseconds"
                id="bookingtime"
                :field-label="$t('ETFFlow.bookingtime')"
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
                step="0.00001"
                :field-label="$t('ETFFlow.amount')"
              />
            </div>
          </div>

          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="etfFlow.price"
                :validation-schema="schema.price"
                id="price"
                step="0.001"
                field-type="number"
                :field-label="$t('ETFFlow.price')"
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
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { coerce, date, string, type ZodType, union, number } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputDate from "../InputDate.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";
import SelectStandard from "../SelectStandard.vue";

import { formatTime } from "@/tools/views/FormatDate";
import { globErr } from "@/tools/views/ZodUtil";
import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { Etf } from "@/model/etf/Etf";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import type { SelectBoxValue } from "@/model/SelectBoxValue";

import CrudEtfFlowControllerHandler from "@/handler/CrudEtfFlowControllerHandler";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());
const defaultEtfId = ref(0);

const amountErrMsg = globErr(t("ETFFlow.validation.amount"));
const priceErrMsg = globErr(t("ETFFlow.validation.price"));

const schema: Partial<{ [key in keyof EtfFlow]: ZodType }> = {
  etfId: number(globErr(t("ETFFlow.validation.etfId"))).gt(0),
  timestamp: date(globErr(t("ETFFlow.validation.timestamp"))),
  nanoseconds: string(globErr(t("ETFFlow.validation.nanoseconds"))).regex(
    new RegExp("^[0-9][0-9]:[0-9][0-9]:[0-9][0-9]:[0-9]{3}$"),
  ),
  amount: union(
    [coerce.number(amountErrMsg).gt(0), coerce.number(amountErrMsg).lt(0)],
    amountErrMsg,
  ),
  price: union(
    [coerce.number(priceErrMsg).gt(0), coerce.number(priceErrMsg).lt(0)],
    priceErrMsg,
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
    ? t("ETFFlow.title.create")
    : t("ETFFlow.title.update");
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
      etfId: defaultEtfId.value,
    } as EtfFlow;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    bookingdate.value = today;
    bookingtime.value = "";
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = (_etfs: Array<Etf>, _etfFlow?: EtfFlow, _etfId?: number) => {
  etfs.value = new Array<SelectBoxValue>();
  for (let etf of _etfs) {
    etfs.value.push({ id: etf.id, value: etf.name });
  }
  if (_etfFlow) {
    origEtfFlow.value = _etfFlow;
    defaultEtfId.value = _etfFlow.etfId;
  } else {
    origEtfFlow.value = undefined;
    defaultEtfId.value = _etfId ?? 0;
  }
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
    etfFlow.value.etfId = defaultEtfId.value;

    if (etfFlow.value.etfflowid > 0) {
      //update
      CrudEtfFlowControllerHandler.updateEtfFlow(etfFlow.value)
        .then(() => {
          modalComponent.value._hide();
          emit("etfFlowUpdated", etfFlow.value);
        })
        .catch((backendError) => {
          handleBackendError(backendError, serverErrors);
        });
    } else {
      //create
      CrudEtfFlowControllerHandler.createEtfFlow(etfFlow.value)
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

watch(bookingtime, (newVal, oldVal) => {
  if (newVal != oldVal && !newVal.endsWith(":")) {
    if (
      bookingtime.value.length == 2 ||
      bookingtime.value.length == 5 ||
      bookingtime.value.length == 8
    ) {
      bookingtime.value = bookingtime.value + ":";
    }
  }
});

defineExpose({ _show });
</script>
