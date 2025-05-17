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

  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("General.users") }}</h4>
      </div>
    </div>

    <DivFilter
      v-model="searchString"
      :showValidToggle="false"
      :placeholder="$t('User.searchBy')"
      @createClicked="showCreateUserModal"
    />

    <DivError :server-errors="serverErrors" />

    <DivContentTable clazz="col-xxl-5 col-xs-12">
      <thead>
        <tr>
          <th>{{ $t("General.name") }}</th>
          <th>{{ $t("General.group") }}</th>
          <th>{{ $t("User.role") }}</th>
          <th>{{ $t("User.new") }}</th>
          <th colspan="2"></th>
        </tr>
      </thead>
      <tbody>
        <ListUserRowVue
          v-for="user in users"
          :key="user.id"
          :user="user"
          @edit-user="editUser"
          @delete-user="deleteUser"
        />
      </tbody>
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
