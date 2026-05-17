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
        class="h-8 w-8 cursor-pointer"
      >
        <Pencil class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell class="text-right border">
      <Button
        variant="ghost"
        size="icon"
        @click="deleteContractpartnerAccount"
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
