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
          @delete-postingAccount="deletePostingAccount"
          @edit-postingAccount="editPostingAccount"
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
import type { PropType } from "vue";
import ListPostingAccountRowVue from "./ListPostingAccountRow.vue";

defineProps({
  postingAccounts: {
    type: Array as PropType<PostingAccount[]>,
    required: true,
  },
});

const emit = defineEmits(["deletePostingAccount", "editPostingAccount"]);

const deletePostingAccount = (mpa: PostingAccount) => {
  emit("deletePostingAccount", mpa);
};

const editPostingAccount = (mpa: PostingAccount) => {
  emit("editPostingAccount", mpa);
};
</script>
