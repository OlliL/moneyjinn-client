<template>
  <TableRow>
    <TableCell class="text-left border">
      <SpanIban :iban="mca.accountNumber" />
    </TableCell>
    <TableCell class="text-left border">
      {{ mca.bankCode }}
    </TableCell>
    <TableCell class="text-center border-r py-1 px-2">
      <SpanDate :date="mca.lastUsed" />
    </TableCell>
    <ButtonTableIcon :title="$t('General.edit')" @click="actions.edit(mca)">
      <Pencil class="icon-medium" />
    </ButtonTableIcon>
    <ButtonTableIcon :title="$t('General.delete')" @click="actions.delete(mca)">
      <Trash2 class="icon-medium" />
    </ButtonTableIcon>
  </TableRow>
</template>

<script lang="ts" setup>
import { Pencil, Trash2 } from "lucide-vue-next";
import { inject } from "vue";

import { TableCell, TableRow } from "@/components/ui/table";

import ButtonTableIcon from "@/components/common/ButtonTableIcon.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import SpanIban from "@/components/common/SpanIban.vue";
import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import { ContractpartnerAccountActionsKey } from "@/model/CrudActions";

defineProps<{
  mca: ContractpartnerAccount;
}>();

const actions = inject(ContractpartnerAccountActionsKey)!;
</script>
