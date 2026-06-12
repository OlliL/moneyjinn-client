<template>
  <TableRow>
    <TableCell class="border-r py-1">
      <div class="flex items-center justify-center">
        <RadioGroupItem
          :id="'radio-' + props.mmf.id"
          :value="String(props.mmf.id)"
          :data-testid="'moneyflow-radio-' + props.mmf.id"
          class="icon-medium rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
    </TableCell>
    <TableCell class="text-center border-r py-1">
      <SpanDate :date="mmf.invoiceDate" />
    </TableCell>
    <TableCell class="text-right border-r py-1"
      ><SpanAmount :amount="mmf.amount"
    /></TableCell>
    <TableCell class="text-left border-r py-1">{{
      mmf.contractpartnerName
    }}</TableCell>
    <TableCell class="text-left border-r py-1">{{ mmf.comment }}</TableCell>
    <template v-if="isOwnMoneyflow">
      <TableCell class="text-center py-0 px-1">
        <Button
          variant="ghost"
          size="icon"
          :data-testid="`import-receipt-search-result-edit-${mmf.id}`"
          @click="editMoneyflow"
          :title="$t('General.edit')"
          class="action-icon-button"
        >
          <Pencil class="icon-medium" />
        </Button>
      </TableCell>
      <TableCell class="text-center border-l py-0 px-1">
        <Button
          variant="ghost"
          size="icon"
          :data-testid="`import-receipt-search-result-delete-${mmf.id}`"
          @click="deleteMoneyflow"
          :title="$t('General.delete')"
          class="action-icon-button"
        >
          <Trash2 class="icon-medium" />
        </Button>
      </TableCell>
    </template>

    <template v-else>
      <TableCell class="text-center border-r py-0 px-1">
        <Button
          variant="ghost"
          size="icon"
          :data-testid="`import-receipt-search-result-list-${mmf.id}`"
          @click="listMoneyflow"
          :title="$t('General.moneyflow')"
          class="action-icon-button"
        >
          <Eye class="icon-medium" />
        </Button>
      </TableCell>
      <TableCell />
    </template>
  </TableRow>
</template>
<script lang="ts" setup>
import SpanAmount from "@/components/common/SpanAmount.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import { Button } from "@/components/ui/button";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { Eye, Pencil, Trash2 } from "@lucide/vue";
import { computed } from "vue";
const props = defineProps<{
  mmf: Moneyflow;
}>();

const userSessionStore = useUserSessionStore();
const emit = defineEmits<{
  deleteMoneyflow: [id: number];
  editMoneyflow: [id: number];
  listMoneyflow: [id: number];
}>();

const isOwnMoneyflow = computed(
  () => props.mmf.userId === userSessionStore.getUserId,
);

const deleteMoneyflow = () => emit("deleteMoneyflow", props.mmf.id);
const editMoneyflow = () => emit("editMoneyflow", props.mmf.id);
const listMoneyflow = () => emit("listMoneyflow", props.mmf.id);
</script>
