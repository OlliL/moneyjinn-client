<template>
  <div data-testid="contractpartner-desktop-table" class="hidden md:block">
    <DivContentTable class="max-w-5xl">
      <TableHeader>
        <TableRow>
          <TableHead class="table-head-cell">
            {{ $t("General.name") }}
          </TableHead>
          <TableHead class="table-head-cell">
            {{ $t("General.validFrom") }}
          </TableHead>
          <TableHead class="table-head-cell">
            {{ $t("General.validTil") }}
          </TableHead>
          <TableHead class="table-head-cell">
            {{ $t("Contractpartner.moneyflowComment") }}
          </TableHead>
          <TableHead class="table-head-cell">
            {{ $t("General.postingAccount") }}
          </TableHead>
          <TableHead colspan="3"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-if="contractpartners.length === 0"
          data-testid="contractpartner-empty-desktop"
        >
          <TableCell colspan="8" class="text-center text-muted-foreground">
            {{ $t("General.noEntries") }}
          </TableCell>
        </TableRow>
        <ListContractpartnerRowVue
          v-for="mcp in contractpartners"
          :key="mcp.id"
          v-memo="[mcp.id]"
          :mcp="mcp"
        />
      </TableBody>
    </DivContentTable>
  </div>
</template>

<script lang="ts" setup>
import DivContentTable from "@/components/common/DivContentTable.vue";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import ListContractpartnerRowVue from "./ListContractpartnerRow.vue";

defineProps<{
  contractpartners: readonly Contractpartner[];
}>();
</script>
