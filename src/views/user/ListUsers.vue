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

    <div class="row justify-content-md-center">
      <div class="col-md-auto mb-3">
        <div class="row">
          <div class="col-md-auto mb-3">
            <button
              type="button"
              class="btn btn-primary"
              @click="showCreateUserModal"
            >
              {{ $t("General.new") }}
            </button>
          </div>
          <div class="col">
            <div class="input-group">
              <button
                type="button"
                class="btn btn-primary"
                @click="searchAllContent"
              >
                {{ $t("General.all") }}
              </button>
              <input
                class="form-control"
                type="text"
                :placeholder="$t('User.searchBy')"
                v-model="searchString"
                @input="searchContent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <DivError :server-errors="serverErrors" />
    <div class="row justify-content-md-center">
      <div class="col-xxl-5 col-xs-12">
        <table class="table table-striped table-bordered table-hover">
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
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

import CreateUserModalVue from "@/components/user/CreateUserModal.vue";
import DeleteUserModalVue from "@/components/user/DeleteUserModal.vue";
import ListUserRowVue from "@/components/user/ListUserRow.vue";

import type { User } from "@/model/user/User";

import UserService from "@/service/UserService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import DivError from "@/components/DivError.vue";

const serverErrors = ref(new Array<string>());

const users = ref(new Array<User>());
const allUsers = ref(new Array<User>());
const searchString = ref("");

const createUserModalList = ref();
const deleteModal = ref();

const showCreateUserModal = () => {
  createUserModalList.value._show();
};

const deleteUser = (mcs: User) => {
  deleteModal.value._show(mcs);
};

const editUser = (mcs: User) => {
  createUserModalList.value._show(mcs);
};

const searchAllContent = () => {
  searchString.value = "";
  searchContent();
};

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
