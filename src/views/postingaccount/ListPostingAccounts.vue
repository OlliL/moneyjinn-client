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

  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("General.postingAccounts") }}</h4>
    </div>

    <DivFilter
      v-model="searchString"
      :showValidToggle="false"
      :placeholder="$t('PostingAccount.searchBy')"
      @createClicked="showCreatePostingAccountModal"
    />

    <ListPostingAccountsMobile
      :posting-accounts="postingAccounts"
      @delete-posting-account="deletePostingAccount"
      @edit-posting-account="editPostingAccount"
    />

    <ListPostingAccountsDesktop
      :posting-accounts="postingAccounts"
      @delete-posting-account="deletePostingAccount"
      @edit-posting-account="editPostingAccount"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef, watch } from "vue";

import DivFilter from "@/components/DivFilter.vue";
import CreatePostingAccountModalVue from "@/components/postingaccount/CreatePostingAccountModal.vue";
import DeletePostingAccountModalVue from "./elements/DeletePostingAccountModal.vue";
import ListPostingAccountsDesktop from "./elements/ListPostingAccountsDesktop.vue";
import ListPostingAccountsMobile from "./elements/ListPostingAccountsMobile.vue";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { usePostingAccountStore } from "@/stores/PostingAccountStore";
import { storeToRefs } from "pinia";

const postingAccounts = ref(new Array<PostingAccount>());
const searchString = ref("");

const createPostingAccountModalList = useTemplateRef<
  typeof CreatePostingAccountModalVue
>("createPostingAccountModalList");
const deleteModal =
  useTemplateRef<typeof DeletePostingAccountModalVue>("deleteModal");

const postingAccountStore = usePostingAccountStore();
const searchPostingAccounts = postingAccountStore.searchPostingAccounts;
const { postingAccount } = storeToRefs(postingAccountStore);

const showCreatePostingAccountModal = () => {
  createPostingAccountModalList.value?._show();
};

const deletePostingAccount = (mcs: PostingAccount) => {
  deleteModal.value?._show(mcs);
};

const editPostingAccount = (mcs: PostingAccount) => {
  createPostingAccountModalList.value?._show(mcs);
};

watch(postingAccount, () => {
  searchContent();
  if (postingAccounts.value.length == 0) searchAllContent();
});

watch(searchString, () => {
  searchContent();
});

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
