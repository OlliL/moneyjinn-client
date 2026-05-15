<template>
  <TableRow>
    <TableCell class="text-right border py-1 px-2">
      <SpanAmount :amount="mpm.amount" />
    </TableCell>
    <TableCell class="text-left border py-1 px-2">
      {{ mpm.contractpartnerName }}
    </TableCell>
    <TableCell class="text-left border py-1 px-2">
      {{ mpm.comment }}
    </TableCell>
    <TableCell class="text-left border py-1 px-2">
      {{ mpm.postingAccountName }}
    </TableCell>
    <TableCell class="text-left border py-1 px-2">
      {{ mpm.capitalsourceComment }}
    </TableCell>
    <TableCell class="text-center border py-1 px-2">
      <SpanBoolean :value="mpm.onceAMonth" />
    </TableCell>

    <TableCell class="text-center border py-1 px-2">
      <SpanDate :date="mpm.createDate" />
    </TableCell>
    <TableCell class="text-center border py-1 px-2">
      <SpanDate :date="mpm.lastUsed" />
    </TableCell>
    <TableCell class="text-right border py-0 px-1 w-[40px]">
      <Button
        variant="ghost"
        size="icon"
        @click="editPreDefMoneyflow"
        :title="$t('General.edit')"
        class="group hover:bg-transparent h-8 w-8"
      >
        <Pencil
          class="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
        />
      </Button>
    </TableCell>
    <TableCell class="text-right border py-0 px-1 w-[40px]">
      <Button
        variant="ghost"
        size="icon"
        @click="deletePreDefMoneyflow"
        :title="$t('General.delete')"
        class="group hover:bg-transparent h-8 w-8"
      >
        <Trash2
          class="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors"
        />
      </Button>
    </TableCell>
  </TableRow>
</template>
<script lang="ts" setup>
import type { PropType } from "vue";
import { Pencil, Trash2 } from "lucide-vue-next";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";

import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import SpanBoolean from "../SpanBoolean.vue";

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
