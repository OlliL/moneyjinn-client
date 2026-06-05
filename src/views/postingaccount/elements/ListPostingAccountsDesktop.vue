<template>
  <div data-testid="posting-account-desktop-table" class="hidden md:block">
    <DivContentTable class="max-w-sm">
      <TableHeader>
        <TableRow>
          <TableHead class="table-head-cell w-full">
            {{ $t("General.name") }}
          </TableHead>
          <TableHead colspan="2"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-if="postingAccounts.length === 0"
          data-testid="posting-account-empty-desktop"
        >
          <TableCell colspan="3" class="text-center text-muted-foreground">
            {{ $t("General.noEntries") }}
          </TableCell>
        </TableRow>
        <ListPostingAccountRowVue
          v-for="mpa in postingAccounts"
          :key="mpa.id"
          :mpa="mpa"
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
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import ListPostingAccountRowVue from "./ListPostingAccountRow.vue";

defineProps<{
  postingAccounts: PostingAccount[];
}>();
</script>
