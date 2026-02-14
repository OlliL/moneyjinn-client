<template>
  <ModalVue
    :title="$t('General.moneyflow')"
    ref="modalComponent"
    :max-width="modalWidth"
    v-if="mmf"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="container-fluid">
        <div class="row">
          <div
            style="overflow-x: scroll; white-space: nowrap; height: 600px"
            class="col-3"
            v-if="receiptBase64"
          >
            <img
              v-if="isJpeg"
              :src="`data:image/png;base64,${receiptBase64}`"
              style="max-width: 100%"
              alt="receipt"
            />
            <object
              style="height: 75vh; width: 100%"
              v-if="isPdf"
              id="pdf"
              :data="`data:application/pdf;base64,${receiptBase64}`"
              type="application/pdf"
            >
              receipt
            </object>
          </div>
          <div class="col">
            <div class="row no-gutters flex-lg-nowrap mb-2">
              <div class="card-body table-responsive text-center">
                <table class="table table-striped table-bordered table-hover">
                  <colgroup>
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" v-if="rowspan == 1" />
                    <col style="width: 6%" v-if="rowspan > 1" />
                    <col style="width: 6%" v-if="rowspan > 1" />
                    <col style="width: 17%" />
                    <col style="width: 19%" />
                    <col style="width: 16%" />
                    <col style="width: 16%" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col">{{ $t("Moneyflow.bookingdate") }}</th>
                      <th scope="col">{{ $t("Moneyflow.invoicedate") }}</th>
                      <th scope="col" :colspan="rowspan > 1 ? 2 : 1">
                        {{ $t("General.amount") }}
                      </th>
                      <th scope="col">{{ $t("General.contractpartner") }}</th>
                      <th scope="col">{{ $t("General.comment") }}</th>
                      <th scope="col">{{ $t("General.postingAccount") }}</th>
                      <th scope="col">{{ $t("General.capitalsource") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="rowspan == 1">
                      <td><SpanDate :date="mmf.bookingDate" /></td>
                      <td><SpanDate :date="mmf.invoiceDate" /></td>
                      <td class="text-end">
                        <SpanAmount :amount="mmf.amount" />
                      </td>
                      <td class="text-start">{{ mmf.contractpartnerName }}</td>
                      <td class="text-start">{{ mmf.comment }}</td>
                      <td class="text-start">{{ mmf.postingAccountName }}</td>
                      <td class="text-start">{{ mmf.capitalsourceComment }}</td>
                    </tr>
                    <tr
                      v-for="(mse, index) in mmf.moneyflowSplitEntries"
                      :key="mse.id"
                    >
                      <td :rowspan="rowspan" v-if="index == 0">
                        <SpanDate :date="mmf.bookingDate" />
                      </td>
                      <td :rowspan="rowspan" v-if="index == 0">
                        <SpanDate :date="mmf.invoiceDate" />
                      </td>
                      <td :rowspan="rowspan" v-if="index == 0" class="text-end">
                        <SpanAmount :amount="mmf.amount" />
                      </td>
                      <td class="text-end">
                        <SpanAmount :amount="mse.amount" />
                      </td>
                      <td
                        :rowspan="rowspan"
                        v-if="index == 0"
                        class="text-start"
                      >
                        {{ mmf.contractpartnerName }}
                      </td>
                      <td class="text-start">{{ mse.comment }}</td>
                      <td class="text-start">{{ mse.postingAccountName }}</td>
                      <td
                        :rowspan="rowspan"
                        v-if="index == 0"
                        class="text-start"
                      >
                        {{ mmf.capitalsourceComment }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ModalVue>
</template>

<style lang="css" scoped>
th,
td {
  font-size: 0.9rem;
}
</style>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref, useTemplateRef } from "vue";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { MoneyflowReceiptType } from "@/model/moneyflow/MoneyflowReceiptType";

import MoneyflowReceiptService from "@/service/MoneyflowReceiptService";
import SpanDate from "../SpanDate.vue";
import SpanAmount from "../SpanAmount.vue";

const serverErrors = ref(new Array<string>());

const mmf = ref({} as Moneyflow);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");

const receiptBase64 = ref("");
const isJpeg = ref(false);
const isPdf = ref(false);

const emit = defineEmits(["moneyflowUpdated", "moneyflowReceiptDeleted"]);

const { handleSubmit, values, setFieldTouched } = useForm();

const modalWidth = computed(() => {
  return receiptBase64.value ? "100%" : "75%";
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

  if (receiptType === MoneyflowReceiptType.JPEG) {
    isJpeg.value = true;
  } else if (receiptType === MoneyflowReceiptType.PDF) {
    isJpeg.value = false;
  }
  isPdf.value = !isJpeg.value;
};
defineExpose({ _show });
</script>
