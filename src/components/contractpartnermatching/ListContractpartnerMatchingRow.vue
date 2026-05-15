<template>
  <TableRow>
    <TableCell class="text-left border py-1 px-2">
      {{ mcm.matchingText }}
    </TableCell>
    <TableCell class="text-left border py-1 px-2">
      {{ mcm.contractpartnerName }}
    </TableCell>
    <TableCell class="text-left border py-1 px-2">
      {{ mcm.moneyflowComment }}
    </TableCell>
    <TableCell class="text-left border py-1 px-2">
      {{ mcm.postingAccountName }}
    </TableCell>
    <TableCell class="text-center border py-0 px-1 w-[40px]">
      <Button
        variant="ghost"
        size="icon"
        @click="editContractpartnerMatching"
        :title="$t('General.edit')"
        class="group hover:bg-transparent h-8 w-8"
      >
        <Pencil
          class="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
        />
      </Button>
    </TableCell>
    <TableCell class="text-center border py-0 px-1 w-[40px]">
      <Button
        variant="ghost"
        size="icon"
        @click="deleteContractpartnerMatching"
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
