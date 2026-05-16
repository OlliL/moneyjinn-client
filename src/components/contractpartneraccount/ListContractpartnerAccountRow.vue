<template>
  <TableRow>
    <TableCell class="text-left border">
      {{ mca.accountNumber }}
    </TableCell>
    <TableCell class="text-left border">
      {{ mca.bankCode }}
    </TableCell>
    <TableCell class="text-right border">
      <Button
        variant="ghost"
        size="icon"
        @click="editContractpartnerAccount"
        :title="$t('General.edit')"
        class="group hover:bg-transparent"
      >
        <Pencil
          class="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors"
        />
      </Button>
    </TableCell>
    <TableCell class="text-right border">
      <Button
        variant="ghost"
        size="icon"
        @click="deleteContractpartnerAccount"
        :title="$t('General.delete')"
        class="group hover:bg-transparent"
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

import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";

const props = defineProps({
  mca: {
    type: Object as PropType<ContractpartnerAccount>,
    required: true,
  },
});

const emit = defineEmits([
  "deleteContractpartnerAccount",
  "editContractpartnerAccount",
]);

const deleteContractpartnerAccount = () => {
  emit("deleteContractpartnerAccount", props.mca);
};

const editContractpartnerAccount = () => {
  emit("editContractpartnerAccount", props.mca);
};
</script>
