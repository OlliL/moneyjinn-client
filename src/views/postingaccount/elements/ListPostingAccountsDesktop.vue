<template>
  <div data-testid="posting-account-desktop-table" class="hidden md:block">
    <DivContentTable class="max-w-sm">
      <TableHeader>
        <TableRow>
          <TableHead class="font-bold border-r text-foreground text-center w-full">
            {{ $t("General.name") }}
          </TableHead>
          <TableHead colspan="2"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
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
import DivContentTable from "@/components/DivContentTable.vue";
import ListPostingAccountRowVue from "./ListPostingAccountRow.vue";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import type { PropType } from "vue";

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

