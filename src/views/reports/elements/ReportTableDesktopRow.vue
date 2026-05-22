<template>
  <TableRow
    v-for="(row, idx) in tableRows"
    :key="row.isSplit ? row.mseId : 'main-' + mmf.id"
    :data-testid="idx === 0 ? `report-moneyflow-row-${mmf.id}` : undefined"
  >
    <template v-if="idx === 0">
      <TableCell
        :rowspan="rowspan"
        :class="['border-r py-0 px-1', redIfPrivate, rowBgClass]"
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
          <ReceiptText class="h-4 w-4" />
        </Button>
      </TableCell>
      <TableCell :rowspan="rowspan" :class="['border-r', rowBgClass]">
        <SpanDate :date="mmf.bookingDate" />
      </TableCell>
      <TableCell :rowspan="rowspan" :class="['border-r', rowBgClass]">
        <SpanDate :date="mmf.invoiceDate" />
      </TableCell>
      <TableCell
        :rowspan="rowspan"
        :colspan="!hasSplits ? 2 : 1"
        :class="['text-right', hasSplits ? 'border-r' : '', rowBgClass]"
      >
        <SpanAmount :amount="mmf.amount" />
      </TableCell>
    </template>

    <TableCell v-if="hasSplits" :class="['text-right border-r', rowBgClass]">
      <SpanAmount v-if="row.isSplit" :amount="row.amount" />
    </TableCell>

    <template v-if="idx === 0">
      <TableCell :rowspan="rowspan" :class="['text-left border-r', rowBgClass]">
        {{ mmf.contractpartnerName }}
      </TableCell>
    </template>

    <TableCell
      :class="[
        'text-left border-r break-words whitespace-normal w-full min-w-0',
        rowBgClass,
      ]"
    >
      {{ row.comment }}
    </TableCell>
    <TableCell :class="['text-left border-r', rowBgClass]">
      {{ row.postingAccountName }}
    </TableCell>

    <template v-if="idx === 0">
      <TableCell :rowspan="rowspan" :class="['text-left border-r', rowBgClass]">
        {{ mmf.capitalsourceComment }}
      </TableCell>

      <template v-if="isOwnMoneyflow">
        <TableCell
          :rowspan="rowspan"
          :class="['text-center py-0 px-1', rowBgClass]"
        >
          <Button
            variant="ghost"
            size="icon"
            :data-testid="`report-moneyflow-edit-${mmf.id}`"
            @click="editMoneyflow"
            :title="$t('General.edit')"
            class="h-8 w-8 cursor-pointer"
          >
            <Pencil class="h-4 w-4" />
          </Button>
        </TableCell>
        <TableCell
          :rowspan="rowspan"
          :class="['text-center border-l py-0 px-1', rowBgClass]"
        >
          <Button
            variant="ghost"
            size="icon"
            :data-testid="`report-moneyflow-delete-${mmf.id}`"
            @click="deleteMoneyflow"
            :title="$t('General.delete')"
            class="h-8 w-8 cursor-pointer"
          >
            <Trash2 class="h-4 w-4" />
          </Button>
        </TableCell>
      </template>

      <template v-else>
        <TableCell
          :rowspan="rowspan"
          :class="['text-center border-r py-0 px-1', rowBgClass]"
        >
          <Button
            variant="ghost"
            size="icon"
            :data-testid="`report-moneyflow-list-${mmf.id}`"
            @click="listMoneyflow"
            :title="$t('General.moneyflow')"
            class="h-8 w-8 cursor-pointer"
          >
            <Eye class="h-4 w-4" />
          </Button>
        </TableCell>
        <TableCell :rowspan="rowspan" :class="rowBgClass" />
      </template>
    </template>
  </TableRow>
</template>

<script lang="ts" setup>
import SpanAmount from "@/components/common/SpanAmount.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { Eye, Pencil, ReceiptText, Trash2 } from "lucide-vue-next";
import { computed, type PropType } from "vue";

const props = defineProps({
  mmf: { type: Object as PropType<Moneyflow>, required: true },
  index: { type: Number, required: true },
});

const emit = defineEmits([
  "showReceipt",
  "deleteMoneyflow",
  "editMoneyflow",
  "listMoneyflow",
]);

const rowBgClass = computed(() =>
  props.index % 2 === 0 ? "bg-muted" : "bg-background",
);
const isOwnMoneyflow = computed(
  () => props.mmf.userId === useUserSessionStore().getUserId,
);
const rowspan = computed(() => props.mmf.moneyflowSplitEntries?.length || 1);
const hasSplits = computed(() => !!props.mmf.moneyflowSplitEntries?.length);
const redIfPrivate = computed(() =>
  props.mmf.private ? "bg-destructive/10" : "",
);

// NIE MEHR DOPPELTER CODE: Mappe die Zeilen zu einer einheitlichen Struktur
const tableRows = computed(() => {
  if (hasSplits.value) {
    return props.mmf.moneyflowSplitEntries!.map((mse) => ({
      isSplit: true,
      mseId: mse.id,
      amount: mse.amount,
      comment: mse.comment,
      postingAccountName: mse.postingAccountName,
    }));
  }
  // Wenn keine Splits existieren, gibt es genau eine Zeile mit den Hauptdaten
  return [
    {
      isSplit: false,
      mseId: undefined,
      amount: props.mmf.amount,
      comment: props.mmf.comment,
      postingAccountName: props.mmf.postingAccountName,
    },
  ];
});

const showReceipt = () => emit("showReceipt", props.mmf.id);
const deleteMoneyflow = () => emit("deleteMoneyflow", props.mmf);
const editMoneyflow = () => emit("editMoneyflow", props.mmf);
const listMoneyflow = () => emit("listMoneyflow", props.mmf);
</script>
