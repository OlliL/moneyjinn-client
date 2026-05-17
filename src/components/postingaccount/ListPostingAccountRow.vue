<template>
  <TableRow>
    <TableCell class="text-left border">{{ mpa.name }}</TableCell>
    <TableCell class="w-0 border whitespace-nowrap text-center p-0">
      <Button
        variant="ghost"
        size="icon"
        @click="editPostingAccount"
        :title="$t('General.edit')"
        class="h-8 w-8 cursor-pointer"
      >
        <Pencil class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell class="w-0 border whitespace-nowrap text-center p-0">
      <Button
        variant="ghost"
        size="icon"
        @click="deletePostingAccount"
        :title="$t('General.delete')"
        class="h-8 w-8 cursor-pointer"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </TableCell>
  </TableRow>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

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
