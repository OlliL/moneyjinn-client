<template>
  <img
    v-if="isJpeg"
    :src="`data:image/png;base64,${receipt.receipt}`"
    class="max-w-full h-auto rounded-sm"
    alt="receipt"
  />
  <span-pdf :receipt-base64="receipt.receipt" v-if="isPdf" />
</template>

<script lang="ts" setup>
import type { MoneyflowReceipt } from "@/model/moneyflow/MoneyflowReceipt";
import { MoneyflowReceiptType } from "@/model/moneyflow/MoneyflowReceiptType";
import { computed, defineAsyncComponent } from "vue";

const spanPdf = defineAsyncComponent(() => import("./SpanPdf.vue"));
const props = defineProps<{
  receipt: MoneyflowReceipt;
}>();

const isJpeg = computed(
  () => props.receipt.receiptType === MoneyflowReceiptType.JPEG,
);
const isPdf = computed(
  () => props.receipt.receiptType === MoneyflowReceiptType.PDF,
);
</script>
