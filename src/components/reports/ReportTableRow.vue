<template>
  <TableRow
    v-if="
      mmf.moneyflowSplitEntries == null || mmf.moneyflowSplitEntries.length == 0
    "
  >
    <TableCell :class="[redIfPrivate, 'border', rowBgClass]">
      <Button
        v-if="mmf.hasReceipt"
        variant="ghost"
        size="icon"
        @click="showReceipt"
        :title="$t('Receipt.receipt')"
        :aria-label="$t('Receipt.receipt')"
        class="h-8 w-8"
      >
        <Image class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell :class="['border', rowBgClass]"
      ><SpanDate :date="mmf.bookingDate"
    /></TableCell>
    <TableCell :class="['hidden md:table-cell border', rowBgClass]"
      ><SpanDate :date="mmf.invoiceDate"
    /></TableCell>
    <TableCell :class="['text-right', rowBgClass]"></TableCell>
    <TableCell :class="['text-right', rowBgClass]">
      <SpanAmount :amount="mmf.amount" />
    </TableCell>
    <TableCell :class="['text-left hidden md:table-cell border', rowBgClass]">
      {{ mmf.contractpartnerName }}
    </TableCell>
    <TableCell :class="['text-left', rowBgClass]">{{ mmf.comment }}</TableCell>
    <TableCell :class="['text-left hidden md:table-cell border', rowBgClass]">
      {{ mmf.postingAccountName }}
    </TableCell>
    <TableCell :class="['text-left hidden md:table-cell border', rowBgClass]">
      {{ mmf.capitalsourceComment }}
    </TableCell>
    <TableCell
      :class="['text-center border', rowBgClass]"
      v-if="isOwnMoneyflow"
    >
      <Button
        variant="ghost"
        size="icon"
        @click="editMoneyflow"
        :title="$t('General.edit')"
        :aria-label="$t('General.edit')"
        class="h-8 w-8"
      >
        <Pencil class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      :class="['text-center border', rowBgClass]"
      v-if="isOwnMoneyflow"
    >
      <Button
        variant="ghost"
        size="icon"
        @click="deleteMoneyflow"
        :title="$t('General.delete')"
        :aria-label="$t('General.delete')"
        class="h-8 w-8"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      :class="['text-center border', rowBgClass]"
      v-if="!isOwnMoneyflow"
    >
      <Button
        variant="ghost"
        size="icon"
        @click="listMoneyflow"
        :title="$t('General.moneyflow')"
        :aria-label="$t('General.moneyflow')"
        class="h-8 w-8"
      >
        <Eye class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell :class="[rowBgClass]" v-if="!isOwnMoneyflow"></TableCell>
  </TableRow>

  <TableRow v-for="(mse, index) in mmf.moneyflowSplitEntries" :key="mse.id">
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0"
      :class="[redIfPrivate, 'border', rowBgClass]"
    >
      <Button
        v-if="mmf.hasReceipt"
        variant="ghost"
        size="icon"
        @click="showReceipt"
        :title="$t('Receipt.receipt')"
        :aria-label="$t('Receipt.receipt')"
        class="h-8 w-8"
      >
        <Image class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      :class="['border', rowBgClass]"
      v-if="index == 0"
    >
      <SpanDate :date="mmf.bookingDate" />
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0"
      :class="['hidden md:table-cell border', rowBgClass]"
    >
      <SpanDate :date="mmf.invoiceDate" />
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0"
      :class="['text-right border', rowBgClass]"
    >
      <SpanAmount :amount="mmf.amount" />
    </TableCell>
    <TableCell :class="['text-right border', rowBgClass]">
      <SpanAmount :amount="mse.amount" />
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0"
      :class="['text-left hidden md:table-cell border', rowBgClass]"
    >
      {{ mmf.contractpartnerName }}
    </TableCell>
    <TableCell :class="['text-left border', rowBgClass]">{{
      mse.comment
    }}</TableCell>
    <TableCell :class="['text-left hidden md:table-cell border', rowBgClass]">
      {{ mse.postingAccountName }}
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0"
      :class="['text-left hidden md:table-cell border', rowBgClass]"
    >
      {{ mmf.capitalsourceComment }}
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0 && isOwnMoneyflow"
      :class="['text-center border', rowBgClass]"
    >
      <Button
        variant="ghost"
        size="icon"
        @click="editMoneyflow"
        :title="$t('General.edit')"
        :aria-label="$t('General.edit')"
        class="h-8 w-8"
      >
        <Pencil class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0 && isOwnMoneyflow"
      :class="['text-center border', rowBgClass]"
    >
      <Button
        variant="ghost"
        size="icon"
        @click="deleteMoneyflow"
        :title="$t('General.delete')"
        :aria-label="$t('General.delete')"
        class="h-8 w-8"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0 && !isOwnMoneyflow"
      :class="['text-center border', rowBgClass]"
    >
      <Button
        variant="ghost"
        size="icon"
        @click="listMoneyflow"
        :title="$t('General.moneyflow')"
        :aria-label="$t('General.moneyflow')"
        class="h-8 w-8"
      >
        <Eye class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0 && !isOwnMoneyflow"
      :class="[rowBgClass]"
    ></TableCell>
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
  index: {
    type: Number,
    required: true,
  },
});
const rowBgClass = computed(() => {
  // Wenn der Index gerade ist, kriegt die Zelle den leicht bläulichen Hintergrund
  return props.index % 2 === 0 ? "bg-primary/[0.06]" : "bg-background";
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
  return props.mmf.private
    ? "bg-destructive/10 hidden md:table-cell"
    : "hidden md:table-cell";
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
