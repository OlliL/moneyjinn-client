<template>
  <TableRow :data-testid="`posting-account-row-${mpa.id}`">
    <TableCell class="text-left border-r">{{ mpa.name }}</TableCell>
    <ButtonTableIcon
      :title="$t('General.edit')"
      :test-id="`posting-account-edit-${mpa.id}`"
      @click="editPostingAccount"
    >
      <Pencil class="icon-medium" />
    </ButtonTableIcon>
    <ButtonTableIcon
      :title="$t('General.delete')"
      :test-id="`posting-account-delete-${mpa.id}`"
      @click="deletePostingAccount"
    >
      <Trash2 class="icon-medium" />
    </ButtonTableIcon>
  </TableRow>
</template>

<script lang="ts" setup>
import ButtonTableIcon from "@/components/common/ButtonTableIcon.vue";
import { TableCell, TableRow } from "@/components/ui/table";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { Pencil, Trash2 } from "lucide-vue-next";

const props = defineProps<{
  mpa: PostingAccount;
}>();

const emit = defineEmits<{
  deletePostingAccount: [postingAccount: PostingAccount];
  editPostingAccount: [postingAccount: PostingAccount];
}>();

const deletePostingAccount = () => {
  emit("deletePostingAccount", props.mpa);
};
const editPostingAccount = () => {
  emit("editPostingAccount", props.mpa);
};
</script>
