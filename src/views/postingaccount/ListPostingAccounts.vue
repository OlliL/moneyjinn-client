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
        <h4>{{ $t("General.postingAccounts") }}</h4>
      </div>
    </div>

    <div class="row justify-content-md-center">
      <div class="col-md-auto mb-3">
        <div class="row">
          <div class="col-md-auto mb-3">
            <button
              type="button"
              class="btn btn-primary"
              @click="showCreatePostingAccountModal"
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
                :placeholder="$t('PostingAccount.searchBy')"
                v-model="searchString"
                @input="searchContent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-md-center">
      <div class="col-md-3 col-xs-12">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>{{ $t("General.name") }}</th>
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
import { onMounted, ref, watch } from "vue";

import { usePostingAccountStore } from "@/stores/PostingAccountStore";

import CreatePostingAccountModalVue from "@/components/postingaccount/CreatePostingAccountModal.vue";
import DeletePostingAccountModalVue from "@/components/postingaccount/DeletePostingAccountModal.vue";
import ListPostingAccountRowVue from "@/components/postingaccount/ListPostingAccountRow.vue";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { storeToRefs } from "pinia";

const postingAccounts = ref(new Array<PostingAccount>());
const searchString = ref("");

const createPostingAccountModalList = ref();
const deleteModal = ref();

const postinAccountStore = usePostingAccountStore();
const searchPostingAccounts = postinAccountStore.searchPostingAccounts;
const { postingAccount } = storeToRefs(postinAccountStore);

watch(postingAccount, () => {
  searchAllContent();
});

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
