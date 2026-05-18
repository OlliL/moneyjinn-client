<template>
  <TableRow>
    <TableCell class="text-left border-r">{{ mpa.name }}</TableCell>
    <TableActionButton :title="$t('General.edit')" @click="editPostingAccount">
      <Pencil class="h-4 w-4" />
    </TableActionButton>
    <TableActionButton
      :title="$t('General.delete')"
      @click="deletePostingAccount"
    >
      <Trash2 class="h-4 w-4" />
    </TableActionButton>
  </TableRow>
</template>

<script lang="ts" setup>
import { TableCell, TableRow } from "@/components/ui/table";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";
import TableActionButton from "../TableActionButton.vue";

const props = defineProps({
  mpa: {
    type: Object as PropType<PostingAccount>,
    required: true,
  },
});

const emit = defineEmits(["deletePostingAccount", "editPostingAccount"]);

const deletePostingAccount = () => {
  emit("deletePostingAccount", props.mpa);
};
const editPostingAccount = () => {
  emit("editPostingAccount", props.mpa);
};
</script>
