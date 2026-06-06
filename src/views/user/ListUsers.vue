<template>
  <CreateUserModal />
  <DeleteUserModal />

  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("General.users") }}</h4>
    </div>

    <DivFilter
      v-model="searchString"
      :showValidToggle="false"
      :placeholder="$t('User.searchBy')"
      @createClicked="actions.create"
    />

    <ListUsersMobile :users="users" />

    <ListUsersDesktop :users="users" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, provide, ref, watch } from "vue";

import DivFilter from "@/components/common/DivFilter.vue";
import useCreateUserModalStore from "./elements/CreateUserModal.store";
import CreateUserModal from "./elements/CreateUserModal.vue";
import { useDeleteUserModalStore } from "./elements/DeleteUserModal.store";
import DeleteUserModal from "./elements/DeleteUserModal.vue";
import ListUsersDesktop from "./elements/ListUsersDesktop.vue";
import ListUsersMobile from "./elements/ListUsersMobile.vue";

import { UserActionsKey, type CrudActions } from "@/model/CrudActions";
import type { User } from "@/model/user/User";

import UserService from "@/service/UserService";
import { handleBackendError } from "@/tools/views/HandleBackendError";

const users = ref(new Array<User>());
const allUsers = ref(new Array<User>());
const searchString = ref("");
const { openCreateUser, openEditUser } = useCreateUserModalStore();
const { openDelete: openDeleteUser } = useDeleteUserModalStore();

const actions: CrudActions<User> = {
  create: () => openCreateUser(reloadView),
  edit: (userEntry) => openEditUser(userEntry, reloadView),
  delete: (userEntry) => openDeleteUser(userEntry, reloadView),
};

provide(UserActionsKey, actions);

watch(searchString, () => searchContent());

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
  UserService.fetchAllUser()
    .then((_users) => {
      _users.sort((a, b) =>
        a.userName.toUpperCase().localeCompare(b.userName.toUpperCase()),
      );
      allUsers.value = _users;
      searchContent();
    })
    .catch((backendError) => {
      handleBackendError(backendError);
    });
};

onMounted(() => {
  searchString.value = "";
  reloadView();
});
</script>
