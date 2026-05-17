<template>
  <TableRow>
    <TableCell class="border-r">
      <div class="flex items-center justify-center">
        <RadioGroupItem
          :id="'radio-' + props.mmf.id"
          :value="String(props.mmf.id)"
          class="h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
        class="h-6 w-6"
      >
        <Pencil class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell class="text-center border-l" v-if="isOwnMoneyflow">
      <Button
        variant="ghost"
        size="icon"
        @click="deleteMoneyflow"
        class="h-6 w-6"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell v-if="!isOwnMoneyflow"></TableCell>
  </TableRow>
</template>
<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { Pencil, Trash2 } from "lucide-vue-next";
import { computed, type PropType } from "vue";
import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";
const props = defineProps({
  mmf: {
    type: Object as PropType<Moneyflow>,
    required: true,
  },
  receiptId: {
    type: Number,
    required: true,
  },
});

const userSessionStore = useUserSessionStore();
const emit = defineEmits([
  "deleteMoneyflow",
  "editMoneyflow",
  "update:modelValue",
]);

const isOwnMoneyflow = computed(() => {
  return props.mmf.userId === userSessionStore.getUserId;
});

const deleteMoneyflow = () => {
  emit("deleteMoneyflow", props.mmf.id);
};
const editMoneyflow = () => {
  emit("editMoneyflow", props.mmf.id);
};
</script>
