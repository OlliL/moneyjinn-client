<template>
  <TableRow>
    <TableCell class="text-left border py-1 px-2">{{
      user.userName
    }}</TableCell>
    <TableCell class="text-left border py-1 px-2">{{
      user.groupName
    }}</TableCell>
    <TableCell class="text-center border py-1 px-2">{{ role }}</TableCell>
    <TableCell class="text-center border py-1 px-2">
      <SpanBoolean :value="user.userIsNew" />
    </TableCell>
    <TableCell class="w-0 border whitespace-nowrap text-center p-0">
      <Button
        variant="ghost"
        size="icon"
        @click="editUser"
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
        @click="deleteUser"
        :title="$t('General.delete')"
        class="h-8 w-8 cursor-pointer"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </TableCell>
  </TableRow>
</template>
<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { Pencil, Trash2 } from "lucide-vue-next";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import SpanBoolean from "../SpanBoolean.vue";

import type { User } from "@/model/user/User";
import { userRoleNames } from "@/model/user/UserRole";

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },
});

const role = computed(() => {
  return userRoleNames[props.user.role];
});

const emit = defineEmits(["deleteUser", "editUser"]);

const deleteUser = () => {
  emit("deleteUser", props.user);
};
const editUser = () => {
  emit("editUser", props.user);
};
</script>
