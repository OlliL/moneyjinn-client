<template>
  <div data-testid="user-desktop-table" class="hidden md:block">
    <DivContentTable class="max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("General.name")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("General.group")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("User.role")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("User.new")
          }}</TableHead>
          <TableHead colspan="2"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <ListUserRowVue
          v-for="user in users"
          :key="user.id"
          :user="user"
          @edit-user="editUser"
          @delete-user="deleteUser"
        />
      </TableBody>
    </DivContentTable>
  </div>
</template>

<script lang="ts" setup>
import DivContentTable from "@/components/DivContentTable.vue";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ListUserRowVue from "./ListUserRow.vue";
import type { User } from "@/model/user/User";
import type { PropType } from "vue";

defineProps({
  users: {
    type: Array as PropType<User[]>,
    required: true,
  },
});

const emit = defineEmits(["deleteUser", "editUser"]);

const deleteUser = (user: User) => {
  emit("deleteUser", user);
};

const editUser = (user: User) => {
  emit("editUser", user);
};
</script>

