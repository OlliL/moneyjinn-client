<template>
  <TableRow>
    <TableCell class="text-left border py-1 px-2">
      {{ mcp.name }}
    </TableCell>
    <TableCell class="text-center border py-1 px-2">
      <SpanDate :date="mcp.validFrom" />
    </TableCell>
    <TableCell class="text-center border py-1 px-2">
      <SpanDate :date="mcp.validTil" />
    </TableCell>
    <TableCell class="text-left border py-1 px-2">
      {{ mcp.moneyflowComment }}
    </TableCell>
    <TableCell class="text-left border py-1 px-2">
      {{ mcp.postingAccountName }}
    </TableCell>

    <TableCell class="w-0 border whitespace-nowrap text-center p-0">
      <Button
        variant="ghost"
        size="icon"
        @click="editContractpartner"
        :title="$t('General.edit')"
        class="h-8 w-8 cursor-pointer"
      >
        <Pencil class="h-4 w-4" />
      </Button>
    </TableCell>

    <TableCell class="w-0 border whitespace-nowrap text-center p-0">
      <Button
        variant="ghost"
        size="icon"
        @click="deleteContractpartner"
        :title="$t('General.delete')"
        class="h-8 w-8 cursor-pointer"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </TableCell>

    <TableCell class="w-0 border whitespace-nowrap text-center p-0">
      <Button
        variant="ghost"
        size="icon"
        @click="listAccounts"
        :title="$t('General.contractpartnerAccounts')"
        class="h-8 w-8 cursor-pointer"
      >
        <Banknote class="h-4 w-4" />
      </Button>
    </TableCell>
  </TableRow>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import { Pencil, Trash2, Banknote } from "lucide-vue-next";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import SpanDate from "../SpanDate.vue";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";

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
