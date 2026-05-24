<template>
  <TableRow
    v-for="(row, idx) in tableRows"
    :key="row.isSplit ? row.mseId : 'main-' + mmf.id"
    :data-testid="idx === 0 ? `report-moneyflow-row-${mmf.id}` : undefined"
  >
    <template v-if="idx === 0">
      <TableCell
        :rowspan="rowspan"
        :class="['border-r py-0 px-1', redIfPrivate || rowBgClass]"
      >
        <Button
          v-if="mmf.hasReceipt"
          :class="lesserOpacityIfFuture"
          variant="ghost"
          size="icon"
          @click="$emit('showReceipt', mmf.id)"
          :title="$t('Receipt.receipt')"
          :aria-label="$t('Receipt.receipt')"
          class="action-icon-button"
        >
          <ReceiptText class="icon-small" />
        </Button>
      </TableCell>
      <TableCell :rowspan="rowspan" :class="['border-r', rowBgClass]">
        <div class="flex items-center justify-center gap-1">
          <Clock
            v-if="isFuture"
            class="icon-extra-small text-muted-foreground"
            :title="$t('Moneyflow.reserved')"
          />
          <SpanDate
            :date="mmf.bookingDate"
            :class="[{ 'italic font-medium': isFuture }, lesserOpacityIfFuture]"
          />
        </div>
      </TableCell>
      <TableCell
        :rowspan="rowspan"
        :class="['border-r', rowBgClass, lesserOpacityIfFuture]"
      >
        <SpanDate :date="mmf.invoiceDate" />
      </TableCell>
      <TableCell
        :rowspan="rowspan"
        :colspan="!hasSplits ? 2 : 1"
        :class="[
          'text-right',
          hasSplits ? 'border-r' : '',
          rowBgClass,
          lesserOpacityIfFuture,
        ]"
      >
        <SpanAmount :amount="mmf.amount" />
      </TableCell>
    </template>

    <TableCell
      v-if="hasSplits"
      :class="['text-right border-r', rowBgClass, lesserOpacityIfFuture]"
    >
      <SpanAmount v-if="row.isSplit" :amount="row.amount" />
    </TableCell>

    <template v-if="idx === 0">
      <TableCell
        :rowspan="rowspan"
        :class="['text-left border-r', rowBgClass, lesserOpacityIfFuture]"
      >
        {{ mmf.contractpartnerName }}
      </TableCell>
    </template>

    <TableCell
      :class="[
        'text-left border-r break-words whitespace-normal w-full min-w-0',
        rowBgClass,
        lesserOpacityIfFuture,
      ]"
    >
      {{ row.comment }}
    </TableCell>
    <TableCell
      :class="['text-left border-r', rowBgClass, lesserOpacityIfFuture]"
    >
      {{ row.postingAccountName }}
    </TableCell>

    <template v-if="idx === 0">
      <TableCell
        :rowspan="rowspan"
        :class="[
          'text-left border-r',
          rowBgClass,
          isFuture ? 'opacity-60' : '',
        ]"
      >
        {{ mmf.capitalsourceComment }}
      </TableCell>

      <template v-if="isOwnMoneyflow">
        <TableCell
          :rowspan="rowspan"
          :class="['text-center py-0 px-1', rowBgClass, lesserOpacityIfFuture]"
        >
          <Button
            variant="ghost"
            size="icon"
            :data-testid="`report-moneyflow-edit-${mmf.id}`"
            @click="$emit('editMoneyflow', mmf)"
            :title="$t('General.edit')"
            class="action-icon-button"
          >
            <Pencil class="icon-small" />
          </Button>
        </TableCell>
        <TableCell
          :rowspan="rowspan"
          :class="[
            'text-center border-l py-0 px-1',
            rowBgClass,
            lesserOpacityIfFuture,
          ]"
        >
          <Button
            variant="ghost"
            size="icon"
            :data-testid="`report-moneyflow-delete-${mmf.id}`"
            @click="$emit('deleteMoneyflow', mmf)"
            :title="$t('General.delete')"
            class="action-icon-button"
          >
            <Trash2 class="icon-small" />
          </Button>
        </TableCell>
      </template>

      <template v-else>
        <TableCell
          :rowspan="rowspan"
          :class="[
            'text-center border-r py-0 px-1',
            rowBgClass,
            lesserOpacityIfFuture,
          ]"
        >
          <Button
            variant="ghost"
            size="icon"
            :data-testid="`report-moneyflow-list-${mmf.id}`"
            @click="$emit('listMoneyflow', mmf)"
            :title="$t('General.moneyflow')"
            class="action-icon-button"
          >
            <Eye class="icon-small" />
          </Button>
        </TableCell>
        <TableCell
          :rowspan="rowspan"
          :class="[rowBgClass, lesserOpacityIfFuture]"
        />
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
import { Clock, Eye, Pencil, ReceiptText, Trash2 } from "lucide-vue-next";
import { computed, type PropType } from "vue";

const props = defineProps({
  mmf: { type: Object as PropType<Moneyflow>, required: true },
  index: { type: Number, required: true },
});

defineEmits<{
  showReceipt: [id: number];
  editMoneyflow: [moneyflow: Moneyflow];
  deleteMoneyflow: [moneyflow: Moneyflow];
  listMoneyflow: [moneyflow: Moneyflow];
}>();

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

const isFuture = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookingDate = new Date(props.mmf.bookingDate);
  bookingDate.setHours(0, 0, 0, 0);
  return bookingDate > today;
});

const lesserOpacityIfFuture = computed(() =>
  isFuture.value ? "opacity-50" : "",
);

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
</script>
