<template>
  <TableRow
    v-if="
      mmf.moneyflowSplitEntries == null || mmf.moneyflowSplitEntries.length == 0
    "
  >
    <TableCell :class="redIfPrivate">
      <Button
        v-if="mmf.hasReceipt"
        variant="ghost"
        size="icon"
        @click="showReceipt"
        :title="$t('Receipt.receipt')"
        :aria-label="$t('Receipt.receipt')"
        class="h-6 w-6"
      >
        <Image class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell><SpanDate :date="mmf.bookingDate" /></TableCell>
    <TableCell class="hidden md:table-cell"><SpanDate :date="mmf.invoiceDate" /></TableCell>
    <TableCell class="text-right"></TableCell>
    <TableCell class="text-right">
      <SpanAmount :amount="mmf.amount" />
    </TableCell>
    <TableCell class="text-left hidden md:table-cell">
      {{ mmf.contractpartnerName }}
    </TableCell>
    <TableCell class="text-left">{{ mmf.comment }}</TableCell>
    <TableCell class="text-left hidden md:table-cell">
      {{ mmf.postingAccountName }}
    </TableCell>
    <TableCell class="text-left hidden md:table-cell">
      {{ mmf.capitalsourceComment }}
    </TableCell>
    <TableCell class="text-center" v-if="isOwnMoneyflow">
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
    <TableCell class="text-center" v-if="isOwnMoneyflow">
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
    <TableCell class="text-center" v-if="!isOwnMoneyflow">
      <Button
        variant="ghost"
        size="icon"
        @click="listMoneyflow"
        :title="$t('General.moneyflow')"
        :aria-label="$t('General.moneyflow')"
        class="h-6 w-6"
      >
        <Eye class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell v-if="!isOwnMoneyflow"></TableCell>
  </TableRow>
  <TableRow v-for="(mse, index) in mmf.moneyflowSplitEntries" :key="mse.id">
    <TableCell :rowspan="rowspan" v-if="index == 0" :class="redIfPrivate">
      <Button
        v-if="mmf.hasReceipt"
        variant="ghost"
        size="icon"
        @click="showReceipt"
        :title="$t('Receipt.receipt')"
        :aria-label="$t('Receipt.receipt')"
        class="h-6 w-6"
      >
        <Image class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell :rowspan="rowspan" v-if="index == 0">
      <SpanDate :date="mmf.bookingDate" />
    </TableCell>
    <TableCell :rowspan="rowspan" v-if="index == 0" class="hidden md:table-cell">
      <SpanDate :date="mmf.invoiceDate" />
    </TableCell>
    <TableCell :rowspan="rowspan" v-if="index == 0" class="text-right">
      <SpanAmount :amount="mmf.amount" />
    </TableCell>
    <TableCell class="text-right">
      <SpanAmount :amount="mse.amount" />
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0"
      class="text-left hidden md:table-cell"
    >
      {{ mmf.contractpartnerName }}
    </TableCell>
    <TableCell class="text-left">{{ mse.comment }}</TableCell>
    <TableCell class="text-left hidden md:table-cell">
      {{ mse.postingAccountName }}
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0"
      class="text-left hidden md:table-cell"
    >
      {{ mmf.capitalsourceComment }}
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0 && isOwnMoneyflow"
      class="text-center"
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
      :rowspan="rowspan"
      v-if="index == 0 && isOwnMoneyflow"
      class="text-center"
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
      :rowspan="rowspan"
      v-if="index == 0 && !isOwnMoneyflow"
      class="text-center"
    >
      <Button
        variant="ghost"
        size="icon"
        @click="listMoneyflow"
        :title="$t('General.moneyflow')"
        :aria-label="$t('General.moneyflow')"
        class="h-6 w-6"
      >
        <Eye class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell :rowspan="rowspan" v-if="index == 0 && !isOwnMoneyflow"></TableCell>
  </TableRow>
</template>
<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { Image, Pencil, Trash2, Eye } from "lucide-vue-next";

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
});

const emit = defineEmits([
  "showReceipt",
  "deleteMoneyflow",
  "editMoneyflow",
  "listMoneyflow",
]);

const rowspan = computed(() => {
  if (props.mmf.moneyflowSplitEntries != null) {
    return props.mmf.moneyflowSplitEntries.length;
  }
  return 1;
});
const isOwnMoneyflow = computed(() => {
  const userSessionStore = useUserSessionStore();
  return props.mmf.userId === userSessionStore.getUserId;
});

const redIfPrivate = computed(() => {
  return props.mmf.private ? "bg-destructive/10 hidden md:table-cell" : "hidden md:table-cell";
});

const showReceipt = () => {
  emit("showReceipt", props.mmf.id);
};
const deleteMoneyflow = () => {
  emit("deleteMoneyflow", props.mmf);
};
const editMoneyflow = () => {
  emit("editMoneyflow", props.mmf);
};
const listMoneyflow = () => {
  emit("listMoneyflow", props.mmf);
};
</script>

