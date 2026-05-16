<template>
  <div class="flex justify-center mb-6">
    <div class="w-full max-w-6xl">
      <div
        class="w-full rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden"
      >
        <div class="grid grid-cols-1 lg:grid-cols-5 min-h-full">
          <div
            class="lg:col-span-2 bg-muted/40 p-5 border-b lg:border-b-0 lg:border-r border-border/60 flex flex-col justify-center items-center"
          >
            <div
              class="bg-background/60 p-2 rounded border border-border/40 backdrop-blur-sm w-full flex justify-center items-start h-[calc(100vh-420px)] max-h-[520px]"
              :class="isPdf ? 'overflow-hidden' : 'overflow-y-auto'"
            >
              <img
                v-if="isJpeg"
                :src="`data:image/png;base64,${receipt.receipt}`"
                class="max-w-full h-auto rounded-sm shadow-sm"
                alt="receipt"
              />

              <object
                class="h-full w-full min-h-[320px] block rounded-sm shadow-inner"
                v-if="isPdf"
                id="pdf"
                :data="`data:application/pdf;base64,${receipt.receipt}`"
                type="application/pdf"
              >
                receipt
              </object>
            </div>
          </div>

          <div
            class="lg:col-span-3 p-6 space-y-6 flex flex-col justify-between"
          >
            <div>
              <DivError :server-errors="serverErrors" />

              <form
                @submit.prevent="searchMoneyflows"
                :id="'searchReceipt' + receipt.id"
              >
                <div class="flex flex-wrap items-end gap-3 mb-6">
                  <div class="flex-1 min-w-[180px]">
                    <InputStandard
                      v-model="amount"
                      :validation-schema="schema.amount"
                      id="amount"
                      field-type="number"
                      step="0.01"
                      :field-label="$t('General.amount')"
                    >
                      <template #icon><Euro class="h-4 w-4" /></template>
                    </InputStandard>
                  </div>
                  <div class="flex-1 min-w-[140px]">
                    <InputDate
                      v-model="startDate"
                      :validation-schema="schema.startDate"
                      id="startDate"
                      :field-label="$t('General.startDate')"
                    />
                  </div>
                  <div class="flex-1 min-w-[140px]">
                    <InputDate
                      v-model="endDate"
                      :validation-schema="schema.endDate"
                      id="endDate"
                      :field-label="$t('General.endDate')"
                    />
                  </div>
                  <div class="shrink-0">
                    <ButtonSubmit
                      :form-id="'searchReceipt' + receipt.id"
                      class="h-10"
                    >
                      <template #icon><Search class="h-4 w-4" /></template>
                    </ButtonSubmit>
                  </div>
                </div>
              </form>

              <div class="w-full">
                <div
                  class="flex flex-col rounded-md border overflow-hidden shadow-sm"
                  v-if="searchExecuted && searchSuccessful"
                >
                  <Table>
                    <TableHeader class="bg-muted/30">
                      <TableRow>
                        <TableHead class="w-10">
                          <span class="sr-only">Selection</span>
                        </TableHead>
                        <TableHead
                          class="font-bold border-r text-foreground text-center px-3 py-2 text-xs"
                        >
                          {{ $t("Moneyflow.invoicedate") }}
                        </TableHead>
                        <TableHead
                          class="font-bold border-r text-foreground text-center px-3 py-2 text-xs"
                        >
                          {{ $t("General.amount") }}
                        </TableHead>
                        <TableHead
                          class="font-bold border-r text-foreground text-center px-3 py-2 text-xs"
                        >
                          {{ $t("General.contractpartner") }}
                        </TableHead>
                        <TableHead
                          class="font-bold text-foreground text-center px-3 py-2 text-xs"
                        >
                          {{ $t("General.comment") }}
                        </TableHead>
                        <TableHead class="w-16" colspan="2"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
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
                    </TableBody>
                  </Table>
                </div>

                <div
                  v-if="searchExecuted && !searchSuccessful"
                  class="text-sm text-center py-6 text-muted-foreground border border-dashed rounded-lg bg-muted/10"
                >
                  {{ $t("Moneyflow.noMatchingMoneyflow") }}
                </div>
              </div>
            </div>

            <div
              class="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border/40"
            >
              <Button
                type="button"
                variant="destructive"
                class="flex items-center gap-2 px-6"
                @click="deleteReceipt"
              >
                <Trash2 class="h-4 w-4" />
                {{ $t("General.delete") }}
              </Button>
              <Button
                type="button"
                variant="default"
                class="flex items-center gap-2 px-6"
                @click="importReceipt"
                v-if="searchExecuted && searchSuccessful"
                :disabled="!moneyflowSelected"
              >
                <Save class="h-4 w-4" />
                {{ $t("Moneyflow.apply") }}
              </Button>
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
import { Euro, Save, Search, Trash2 } from "lucide-vue-next";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import ImportReceiptSearchRowVue from "./ImportReceiptSearchRow.vue";
import InputStandard from "../InputStandard.vue";
import InputDate from "../InputDate.vue";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { amountSchema, globErr } from "@/tools/views/ZodUtil";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { toFixed } from "@/tools/math";

import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

import ImportedMoneyflowReceiptService from "@/service/ImportedMoneyflowReceiptService";
import MoneyflowService from "@/service/MoneyflowService";

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
  MoneyflowService.searchMoneyflowsByAmount(
    amount.value,
    startDate.value,
    endDate.value,
  )
    .then((_moneyflows) => {
      moneyflows.value = _moneyflows;
      searchExecuted.value = true;
      searchSuccessful.value = moneyflows.value.length > 0;
      if (moneyflows.value.length === 1 && moneyflows.value[0]) {
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
  if (!Number.isNaN(Number(amountFromFilename))) {
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

  ImportedMoneyflowReceiptService.importImportedMoneyflowReceipt(
    props.receipt.id,
    selectedMoneyflowId.value,
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

  ImportedMoneyflowReceiptService.deleteImportedMoneyflowReceiptById(
    props.receipt.id,
  )
    .then(() => {
      emit("removeReceiptFromView", props.receipt.id);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
