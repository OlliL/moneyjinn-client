<template>
  <CreateUserModalVue
    ref="createUserModalList"
    id-suffix="List"
    @user-created="reloadView"
    @user-updated="reloadView"
  />
  <DeleteUserModalVue
    ref="deleteModal"
    id-suffix="List"
    @user-deleted="reloadView"
  />

  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("General.users") }}</h4>
    </div>

    <DivFilter
      v-model="searchString"
      :showValidToggle="false"
      :placeholder="$t('User.searchBy')"
      @createClicked="showCreateUserModal"
    />

    <DivError :server-errors="serverErrors" />

    <DivContentTable>
      <TableHeader>
        <TableRow>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("General.name")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("General.group")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("User.role")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("User.new")
          }}</TableHead>
          <TableHead class="border" colspan="2"></TableHead>
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
import { onMounted, ref, watch, useTemplateRef } from "vue";

import DivContentTable from "@/components/DivContentTable.vue";
import DivError from "@/components/DivError.vue";
import DivFilter from "@/components/DivFilter.vue";
import CreateUserModalVue from "@/components/user/CreateUserModal.vue";
import DeleteUserModalVue from "@/components/user/DeleteUserModal.vue";
import ListUserRowVue from "@/components/user/ListUserRow.vue";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { User } from "@/model/user/User";

import UserService from "@/service/UserService";
import { handleBackendError } from "@/tools/views/HandleBackendError";

const serverErrors = ref(new Array<string>());

const users = ref(new Array<User>());
const allUsers = ref(new Array<User>());
const searchString = ref("");

const createUserModalList = useTemplateRef<typeof CreateUserModalVue>(
  "createUserModalList",
);
const deleteModal = useTemplateRef<typeof DeleteUserModalVue>("deleteModal");

const showCreateUserModal = () => {
  createUserModalList.value?._show();
};

const deleteUser = (mcs: User) => {
  deleteModal.value?._show(mcs);
};

const editUser = (mcs: User) => {
  createUserModalList.value?._show(mcs);
};

watch(searchString, () => {
  searchContent();
});

const searchContent = () => {
  if (searchString.value === "") {
    users.value = allUsers.value;
    return;
  }

  const commentUpper = searchString.value.toUpperCase();
  users.value = allUsers.value.filter((entry) =>
    entry.userName.toUpperCase().includes(commentUpper),
  );
};

const reloadView = () => {
  serverErrors.value = new Array<string>();

  UserService.fetchAllUser()
    .then((_users) => {
      _users.sort((a, b) => {
        return a.userName.toUpperCase().localeCompare(b.userName.toUpperCase());
      });
      allUsers.value = _users;
      searchContent();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

onMounted(() => {
  searchString.value = "";
  reloadView();
});
</script>
