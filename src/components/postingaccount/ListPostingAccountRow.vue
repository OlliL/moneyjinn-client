<template>
  <TableRow>
    <TableCell class="text-left">{{ mpa.name }}</TableCell>
    <TableCell class="text-center">
      <Button variant="ghost" size="icon" @click="editPostingAccount" :title="$t('General.edit')" class="group hover:bg-transparent h-8 w-8">
        <Pencil class="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </Button>
    </TableCell>
    <TableCell class="text-center">
      <Button variant="ghost" size="icon" @click="deletePostingAccount" :title="$t('General.delete')" class="group hover:bg-transparent h-8 w-8">
        <Trash2 class="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
      </Button>
    </TableCell>
  </TableRow>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import { Pencil, Trash2 } from "lucide-vue-next";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";

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
