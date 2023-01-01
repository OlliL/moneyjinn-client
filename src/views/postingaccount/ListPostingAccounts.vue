<template>
  <CreatePostingAccountModalVue
    ref="createPostingAccountModalList"
    id-suffix="List"
    @postingAccount-created="searchContent"
    @posting-account-updated="searchContent"
  />
  <DeletePostingAccountModalVue
    ref="deleteModal"
    @postingAccount-deleted="searchContent"
  />

  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Buchungskonten</h4>
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
                @click="showCreatePostingAccountModal"
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
              <th colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <ListPostingAccountRowVue
              v-for="mpa in postingAccounts"
              :key="mpa.id"
              :mpa="mpa"
              @delete-postingAccount="deletePostingAccount"
              @edit-postingAccount="editPostingAccount"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { usePostingAccountStore } from "@/stores/PostingAccountStore";
import { defineComponent } from "vue";
import { mapActions, mapState } from "pinia";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import CreatePostingAccountModalVue from "@/components/postingaccount/CreatePostingAccountModal.vue";
import ListPostingAccountRowVue from "@/components/postingaccount/ListPostingAccountRow.vue";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import DeletePostingAccountModalVue from "@/components/postingaccount/DeletePostingAccountModal.vue";
export default defineComponent({
  name: "ListPostingAccounts",
  data() {
    return {
      postingAccounts: {} as Array<PostingAccount>,
      searchString: "",
    };
  },
  async mounted() {
    this.searchAllContent();
  },
  computed: {
    ...mapState(useUserSessionStore, ["getUserId"]),
  },
  methods: {
    ...mapActions(usePostingAccountStore, ["searchPostingAccounts"]),
    showCreatePostingAccountModal() {
      (
        this.$refs
          .createPostingAccountModalList as typeof CreatePostingAccountModalVue
      )._show();
    },
    deletePostingAccount(mpa: PostingAccount) {
      (this.$refs.deleteModal as typeof DeletePostingAccountModalVue)._show(
        mpa
      );
    },
    editPostingAccount(mpa: PostingAccount) {
      (
        this.$refs
          .createPostingAccountModalList as typeof CreatePostingAccountModalVue
      )._show(mpa);
    },
    searchAllContent() {
      this.searchString = "";
      this.searchContent();
    },
    async searchContent() {
      this.postingAccounts = await this.searchPostingAccounts(
        this.searchString
      );
    },
  },
  components: {
    CreatePostingAccountModalVue,
    ListPostingAccountRowVue,
    DeletePostingAccountModalVue,
  },
});
</script>
