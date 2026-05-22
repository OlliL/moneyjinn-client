<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body>
      <form @submit.prevent="createEtfFlow" id="createEtfFlowForm">
        <div class="space-y-4">
          <DivError :server-errors="serverErrors" />

          <div class="form-section space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <SelectStandard
                  v-model="defaultEtfId"
                  :validation-schema="schema.etfId"
                  id="etf"
                  :field-label="$t('General.etf')"
                  :select-box-values="etfs"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <InputDate
                  v-model="bookingdate"
                  :validation-schema="schema.timestamp"
                  id="bookingdate"
                  :field-label="$t('ETFFlow.bookingdate')"
                />
              </div>
              <div>
                <InputStandard
                  v-model="bookingtime"
                  :validation-schema="schema.nanoseconds"
                  id="bookingtime"
                  :field-label="$t('ETFFlow.bookingtime')"
                  :focus="true"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <InputStandard
                  v-model="etfFlow.amount"
                  :validation-schema="schema.amount"
                  id="amount"
                  field-type="number"
                  step="0.000001"
                  :field-label="$t('ETFFlow.amount')"
                />
              </div>
              <div>
                <InputStandard
                  v-model="etfFlow.price"
                  :validation-schema="schema.price"
                  id="price"
                  step="0.001"
                  field-type="number"
                  :field-label="$t('ETFFlow.price')"
                >
                  <template #icon><Euro class="h-4 w-4" /></template>
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
        class="button-with-icon"
        @click="resetForm"
      >
        <Undo2 class="h-4 w-4" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        form-id="createEtfFlowForm"
      >
        <template #icon><Save class="h-4 w-4" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import DivError from "@/components/common/DivError.vue";
import InputDate from "@/components/common/InputDate.vue";
import InputStandard from "@/components/common/InputStandard.vue";
import ModalVue from "@/components/common/Modal.vue";
import SelectStandard from "@/components/common/SelectStandard.vue";
import { Button } from "@/components/ui/button";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import CrudEtfFlowService from "@/service/CrudEtfFlowService";
import { useEtfStore } from "@/stores/EtfStore";
import { formatTime } from "@/tools/views/FormatDate";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { amountSchema, globErr } from "@/tools/views/ZodUtil";
import { Euro, Save, Undo2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { computed, ref, toRaw, useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { date, number, string, type ZodType } from "zod";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());
const defaultEtfId = ref(0);

const schema: Partial<{ [key in keyof EtfFlow]: ZodType }> = {
  etfId: number(globErr(t("ETFFlow.validation.etfId"))).gt(0),
  timestamp: date(globErr(t("ETFFlow.validation.timestamp"))),
  nanoseconds: string(globErr(t("ETFFlow.validation.nanoseconds"))).regex(
    /^\d\d:\d\d:\d\d:\d{3}$/,
  ),
  amount: amountSchema(t("ETFFlow.validation.amount"), 6),
  price: amountSchema(t("ETFFlow.validation.price"), 3),
};

const etfs = ref(new Array<SelectBoxValue>());
const etfFlow = ref({} as EtfFlow);
const origEtfFlow = ref({} as EtfFlow | undefined);
const bookingdate = ref(new Date());
const bookingtime = ref("");
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["etfFlowCreated", "etfFlowUpdated"]);

const etfStore = useEtfStore();

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return etfFlow.value?.etfflowid > 0
    ? t("ETFFlow.title.update")
    : t("ETFFlow.title.create");
});

const resetForm = () => {
  if (origEtfFlow.value) {
    etfFlow.value = structuredClone(toRaw(origEtfFlow.value))!;
    bookingdate.value = new Date(origEtfFlow.value.timestamp);
    bookingdate.value.setHours(0, 0, 0, 0);

    bookingtime.value =
      formatTime(origEtfFlow.value.timestamp) +
      ":" +
      String(origEtfFlow.value.nanoseconds + 1000000000).substring(1, 4);
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

const _show = (_etfFlow?: EtfFlow, _etfId?: number) => {
  etfs.value = etfStore.getAsSelectBoxValues();
  if (_etfFlow) {
    origEtfFlow.value = _etfFlow;
    defaultEtfId.value = _etfFlow.etfId;
  } else {
    origEtfFlow.value = undefined;
    defaultEtfId.value = _etfId ?? 0;
  }
  resetForm();
  modalComponent.value?._show();
};

const createEtfFlow = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  const times: Array<string> = bookingtime.value.split(":");
  const bookingDate = bookingdate.value;
  if (times[0] && times[1] && times[2] && times[3] && bookingDate) {
    etfFlow.value.timestamp = bookingDate;
    etfFlow.value.timestamp.setHours(+times[0], +times[1], +times[2], 0);
    etfFlow.value.nanoseconds = +times[3] * 1000000;
    etfFlow.value.etfId = defaultEtfId.value;

    if (etfFlow.value.etfflowid > 0) {
      CrudEtfFlowService.updateEtfFlow(etfFlow.value)
        .then(() => {
          modalComponent.value?._hide();
          emit("etfFlowUpdated", etfFlow.value);
        })
        .catch((backendError) => {
          handleBackendError(backendError, serverErrors);
        });
    } else {
      CrudEtfFlowService.createEtfFlow(etfFlow.value)
        .then((_etfFlow) => {
          etfFlow.value = _etfFlow;
          modalComponent.value?._hide();
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
