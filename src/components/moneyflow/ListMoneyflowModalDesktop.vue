<template>
  <ModalVue
    :title="$t('General.moneyflow')"
    id-suffix="ListMoneyflowDesktop"
    :max-width="modalWidth"
    v-if="mmf"
    v-model:open="open"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="w-full">
        <div class="flex gap-4">
          <div
            class="w-1/3 overflow-x-scroll whitespace-nowrap h-[600px] max-w-120"
            v-if="receipt.receipt"
          >
            <SpanReceipt :receipt="receipt" />
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { MoneyflowReceipt } from "@/model/moneyflow/MoneyflowReceipt";
import { mapImportedMoneyflowReceiptToMoneyflowReceipt } from "@/service/mapper/ImportedToMoneyflowReceiptMapper";
import MoneyflowReceiptService from "@/service/MoneyflowReceiptService";
import useListMoneyflowModalStore from "./ListMoneyflowModal.store";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { storeToRefs } from "pinia";
import { computed, ref, toRaw, watch } from "vue";
import DivError from "../common/DivError.vue";
import ModalVue from "../common/Modal.vue";
import SpanAmount from "../common/SpanAmount.vue";
import SpanDate from "../common/SpanDate.vue";
import SpanReceipt from "../common/SpanReceipt.vue";

const serverErrors = ref(new Array<string>());
const mmf = ref({} as Moneyflow);
const receipt = ref({} as MoneyflowReceipt);
const { open, moneyflow, importedReceipt } = storeToRefs(
  useListMoneyflowModalStore(),
);

const modalWidth = computed(() => {
  return receipt.value.receipt
    ? "md:max-w-full w-full mx-auto"
    : "md:max-w-2xl lg:max-w-7xl w-full mx-auto";
});

const rowspan = computed(() => {
  if (
    mmf.value.moneyflowSplitEntries != null &&
    mmf.value.moneyflowSplitEntries.length > 0
  ) {
    return mmf.value.moneyflowSplitEntries.length;
  }
  return 1;
});

watch(
  [open, moneyflow, importedReceipt],
  ([isVisible, entry, importedReceipt]) => {
    if (!isVisible || !entry) return;

    mmf.value = structuredClone(toRaw(entry));
    receipt.value = {} as MoneyflowReceipt;
    if (mmf.value.hasReceipt) loadReceipt(mmf.value.id);
    else if (importedReceipt) {
      receipt.value =
        mapImportedMoneyflowReceiptToMoneyflowReceipt(importedReceipt);
    }
    serverErrors.value = new Array<string>();
  },
  { immediate: true },
);

const loadReceipt = (id: number) => {
  MoneyflowReceiptService.fetchReceipt(id)
    .then((response) => (receipt.value = response))
    .catch((backendError) => handleBackendError(backendError, serverErrors));
};
</script>
