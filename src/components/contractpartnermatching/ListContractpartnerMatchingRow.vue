<template>
  <TableRow>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mcm.matchingText }}
    </TableCell>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mcm.contractpartnerName }}
    </TableCell>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mcm.moneyflowComment }}
    </TableCell>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mcm.postingAccountName }}
    </TableCell>
    <TableCell class="w-0 whitespace-nowrap text-center p-0">
      <Button
        variant="ghost"
        size="icon"
        @click="editContractpartnerMatching"
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
        @click="deleteContractpartnerMatching"
        :title="$t('General.delete')"
        class="h-8 w-8 cursor-pointer"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </TableCell>
  </TableRow>
</template>

<script lang="ts" setup>
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";

const props = defineProps({
  mcm: {
    type: Object as PropType<ContractpartnerMatching>,
    required: true,
  },
});

const emit = defineEmits([
  "deleteContractpartnerMatching",
  "editContractpartnerMatching",
]);

const deleteContractpartnerMatching = () => {
  emit("deleteContractpartnerMatching", props.mcm);
};
const editContractpartnerMatching = () => {
  emit("editContractpartnerMatching", props.mcm);
};
</script>
