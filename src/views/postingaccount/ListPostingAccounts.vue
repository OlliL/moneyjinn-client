<template>
  <DeletePostingAccountModal />

  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("General.postingAccounts") }}</h4>
    </div>

    <DivFilter
      v-model="searchString"
      :showValidToggle="false"
      :placeholder="$t('PostingAccount.searchBy')"
      @createClicked="actions.create"
    />

    <ListPostingAccountsMobile :posting-accounts="postingAccounts" />

    <ListPostingAccountsDesktop :posting-accounts="postingAccounts" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, provide, ref, watch } from "vue";

import DivFilter from "@/components/common/DivFilter.vue";
import { useCreatePostingAccountModalStore } from "@/components/postingaccount/CreatePostingAccountModal.store";
import {
  PostingAccountActionsKey,
  type CrudActions,
} from "@/model/CrudActions";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { usePostingAccountStore } from "@/stores/PostingAccountStore";
import { storeToRefs } from "pinia";
import { useDeletePostingAccountModalStore } from "./elements/DeletePostingAccountModal.store";
import DeletePostingAccountModal from "./elements/DeletePostingAccountModal.vue";
import ListPostingAccountsDesktop from "./elements/ListPostingAccountsDesktop.vue";
import ListPostingAccountsMobile from "./elements/ListPostingAccountsMobile.vue";

const postingAccounts = ref(new Array<PostingAccount>());
const searchString = ref("");

const postingAccountStore = usePostingAccountStore();
const searchPostingAccounts = postingAccountStore.searchPostingAccounts;
const { postingAccount } = storeToRefs(postingAccountStore);
const { openDelete: openDeletePostingAccount } =
  useDeletePostingAccountModalStore();
const {
  openCreate: openCreatePostingAccount,
  openEdit: openEditPostingAccount,
} = useCreatePostingAccountModalStore();

const actions: CrudActions<PostingAccount> = {
  create: () => {
    openCreatePostingAccount(searchContent);
  },
  edit: (postingAccountEntry) => {
    openEditPostingAccount(postingAccountEntry, searchContent);
  },
  delete: (postingAccountEntry) =>
    openDeletePostingAccount(postingAccountEntry, searchContent),
};

provide(PostingAccountActionsKey, actions);

watch(postingAccount, () => {
  searchContent();
  if (postingAccounts.value.length == 0) searchAllContent();
});

watch(searchString, () => searchContent());

const searchAllContent = () => {
  searchString.value = "";
  searchContent();
};

const searchContent = () => {
  searchPostingAccounts(searchString.value).then((postingAccountEntries) => {
    postingAccounts.value = postingAccountEntries;
  });
};

onMounted(() => searchAllContent());
</script>
