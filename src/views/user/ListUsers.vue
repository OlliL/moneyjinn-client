<template>
  <CreateUserModalVue
    ref="createUserModalList"
    id-suffix="List"
    @user-created="userCreated"
    @user-updated="userUpdated"
  />
  <DeleteUserModalVue
    ref="deleteUserModalList"
    id-suffix="List"
    @user-deleted="userDeleted"
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
              <nav aria-label="Start letter navigation" v-if="dataLoaded">
                <ul class="pagination month-selection">
                  <li class="page-item">
                    <a
                      :class="
                        $props.letter === '' ? 'page-link active' : 'page-link'
                      "
                      href="#"
                      @click="selectLetter('')"
                      >Alle</a
                    >
                  </li>
                  <li class="page-item" v-for="letter in letters" :key="letter">
                    <a
                      :class="
                        $props.letter === letter
                          ? 'page-link active'
                          : 'page-link'
                      "
                      href="#"
                      @click="selectLetter(letter)"
                      >{{ letter }}</a
                    >
                  </li>
                </ul>
              </nav>
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
              <th colspan="2"></th>
            </tr>
            <ListUserRowVue
              v-for="user in users"
              :key="user.id"
              :user="user"
              @edit-user="editUser"
              @delete-user="deleteUser"
            />
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import router, { Routes } from "@/router";
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
      dataLoaded: false,
      letters: {} as Array<string>,
      users: {} as Array<User>,
      allUsers: {} as Array<User>,
    };
  },
  props: {
    letter: {
      type: String,
      default: "",
    },
  },
  async mounted() {
    this.reloadView();
  },
  computed: {},
  methods: {
    async reloadView() {
      const userTransporter = await UserControllerHandler.fetchAllUser();
      this.allUsers = userTransporter.users;

      this.allUsers.sort((a, b) => {
        return a.userName.toUpperCase().localeCompare(b.userName.toUpperCase());
      });

      const letters = this.allUsers.map((entry) =>
        entry.userName.substring(0, 1).toUpperCase()
      );
      const uniqueLetters = letters
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();
      this.letters = uniqueLetters;

      this.loadData(this.$props.letter);
    },
    async loadData(letter: string) {
      this.dataLoaded = false;
      if (letter === "") {
        this.users = this.allUsers;
      } else {
        this.users = this.allUsers.filter(
          (entry) => entry.userName.substring(0, 1).toUpperCase() === letter
        );
      }

      this.dataLoaded = true;
    },
    selectLetter(letter: string) {
      router.push({
        name: Routes.ListUsers,
        params: { letter: letter },
      });
      this.loadData(letter);
    },
    showCreateUserModal() {
      (this.$refs.createUserModalList as typeof CreateUserModalVue)._show();
    },
    userCreated() {
      this.reloadView();
    },
    editUser(user: User) {
      (this.$refs.createUserModalList as typeof CreateUserModalVue)._show(user);
    },
    userUpdated() {
      this.reloadView();
    },
    deleteUser(user: User) {
      (this.$refs.deleteUserModalList as typeof DeleteUserModalVue)._show(user);
    },
    userDeleted() {
      this.reloadView();
    },
  },
  components: {
    ListUserRowVue,
    CreateUserModalVue,
    DeleteUserModalVue,
  },
});
</script>
