<template>
  <TableRow>
    <TableCell class="border-r">
      <div class="flex items-center justify-center">
        <RadioGroupItem
          :id="'radio-' + props.mmf.id"
          :value="String(props.mmf.id)"
          :data-testid="'moneyflow-radio-' + props.mmf.id"
          class="icon-medium rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
    </TableCell>
    <TableCell class="border-r"><SpanDate :date="mmf.invoiceDate" /></TableCell>
    <TableCell class="text-right border-r"
      ><SpanAmount :amount="mmf.amount"
    /></TableCell>
    <TableCell class="text-left border-r">{{
      mmf.contractpartnerName
    }}</TableCell>
    <TableCell class="text-left border-r">{{ mmf.comment }}</TableCell>
    <TableCell class="text-center" v-if="isOwnMoneyflow">
      <Button
        variant="ghost"
        size="icon"
        @click="editMoneyflow"
        class="action-icon-button"
      >
        <Pencil class="icon-medium" />
      </Button>
    </TableCell>
    <TableCell class="text-center border-l" v-if="isOwnMoneyflow">
      <Button
        variant="ghost"
        size="icon"
        @click="deleteMoneyflow"
        class="action-icon-button"
      >
        <Trash2 class="icon-medium" />
      </Button>
    </TableCell>
    <TableCell v-if="!isOwnMoneyflow">
      <Button
        variant="ghost"
        size="icon"
        @click="listMoneyflow"
        class="action-icon-button"
      >
        <Eye class="icon-medium" />
      </Button>
    </TableCell>
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
import { Eye, Pencil, Trash2 } from "lucide-vue-next";
import { computed, type PropType } from "vue";
const props = defineProps({
  mmf: {
    type: Object as PropType<Moneyflow>,
    required: true,
  },
});

const userSessionStore = useUserSessionStore();
const emit = defineEmits(["deleteMoneyflow", "editMoneyflow", "listMoneyflow"]);

const isOwnMoneyflow = computed(() => {
  return props.mmf.userId === userSessionStore.getUserId;
});

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
