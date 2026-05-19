<template>
  <TableRow
    :data-testid="`report-moneyflow-row-${mmf.id}`"
    v-if="
      mmf.moneyflowSplitEntries == null || mmf.moneyflowSplitEntries.length == 0
    "
  >
    <TableCell :class="[redIfPrivate, ' border-r py-0 px-1', rowBgClass]">
      <Button
        v-if="mmf.hasReceipt"
        variant="ghost"
        size="icon"
        @click="showReceipt"
        :title="$t('Receipt.receipt')"
        :aria-label="$t('Receipt.receipt')"
        class="h-8 w-8 cursor-pointer"
      >
        <Image class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell :class="[' border-r', rowBgClass]"
      ><SpanDate :date="mmf.bookingDate"
    /></TableCell>
    <TableCell :class="['hidden md:table-cell  border-r', rowBgClass]"
      ><SpanDate :date="mmf.invoiceDate"
    /></TableCell>
    <TableCell :class="['text-right', rowBgClass]"></TableCell>
    <TableCell :class="['text-right', rowBgClass]">
      <SpanAmount :amount="mmf.amount" />
    </TableCell>
    <TableCell
      :class="['text-left hidden md:table-cell  border-r', rowBgClass]"
    >
      {{ mmf.contractpartnerName }}
    </TableCell>
    <TableCell
      :class="[
        'text-left break-words whitespace-normal w-full min-w-0 break-all',
        rowBgClass,
      ]"
      >{{ mmf.comment }}</TableCell
    >
    <TableCell
      :class="['text-left hidden md:table-cell  border-r', rowBgClass]"
    >
      {{ mmf.postingAccountName }}
    </TableCell>
    <TableCell
      :class="['text-left hidden md:table-cell  border-r ', rowBgClass]"
    >
      {{ mmf.capitalsourceComment }}
    </TableCell>
    <TableCell
      :class="['text-center py-0 px-1', rowBgClass]"
      v-if="isOwnMoneyflow"
    >
      <Button
        variant="ghost"
        size="icon"
        :data-testid="`report-moneyflow-edit-${mmf.id}`"
        @click="editMoneyflow"
        :title="$t('General.edit')"
        :aria-label="$t('General.edit')"
        class="h-8 w-8 cursor-pointer"
      >
        <Pencil class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      :class="['text-center border-l py-0 px-1', rowBgClass]"
      v-if="isOwnMoneyflow"
    >
      <Button
        variant="ghost"
        size="icon"
        :data-testid="`report-moneyflow-delete-${mmf.id}`"
        @click="deleteMoneyflow"
        :title="$t('General.delete')"
        :aria-label="$t('General.delete')"
        class="h-8 w-8 cursor-pointer"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      :class="['text-center border-r py-0 px-1', rowBgClass]"
      v-if="!isOwnMoneyflow"
    >
      <Button
        variant="ghost"
        size="icon"
        :data-testid="`report-moneyflow-list-${mmf.id}`"
        @click="listMoneyflow"
        :title="$t('General.moneyflow')"
        :aria-label="$t('General.moneyflow')"
        class="h-8 w-8 cursor-pointer"
      >
        <Eye class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell :class="[rowBgClass]" v-if="!isOwnMoneyflow"></TableCell>
  </TableRow>

  <TableRow
    v-for="(mse, index) in mmf.moneyflowSplitEntries"
    :key="mse.id"
    :data-testid="index === 0 ? `report-moneyflow-row-${mmf.id}` : undefined"
  >
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0"
      :class="[redIfPrivate, ' border-r py-0 px-1', rowBgClass]"
    >
      <Button
        v-if="mmf.hasReceipt"
        variant="ghost"
        size="icon"
        @click="showReceipt"
        :title="$t('Receipt.receipt')"
        :aria-label="$t('Receipt.receipt')"
        class="h-8 w-8 cursor-pointer"
      >
        <Image class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      :class="[' border-r', rowBgClass]"
      v-if="index == 0"
    >
      <SpanDate :date="mmf.bookingDate" />
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0"
      :class="['hidden md:table-cell  border-r', rowBgClass]"
    >
      <SpanDate :date="mmf.invoiceDate" />
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0"
      :class="['text-right  border-r', rowBgClass]"
    >
      <SpanAmount :amount="mmf.amount" />
    </TableCell>
    <TableCell :class="['text-right  border-r', rowBgClass]">
      <SpanAmount :amount="mse.amount" />
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0"
      :class="['text-left hidden md:table-cell  border-r', rowBgClass]"
    >
      {{ mmf.contractpartnerName }}
    </TableCell>
    <TableCell
      :class="[
        'text-left border-r break-words whitespace-normal min-w-[150px] w-full',
        rowBgClass,
      ]"
      >{{ mse.comment }}</TableCell
    >
    <TableCell
      :class="['text-left hidden md:table-cell  border-r', rowBgClass]"
    >
      {{ mse.postingAccountName }}
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0"
      :class="['text-left hidden md:table-cell  border-r', rowBgClass]"
    >
      {{ mmf.capitalsourceComment }}
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0 && isOwnMoneyflow"
      :class="['text-center  py-0 px-1', rowBgClass]"
    >
      <Button
        variant="ghost"
        size="icon"
        :data-testid="`report-moneyflow-edit-${mmf.id}`"
        @click="editMoneyflow"
        :title="$t('General.edit')"
        :aria-label="$t('General.edit')"
        class="h-8 w-8 cursor-pointer"
      >
        <Pencil class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0 && isOwnMoneyflow"
      :class="['text-center border-l py-0 px-1', rowBgClass]"
    >
      <Button
        variant="ghost"
        size="icon"
        :data-testid="`report-moneyflow-delete-${mmf.id}`"
        @click="deleteMoneyflow"
        :title="$t('General.delete')"
        :aria-label="$t('General.delete')"
        class="h-8 w-8 cursor-pointer"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      :rowspan="rowspan"
      v-if="index == 0 && !isOwnMoneyflow"
      :class="['text-center  border-r py-0 px-1', rowBgClass]"
    >
      <Button
        variant="ghost"
        size="icon"
        :data-testid="`report-moneyflow-list-${mmf.id}`"
        @click="listMoneyflow"
        :title="$t('General.moneyflow')"
        :aria-label="$t('General.moneyflow')"
        class="h-8 w-8 cursor-pointer"
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
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { Eye, Image, Pencil, Trash2 } from "lucide-vue-next";
import { computed, type PropType } from "vue";
import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";

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
  return props.index % 2 === 0 ? "bg-muted" : "bg-background";
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
