<template>
  <TableRow>
    <TableCell
      :class="[redIfPrivate, rowBgClass, 'border-r']"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow"
    >
      <Button
        v-if="mmf.hasReceipt"
        variant="ghost"
        size="icon"
        :data-testid="`search-moneyflow-receipt-${mmf.id}`"
        @click="showReceipt"
        :title="$t('Receipt.receipt')"
        :aria-label="$t('Receipt.receipt')"
        class="h-6 w-6"
      >
        <Image class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      :class="[rowBgClass, 'border-r']"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow"
    >
      <SpanDate :date="mmf.bookingDate" />
    </TableCell>
    <TableCell :class="['text-right border-r', rowBgClass]"
      ><SpanAmount :amount="mmf.amount"
    /></TableCell>
    <TableCell
      :class="['text-left border-r', rowBgClass]"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow"
    >
      {{ mmf.contractpartnerName }}
    </TableCell>
    <TableCell :class="['text-left border-r', rowBgClass]">{{
      mmf.comment
    }}</TableCell>
    <TableCell :class="['text-left border-r', rowBgClass]">{{
      mmf.postingAccountName
    }}</TableCell>
    <TableCell
      :class="['text-left border-r', rowBgClass]"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow"
    >
      {{ mmf.capitalsourceComment }}
    </TableCell>
    <TableCell
      :class="['w-8 h-8 text-center border-r', rowBgClass]"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow && isOwnMoneyflow"
    >
      <Button
        variant="ghost"
        size="icon"
        :data-testid="`search-moneyflow-edit-${mmf.id}`"
        @click="editMoneyflow"
        :title="$t('General.edit')"
        :aria-label="$t('General.edit')"
        class="h-6 w-6"
      >
        <Pencil class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      :class="['w-8 h-8 text-center', rowBgClass]"
      :title="$t('General.edit')"
      :aria-label="$t('General.edit')"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow && isOwnMoneyflow"
    >
      <Button
        variant="ghost"
        size="icon"
        :data-testid="`search-moneyflow-delete-${mmf.id}`"
        @click="deleteMoneyflow"
        :title="$t('General.delete')"
        :aria-label="$t('General.delete')"
        class="h-6 w-6"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      :class="['w-8 h-8 text-center', rowBgClass]"
      :title="$t('General.delete')"
      :aria-label="$t('General.delete')"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow && !isOwnMoneyflow"
    >
      <Button
        variant="ghost"
        size="icon"
        :data-testid="`search-moneyflow-list-${mmf.id}`"
        @click="listMoneyflow"
        :title="$t('General.moneyflow')"
        :aria-label="$t('General.moneyflow')"
        class="h-6 w-6"
      >
        <Eye class="h-4 w-4" />
      </Button>
    </TableCell>
  </TableRow>
</template>
<script lang="ts" setup>
import { Eye, Image, Pencil, Trash2 } from "lucide-vue-next";
import { computed, type PropType } from "vue";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

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
  alternateRowBackground: {
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
const rowBgClass = computed(() => {
  return props.alternateRowBackground ? "bg-muted" : "bg-background";
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
