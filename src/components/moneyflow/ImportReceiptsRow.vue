<template>
  <div class="row justify-content-md-center mb-4">
    <div class="col-md-9 col-xs-12">
      <div class="card w-100 bg-light">
        <div class="card-body">
          <DivError :server-errors="serverErrors" />
          <div class="row">
            <div
              style="overflow-x: scroll; white-space: nowrap; height: 400px"
              class="col-md-3 col-xs-12"
            >
              <img
                v-if="isJpeg"
                :src="`data:image/png;base64,${receipt.receipt}`"
                style="max-width: 100%"
              />
              <object
                style="height: 75vh; width: 100%"
                v-if="isPdf"
                id="pdf"
                :data="`data:application/pdf;base64,${receipt.receipt}`"
                type="application/pdf"
              ></object>
            </div>
            <div class="col-md-9 col-xs-12">
              <form
                @submit.prevent="searchMoneyflows"
                :id="'searchReceipt' + receipt.id"
              >
                <div
                  class="row no-gutters flex-lg-nowrap mb-4 justify-content-center"
                >
                  <div
                    class="col-md-1 col-xs-6 d-flex align-items-center justify-content-end"
                  >
                    <ButtonSubmit :form-id="'searchReceipt' + receipt.id">
                      <template #icon
                        ><i class="bi bi-search"></i>&nbsp;
                      </template></ButtonSubmit
                    >
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <InputStandard
                      v-model="amount"
                      :validation-schema="schema.amount"
                      id="amount"
                      field-type="number"
                      step="0.01"
                      :field-label="$t('General.amount')"
                    >
                      <template #icon
                        ><span class="input-group-text"
                          ><i class="bi bi-currency-euro"></i></span
                      ></template>
                    </InputStandard>
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <InputDate
                      v-model="startDate"
                      :validation-schema="schema.startDate"
                      id="startDate"
                      :field-label="$t('General.startDate')"
                    />
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <InputDate
                      v-model="endDate"
                      :validation-schema="schema.endDate"
                      id="endDate"
                      :field-label="$t('General.endDate')"
                    />
                  </div>
                </div>
              </form>
              <div
                class="row no-gutters flex-lg-nowrap mb-4 justify-content-center"
              >
                <div class="col-xs-12">
                  <table
                    class="table table-striped table-bordered table-hover"
                    v-if="searchExecuted && searchSuccessful"
                  >
                    <thead>
                      <tr>
                        <th></th>
                        <th>{{ $t("Moneyflow.invoicedate") }}</th>
                        <th>{{ $t("General.amount") }}</th>
                        <th>{{ $t("General.contractpartner") }}</th>
                        <th>{{ $t("General.comment") }}</th>
                        <th colspan="2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <ImportReceiptSearchRowVue
                        v-for="moneyflow in moneyflows"
                        v-model="selectedMoneyflowId"
                        :key="moneyflow.id"
                        :mmf="moneyflow"
                        :preselected="preselected"
                        :receipt-id="receipt.id"
                        @delete-moneyflow="emitDeleteMoneyflow"
                        @edit-moneyflow="emitEditMoneyflow"
                      />
                    </tbody>
                  </table>
                  <div v-if="searchExecuted && !searchSuccessful">
                    {{ $t("Moneyflow.noMatchingMoneyflow") }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row no-gutters flex-lg-nowrap">
            <div class="col-12">
              <button
                type="button"
                class="btn btn-primary mx-2"
                @click="importReceipt"
                v-if="searchExecuted && searchSuccessful"
                :disabled="!moneyflowSelected"
              >
                {{ $t("Moneyflow.apply") }}
              </button>
              <button
                type="button"
                class="btn btn-danger mx-2"
                @click="deleteReceipt"
              >
                {{ $t("General.delete") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, nextTick, onMounted, ref, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import { date } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import ImportReceiptSearchRowVue from "./ImportReceiptSearchRow.vue";
import InputStandard from "../InputStandard.vue";
import InputDate from "../InputDate.vue";

import { amountSchema, globErr } from "@/tools/views/ZodUtil";
import { handleBackendError } from "@/tools/views/ThrowError";
import { toFixed } from "@/tools/math";

import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

import ImportedMoneyflowReceiptControllerHandler from "@/handler/ImportedMoneyflowReceiptControllerHandler";
import MoneyflowControllerHandler from "@/handler/MoneyflowControllerHandler";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

const schema = {
  amount: amountSchema(t("Moneyflow.validation.amount")),
  startDate: date(globErr(t("General.validation.startDate"))),
  endDate: date(globErr(t("General.validation.endDate"))),
};

const startDate = ref(new Date());
const endDate = ref(new Date());
const amount = ref(0);
const moneyflows = ref({} as Array<Moneyflow>);
const searchExecuted = ref(false);
const searchSuccessful = ref(false);
const selectedMoneyflowId = ref(0);
const preselected = ref(false);
const emit = defineEmits([
  "deleteMoneyflow",
  "editMoneyflow",
  "removeReceiptFromView",
]);

const props = defineProps({
  receipt: {
    type: Object as PropType<ImportedMoneyflowReceipt>,
    required: true,
  },
});

const { handleSubmit } = useForm();

const emitDeleteMoneyflow = (id: number) => {
  emit("deleteMoneyflow", id);
};
const emitEditMoneyflow = (id: number) => {
  emit("editMoneyflow", id, props.receipt);
};

const searchMoneyflows = handleSubmit(() => {
  serverErrors.value = new Array<string>();
  searchExecuted.value = false;
  MoneyflowControllerHandler.searchMoneyflowsByAmount(
    amount.value,
    startDate.value,
    endDate.value
  )
    .then((_moneyflows) => {
      moneyflows.value = _moneyflows;
      searchExecuted.value = true;
      searchSuccessful.value = moneyflows.value.length > 0;
      if (moneyflows.value.length === 1) {
        preselected.value = true;
        selectedMoneyflowId.value = moneyflows.value[0].id;
      } else {
        selectedMoneyflowId.value = 0;
      }
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});

onMounted(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMinus30 = new Date();
  todayMinus30.setHours(0, 0, 0, 0);
  todayMinus30.setDate(todayMinus30.getDate() - 30);

  startDate.value = todayMinus30;
  endDate.value = today;

  const posOfDot = props.receipt.filename.indexOf(".");
  const amountFromFilename = props.receipt.filename.substring(0, posOfDot);
  if (!isNaN(Number(amountFromFilename))) {
    amount.value = toFixed(+amountFromFilename / 100, 2);
    nextTick(() => {
      searchMoneyflows();
    });
  }
});

const isJpeg = computed(() => {
  return props.receipt.mediaType === "image/jpeg";
});
const isPdf = computed(() => {
  return props.receipt.mediaType === "application/pdf";
});
const moneyflowSelected = computed(() => {
  return selectedMoneyflowId.value > 0;
});

const importReceipt = () => {
  serverErrors.value = new Array<string>();

  ImportedMoneyflowReceiptControllerHandler.importImportedMoneyflowReceipt(
    props.receipt.id,
    selectedMoneyflowId.value
  )
    .then(() => {
      emit("removeReceiptFromView", props.receipt.id);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

const deleteReceipt = () => {
  serverErrors.value = new Array<string>();

  ImportedMoneyflowReceiptControllerHandler.deleteImportedMoneyflowReceiptById(
    props.receipt.id
  )
    .then(() => {
      emit("removeReceiptFromView", props.receipt.id);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
