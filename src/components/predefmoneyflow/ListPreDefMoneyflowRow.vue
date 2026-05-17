<template>
  <TableRow>
    <TableCell class="text-right border-r py-1 px-2">
      <SpanAmount :amount="mpm.amount" />
    </TableCell>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mpm.contractpartnerName }}
    </TableCell>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mpm.comment }}
    </TableCell>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mpm.postingAccountName }}
    </TableCell>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mpm.capitalsourceComment }}
    </TableCell>
    <TableCell class="text-center border-r py-1 px-2">
      <SpanBoolean :value="mpm.onceAMonth" />
    </TableCell>

    <TableCell class="text-center border-r py-1 px-2">
      <SpanDate :date="mpm.createDate" />
    </TableCell>
    <TableCell class="text-center border-r py-1 px-2">
      <SpanDate :date="mpm.lastUsed" />
    </TableCell>
    <TableCell class="w-0 whitespace-nowrap text-center p-0">
      <Button
        variant="ghost"
        size="icon"
        @click="editPreDefMoneyflow"
        :title="$t('General.edit')"
        class="h-8 w-8 cursor-pointer"
      >
        <Pencil class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell class="w-0 border-l whitespace-nowrap text-center p-0">
      <Button
        variant="ghost"
        size="icon"
        @click="deletePreDefMoneyflow"
        :title="$t('General.delete')"
        class="h-8 w-8 cursor-pointer"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </TableCell>
  </TableRow>
</template>
<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";
import SpanAmount from "../SpanAmount.vue";
import SpanBoolean from "../SpanBoolean.vue";
import SpanDate from "../SpanDate.vue";

const props = defineProps({
  mpm: {
    type: Object as PropType<PreDefMoneyflow>,
    required: true,
  },
});
const emit = defineEmits(["deletePreDefMoneyflow", "editPreDefMoneyflow"]);

const deletePreDefMoneyflow = () => {
  emit("deletePreDefMoneyflow", props.mpm);
};

const editPreDefMoneyflow = () => {
  emit("editPreDefMoneyflow", props.mpm);
};
</script>
