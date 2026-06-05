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

    <DivError :server-errors="serverErrors" />

    <ListUsersMobile :users="users" />

    <ListUsersDesktop :users="users" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, provide, ref, watch } from "vue";

import DivError from "@/components/common/DivError.vue";
import DivFilter from "@/components/common/DivFilter.vue";
import useCreateUserModalStore from "./elements/CreateUserModal.store";
import useDeleteUserModalStore from "./elements/DeleteUserModal.store";
import CreateUserModal from "./elements/CreateUserModal.vue";
import DeleteUserModal from "./elements/DeleteUserModal.vue";
import ListUsersDesktop from "./elements/ListUsersDesktop.vue";
import ListUsersMobile from "./elements/ListUsersMobile.vue";

import { UserActionsKey, type CrudActions } from "@/model/CrudActions";
import type { User } from "@/model/user/User";

import UserService from "@/service/UserService";
import { handleBackendError } from "@/tools/views/HandleBackendError";

const serverErrors = ref(new Array<string>());

const users = ref(new Array<User>());
const allUsers = ref(new Array<User>());
const searchString = ref("");
const { openCreateUser, openEditUser } = useCreateUserModalStore();
const { openDeleteUser } = useDeleteUserModalStore();

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
