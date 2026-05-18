<template>
  <TableRow>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mcp.name }}
    </TableCell>
    <TableCell class="text-center border-r py-1 px-2">
      <SpanDate :date="mcp.validFrom" />
    </TableCell>
    <TableCell class="text-center border-r py-1 px-2">
      <SpanDate :date="mcp.validTil" />
    </TableCell>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mcp.moneyflowComment }}
    </TableCell>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mcp.postingAccountName }}
    </TableCell>

    <TableActionButton :title="$t('General.edit')" @click="editContractpartner">
        <Pencil class="h-4 w-4" />
    </TableActionButton>

    <TableActionButton
      :title="$t('General.delete')"
      cell-class="w-0 border-l whitespace-nowrap text-center p-0"
      @click="deleteContractpartner"
    >
        <Trash2 class="h-4 w-4" />
    </TableActionButton>

    <TableActionButton
      :title="$t('General.contractpartnerAccounts')"
      cell-class="w-0 border-l whitespace-nowrap text-center p-0"
      @click="listAccounts"
    >
        <Banknote class="h-4 w-4" />
    </TableActionButton>
  </TableRow>
</template>

<script lang="ts" setup>
import { Banknote, Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

import { TableCell, TableRow } from "@/components/ui/table";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import SpanDate from "../SpanDate.vue";
import TableActionButton from "../TableActionButton.vue";

const props = defineProps({
  mcp: {
    type: Object as PropType<Contractpartner>,
    required: true,
  },
});

const emit = defineEmits([
  "deleteContractpartner",
  "editContractpartner",
  "listContractpartnerAccounts",
]);

const deleteContractpartner = () => {
  emit("deleteContractpartner", props.mcp);
};

const editContractpartner = () => {
  emit("editContractpartner", props.mcp);
};

const listAccounts = () => {
  emit("listContractpartnerAccounts", props.mcp);
};
</script>
