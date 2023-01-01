<template>
  <CreateUserModalVue
    ref="createUserModalList"
    id-suffix="List"
    @user-created="reloadView"
    @user-updated="reloadView"
  />
  <DeleteUserModalVue
    ref="deleteUserModalList"
    id-suffix="List"
    @user-deleted="reloadView"
  />

  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Benutzerkonten</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-md-9 col-xs-12">
        <table style="margin: 0 auto">
          <tr>
            <td class="text-right pe-2">
              <button
                type="button"
                class="btn btn-primary"
                @click="showCreateUserModal"
              >
                Neu
              </button>
            </td>
            <td>
              <div class="input-group">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="searchAllContent"
                >
                  Alle
                </button>
                <input
                  class="form-control"
                  type="text"
                  placeholder="Suchen nach Name..."
                  v-model="searchString"
                  @input="searchContent"
                />
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-3 col-xs-12">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Gruppe</th>
              <th>Anmeldung erlaubt</th>
              <th>Administrator</th>
              <th>neu</th>
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

<script lang="ts">
import { defineComponent } from "vue";
import type { User } from "@/model/user/User";
import UserControllerHandler from "@/handler/UserControllerHandler";
import ListUserRowVue from "@/components/user/ListUserRow.vue";
import CreateUserModalVue from "@/components/user/CreateUserModal.vue";
import DeleteUserModalVue from "@/components/user/DeleteUserModal.vue";

export default defineComponent({
  name: "ListUsers",
  data() {
    return {
      users: {} as Array<User>,
      allUsers: {} as Array<User>,
      searchString: "",
    };
  },
  async mounted() {
    this.searchString = "";
    this.reloadView();
  },
  computed: {},
  methods: {
    async reloadView() {
      this.allUsers = await UserControllerHandler.fetchAllUser();

      this.allUsers.sort((a, b) => {
        return a.userName.toUpperCase().localeCompare(b.userName.toUpperCase());
      });

      this.searchContent();
    },

    showCreateUserModal() {
      (this.$refs.createUserModalList as typeof CreateUserModalVue)._show();
    },
    editUser(user: User) {
      (this.$refs.createUserModalList as typeof CreateUserModalVue)._show(user);
    },
    deleteUser(user: User) {
      (this.$refs.deleteUserModalList as typeof DeleteUserModalVue)._show(user);
    },
    searchAllContent() {
      this.searchString = "";
      this.searchContent();
    },
    searchContent() {
      let users = this.allUsers;
      if (this.searchString === "") {
        this.users = users;
      }

      const commentUpper = this.searchString.toUpperCase();
      this.users = users.filter((entry) =>
        entry.userName.toUpperCase().includes(commentUpper)
      );
    },
  },
  components: {
    ListUserRowVue,
    CreateUserModalVue,
    DeleteUserModalVue,
  },
});
</script>
