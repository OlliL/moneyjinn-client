<template>
  <div data-testid="user-desktop-table" class="hidden md:block">
    <DivContentTable class="max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead class="table-head-cell">{{
            $t("General.name")
          }}</TableHead>
          <TableHead class="table-head-cell">{{
            $t("General.group")
          }}</TableHead>
          <TableHead class="table-head-cell">{{ $t("User.role") }}</TableHead>
          <TableHead class="table-head-cell">{{ $t("User.new") }}</TableHead>
          <TableHead colspan="2"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <ListUserRowVue v-for="user in users" :key="user.id" :user="user" />
      </TableBody>
    </DivContentTable>
  </div>
</template>

<script lang="ts" setup>
import DivContentTable from "@/components/common/DivContentTable.vue";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@/model/user/User";
import ListUserRowVue from "./ListUserRow.vue";

defineProps<{
  users: User[];
}>();
</script>
