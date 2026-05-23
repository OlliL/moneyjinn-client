<template>
  <img
    v-if="isJpeg"
    :src="`data:image/png;base64,${receipt.receipt}`"
    class="max-w-full h-auto rounded-sm"
    alt="receipt"
  />
  <SpanPdf :receipt-base64="receipt.receipt" v-if="isPdf" />
</template>

<script lang="ts" setup>
import type { MoneyflowReceipt } from "@/model/moneyflow/MoneyflowReceipt";
import { MoneyflowReceiptType } from "@/model/moneyflow/MoneyflowReceiptType";
import { computed, type PropType } from "vue";
import SpanPdf from "./SpanPdf.vue";

const props = defineProps({
  receipt: {
    type: Object as PropType<MoneyflowReceipt>,
    required: true,
  },
});

const isJpeg = computed(
  () => props.receipt.receiptType === MoneyflowReceiptType.JPEG,
);
const isPdf = computed(
  () => props.receipt.receiptType === MoneyflowReceiptType.PDF,
);
</script>
