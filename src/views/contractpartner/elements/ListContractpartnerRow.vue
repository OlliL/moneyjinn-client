<template>
  <TableRow :data-testid="`contractpartner-row-${mcp.id}`">
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

    <ButtonTableIcon
      :title="$t('General.edit')"
      :test-id="`contractpartner-edit-${mcp.id}`"
      @click="actions.edit(mcp)"
    >
      <Pencil class="icon-medium" />
    </ButtonTableIcon>

    <ButtonTableIcon
      :title="$t('General.delete')"
      :test-id="`contractpartner-delete-${mcp.id}`"
      @click="actions.delete(mcp)"
    >
      <Trash2 class="icon-medium" />
    </ButtonTableIcon>

    <ButtonTableIcon
      :title="$t('General.contractpartnerAccounts')"
      :test-id="`contractpartner-accounts-${mcp.id}`"
      @click="listAccounts(mcp)"
    >
      <Banknote class="icon-medium" />
    </ButtonTableIcon>
  </TableRow>
</template>

<script lang="ts" setup>
import { Banknote, Pencil, Trash2 } from "lucide-vue-next";
import { inject } from "vue";

import ButtonTableIcon from "@/components/common/ButtonTableIcon.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import {
  ContractpartnerActionsKey,
  OpenContractpartnerAccountsActionKey,
} from "@/model/CrudActions";

defineProps<{
  mcp: Contractpartner;
}>();

const actions = inject(ContractpartnerActionsKey)!;
const listAccounts = inject(OpenContractpartnerAccountsActionKey)!;
</script>
