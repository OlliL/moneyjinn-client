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

  <div class="container mx-auto py-6 space-y-6 text-center">
    <div>
      <h4 class="text-xl font-bold">{{ $t("General.postingAccounts") }}</h4>
    </div>

    <DivFilter
      v-model="searchString"
      :showValidToggle="false"
      :placeholder="$t('PostingAccount.searchBy')"
      @createClicked="showCreatePostingAccountModal"
    />

    <DivContentTable>
      <TableHeader>
        <TableRow>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("General.name")
          }}</TableHead>
          <TableHead class="border" colspan="2"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <ListPostingAccountRowVue
          v-for="mpa in postingAccounts"
          :key="mpa.id"
          :mpa="mpa"
          @delete-postingAccount="deletePostingAccount"
          @edit-postingAccount="editPostingAccount"
        />
      </TableBody>
    </DivContentTable>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef, watch } from "vue";

import { usePostingAccountStore } from "@/stores/PostingAccountStore";

import DivContentTable from "@/components/DivContentTable.vue";
import DivFilter from "@/components/DivFilter.vue";
import CreatePostingAccountModalVue from "@/components/postingaccount/CreatePostingAccountModal.vue";
import DeletePostingAccountModalVue from "@/components/postingaccount/DeletePostingAccountModal.vue";
import ListPostingAccountRowVue from "@/components/postingaccount/ListPostingAccountRow.vue";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
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
