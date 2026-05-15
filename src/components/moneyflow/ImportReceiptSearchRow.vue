<template>
  <TableRow>
    <TableCell>
      <div class="flex items-center justify-center">
        <input
          type="radio"
          :name="'selectMoneyflow' + receiptId"
          :checked="preselected"
          @change="moneyflowSelected"
          class="rounded-sm border border-primary"
        />
      </div>
    </TableCell>
    <TableCell><SpanDate :date="mmf.invoiceDate" /></TableCell>
    <TableCell class="text-right"><SpanAmount :amount="mmf.amount" /></TableCell>
    <TableCell class="text-left">{{ mmf.contractpartnerName }}</TableCell>
    <TableCell class="text-left">{{ mmf.comment }}</TableCell>
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
    <TableCell class="text-center" v-if="isOwnMoneyflow">
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
import { computed, type PropType } from "vue";
import { Pencil, Trash2 } from "lucide-vue-next";

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
  preselected: {
    type: Boolean,
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
const moneyflowSelected = () => {
  emit("update:modelValue", props.mmf.id);
};
</script>
