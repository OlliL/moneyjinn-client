<template>
  <TableRow>
    <TableCell
      :class="redIfPrivate"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow"
    >
      <Button
        v-if="mmf.hasReceipt"
        variant="ghost"
        size="icon"
        @click="showReceipt"
        :title="$t('Moneyflow.showReceipt')"
        :aria-label="$t('Moneyflow.showReceipt')"
        class="h-6 w-6"
      >
        <Image class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell :rowspan="rowspan" v-if="isFirstOfMultipleRowsForSameMoneyflow">
      <SpanDate :date="mmf.bookingDate" />
    </TableCell>
        :title="$t('Receipt.receipt')"
        :aria-label="$t('Receipt.receipt')"
    <TableCell class="text-right"><SpanAmount :amount="mmf.amount" /></TableCell>
    <TableCell
      class="text-left"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow"
    >
      {{ mmf.contractpartnerName }}
    </TableCell>
    <TableCell class="text-left">{{ mmf.comment }}</TableCell>
    <TableCell class="text-left">{{ mmf.postingAccountName }}</TableCell>
    <TableCell
      class="text-left"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow"
    >
      {{ mmf.capitalsourceComment }}
    </TableCell>
    <TableCell
      class="text-center"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow && isOwnMoneyflow"
    >
      <Button
        variant="ghost"
        size="icon"
        @click="editMoneyflow"
        :title="$t('General.edit')"
        :aria-label="$t('General.edit')"
        class="h-6 w-6"
      >
        <Pencil class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      class="text-center"
        :title="$t('General.edit')"
        :aria-label="$t('General.edit')"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow && isOwnMoneyflow"
    >
      <Button
        variant="ghost"
        size="icon"
        @click="deleteMoneyflow"
        :title="$t('General.delete')"
        :aria-label="$t('General.delete')"
        class="h-6 w-6"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      class="text-center"
        :title="$t('General.delete')"
        :aria-label="$t('General.delete')"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow && !isOwnMoneyflow"
    >
      <Button
        variant="ghost"
        size="icon"
        @click="listMoneyflow"
        :title="$t('General.list')"
        :aria-label="$t('General.list')"
        class="h-6 w-6"
      >
        <Eye class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      :rowspan="rowspan"
        :title="$t('General.moneyflow')"
        :aria-label="$t('General.moneyflow')"
      v-if="isFirstOfMultipleRowsForSameMoneyflow && !isOwnMoneyflow"
    ></TableCell>
  </TableRow>
</template>
<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { Image, Pencil, Trash2, Eye } from "lucide-vue-next";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";

import { useUserSessionStore } from "@/stores/UserSessionStore";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

const props = defineProps({
  mmf: {
    type: Object as PropType<Moneyflow>,
    required: true,
  },
  rowspan: {
    type: Number,
    default: 1,
  },
  isFirstOfMultipleRowsForSameMoneyflow: {
    type: Boolean,
    default: false,
  },
});
const userSessionStore = useUserSessionStore();
const emit = defineEmits([
  "showReceipt",
  "deleteMoneyflow",
  "editMoneyflow",
  "listMoneyflow",
]);
const redIfPrivate = computed(() => {
  return props.mmf.private
    ? "bg-destructive/10 hidden md:table-cell"
    : "hidden md:table-cell";
});

const isOwnMoneyflow = computed(() => {
  return props.mmf.userId === userSessionStore.getUserId;
});
const showReceipt = () => {
  emit("showReceipt", props.mmf.id);
};
const deleteMoneyflow = () => {
  emit("deleteMoneyflow", props.mmf.id);
};
const editMoneyflow = () => {
  emit("editMoneyflow", props.mmf.id);
};
const listMoneyflow = () => {
  emit("listMoneyflow", props.mmf.id);
};
</script>
