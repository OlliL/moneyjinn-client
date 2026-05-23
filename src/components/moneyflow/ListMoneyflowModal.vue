<template>
  <ModalVue
    :title="$t('General.moneyflow')"
    ref="modalComponent"
    :max-width="modalWidth"
    v-if="mmf"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="w-full">
        <div class="flex gap-4">
          <div
            class="w-1/3 overflow-x-scroll whitespace-nowrap h-[600px] max-w-120"
            v-if="receiptBase64"
          >
            <img
              v-if="isJpeg"
              :src="`data:image/png;base64,${receiptBase64}`"
              class="max-w-full"
              alt="receipt"
            />
            <object
              class="h-[75vh] w-full"
              v-if="isPdf"
              id="pdf"
              :data="`data:application/pdf;base64,${receiptBase64}`"
              type="application/pdf"
            >
              receipt
            </object>
          </div>
          <div class="flex-1">
            <div class="flex flex-col rounded-md border">
              <div class="overflow-x-auto text-center">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead class="table-head-cell">{{
                        $t("Moneyflow.bookingdate")
                      }}</TableHead>
                      <TableHead class="table-head-cell">{{
                        $t("Moneyflow.invoicedate")
                      }}</TableHead>
                      <TableHead
                        class="table-head-cell"
                        :colspan="rowspan > 1 ? 2 : 1"
                      >
                        {{ $t("General.amount") }}
                      </TableHead>
                      <TableHead class="table-head-cell">{{
                        $t("General.contractpartner")
                      }}</TableHead>
                      <TableHead class="table-head-cell">{{
                        $t("General.comment")
                      }}</TableHead>
                      <TableHead class="table-head-cell">{{
                        $t("General.postingAccount")
                      }}</TableHead>
                      <TableHead class="table-head-cell">{{
                        $t("General.capitalsource")
                      }}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-if="rowspan == 1">
                      <TableCell
                        ><SpanDate :date="mmf.bookingDate"
                      /></TableCell>
                      <TableCell
                        ><SpanDate :date="mmf.invoiceDate"
                      /></TableCell>
                      <TableCell class="text-right">
                        <SpanAmount :amount="mmf.amount" />
                      </TableCell>
                      <TableCell class="text-left">{{
                        mmf.contractpartnerName
                      }}</TableCell>
                      <TableCell class="text-left">{{ mmf.comment }}</TableCell>
                      <TableCell class="text-left">{{
                        mmf.postingAccountName
                      }}</TableCell>
                      <TableCell class="text-left">{{
                        mmf.capitalsourceComment
                      }}</TableCell>
                    </TableRow>
                    <TableRow
                      v-for="(mse, index) in mmf.moneyflowSplitEntries"
                      :key="mse.id"
                    >
                      <TableCell :rowspan="rowspan" v-if="index == 0">
                        <SpanDate :date="mmf.bookingDate" />
                      </TableCell>
                      <TableCell :rowspan="rowspan" v-if="index == 0">
                        <SpanDate :date="mmf.invoiceDate" />
                      </TableCell>
                      <TableCell
                        :rowspan="rowspan"
                        v-if="index == 0"
                        class="text-right"
                      >
                        <SpanAmount :amount="mmf.amount" />
                      </TableCell>
                      <TableCell class="text-right">
                        <SpanAmount :amount="mse.amount" />
                      </TableCell>
                      <TableCell
                        :rowspan="rowspan"
                        v-if="index == 0"
                        class="text-left"
                      >
                        {{ mmf.contractpartnerName }}
                      </TableCell>
                      <TableCell class="text-left">{{ mse.comment }}</TableCell>
                      <TableCell class="text-left">{{
                        mse.postingAccountName
                      }}</TableCell>
                      <TableCell
                        :rowspan="rowspan"
                        v-if="index == 0"
                        class="text-left"
                      >
                        {{ mmf.capitalsourceComment }}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref, useTemplateRef } from "vue";

import DivError from "../common/DivError.vue";
import ModalVue from "../common/Modal.vue";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { MoneyflowReceiptType } from "@/model/moneyflow/MoneyflowReceiptType";

import MoneyflowReceiptService from "@/service/MoneyflowReceiptService";
import SpanAmount from "../common/SpanAmount.vue";
import SpanDate from "../common/SpanDate.vue";

const serverErrors = ref(new Array<string>());

const mmf = ref({} as Moneyflow);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");

const receiptBase64 = ref("");
const isJpeg = ref(false);
const isPdf = ref(false);

const emit = defineEmits(["moneyflowUpdated", "moneyflowReceiptDeleted"]);

const { handleSubmit, values, setFieldTouched } = useForm();

const modalWidth = computed(() => {
  return receiptBase64.value
    ? "md:max-w-full w-full mx-auto"
    : "md:max-w-2xl lg:max-w-7xl w-full mx-auto";
});

const rowspan = computed(() => {
  if (mmf.value.moneyflowSplitEntries != null) {
    return mmf.value.moneyflowSplitEntries.length;
  }
  return 1;
});

const _show = (_mmf: Moneyflow) => {
  mmf.value = _mmf;

  receiptBase64.value = "";
  isJpeg.value = false;
  isPdf.value = false;

  if (mmf.value.hasReceipt) loadReceipt(mmf.value.id);

  modalComponent.value?._show();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const loadReceipt = (id: number) => {
  MoneyflowReceiptService.fetchReceipt(id).then((response) => {
    processReceipt(response.receiptType, response.receipt);
  });
};

const processReceipt = (receiptType: MoneyflowReceiptType, receipt: string) => {
  receiptBase64.value = receipt;
  isJpeg.value = receiptType === MoneyflowReceiptType.JPEG;
  isPdf.value = receiptType === MoneyflowReceiptType.PDF;
};
defineExpose({ _show });
</script>
