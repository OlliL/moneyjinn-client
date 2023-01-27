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

<script lang="ts" setup>
import { onMounted, ref } from "vue";

import { usePostingAccountStore } from "@/stores/PostingAccountStore";

import CreatePostingAccountModalVue from "@/components/postingaccount/CreatePostingAccountModal.vue";
import DeletePostingAccountModalVue from "@/components/postingaccount/DeletePostingAccountModal.vue";
import ListPostingAccountRowVue from "@/components/postingaccount/ListPostingAccountRow.vue";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";

const postingAccounts = ref(new Array<PostingAccount>());
const searchString = ref("");

const createPostingAccountModalList = ref();
const deleteModal = ref();

const searchPostingAccounts = usePostingAccountStore().searchPostingAccounts;

const showCreatePostingAccountModal = () => {
  createPostingAccountModalList.value._show();
};

const deletePostingAccount = (mcs: PostingAccount) => {
  deleteModal.value._show(mcs);
};

const editPostingAccount = (mcs: PostingAccount) => {
  createPostingAccountModalList.value._show(mcs);
};

const searchAllContent = () => {
  searchString.value = "";
  searchContent();
};

const searchContent = () => {
  searchPostingAccounts(searchString.value).then((_postingAccounts) => {
    postingAccounts.value = _postingAccounts;
  });
};

onMounted(() => {
  searchAllContent();
});
</script>
