<template>
  <CreatePostingAccountModalVue
    ref="createPostingAccountModalList"
    id-suffix="List"
    @postingAccount-created="postingAccountCreated"
  />
  <DeletePostingAccountModalVue
    ref="deleteModal"
    @postingAccount-deleted="postingAccountDeleted"
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
import router, { Routes } from "@/router";
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
      dataLoaded: false,
      letters: {} as Array<string>,
      postingAccounts: {} as Array<PostingAccount>,
    };
  },
  props: {
    letter: {
      type: String,
      default: "",
    },
  },
  async mounted() {
    this.loadData(this.$props.letter);
    this.dataLoaded = true;
  },
  computed: {
    ...mapState(useUserSessionStore, ["getUserId"]),
  },
  methods: {
    ...mapActions(usePostingAccountStore, ["getPostingAccountLetters"]),
    ...mapActions(usePostingAccountStore, ["getPostingAccountForLetter"]),
    reloadView() {
      this.loadData(this.$props.letter);
    },
    async loadData(letter: string) {
      this.letters = await this.getPostingAccountLetters();
      this.postingAccounts = this.getPostingAccountForLetter(letter);
      if (this.postingAccounts.length === 0) this.selectLetter("");
    },
    selectLetter(letter: string) {
      router.push({
        name: Routes.ListPostingAccounts,
        params: { letter: letter },
      });
      this.loadData(letter);
    },
    showCreatePostingAccountModal() {
      (
        this.$refs
          .createPostingAccountModalList as typeof CreatePostingAccountModalVue
      )._show();
    },
    postingAccountCreated() {
      this.reloadView();
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
    postingAccountDeleted() {
      this.reloadView();
    },
  },
  components: {
    CreatePostingAccountModalVue,
    ListPostingAccountRowVue,
    DeletePostingAccountModalVue,
  },
});
</script>
