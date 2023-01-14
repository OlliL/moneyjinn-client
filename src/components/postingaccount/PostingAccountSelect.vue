<template>
  <CreatePostingAccountModalVue
    ref="createPostingAccountModal"
    :id-suffix="idSuffix"
    @posting-account-created="postingAccountCreated"
  />

  <div class="input-group">
    <div class="form-floating">
      <select
        v-model="postingAccountId"
        :id="'postingAccount' + idSuffix"
        @change="emitPostingAccountSelected"
        :class="'form-select form-control ' + inputClass"
      >
        <option value="0">&nbsp;</option>
        <option
          v-for="postingAccount of postingAccountArray"
          :key="postingAccount.id"
          :value="postingAccount.id"
        >
          {{ postingAccount.name }}
        </option>
      </select>

      <label
        :for="'postingAccount' + idSuffix"
        :style="'color: ' + fieldColor"
        >{{ fieldLabel }}</label
      >
    </div>
    <span
      class="input-group-text"
      role="button"
      @click="showCreatePostingAccountModal"
      v-if="userIsAdmin"
      ><i class="bi bi-plus"></i
    ></span>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";

import CreatePostingAccountModalVue from "./CreatePostingAccountModal.vue";

import { usePostingAccountStore } from "@/stores/PostingAccountStore";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { useUserSessionStore } from "@/stores/UserSessionStore";

const props = defineProps({
  selectedId: {
    type: Number,
    required: false,
  },
  inputClass: {
    type: String,
    required: true,
  },
  fieldColor: {
    type: String,
    required: true,
  },
  fieldLabel: {
    type: String,
    required: true,
  },
  idSuffix: {
    type: String,
    default: "",
  },
});

const postingAccountId = ref(0);
const createPostingAccountModal = ref();
const userIsAdmin = ref(false);
const emit = defineEmits(["postingAccountSelected"]);

const postingAccountArray = computed((): Array<PostingAccount> => {
  const postingAccountStore = usePostingAccountStore();
  return postingAccountStore.getPostingAccount;
});

onMounted(() => {
  const userSessionStore = useUserSessionStore();
  userIsAdmin.value = userSessionStore.isAdmin;
});

const emitPostingAccountSelected = () => {
  emit(
    "postingAccountSelected",
    postingAccountArray.value.filter((mcs) => {
      return mcs.id === +postingAccountId.value;
    })[0]
  );
};
const showCreatePostingAccountModal = () => {
  createPostingAccountModal.value._show();
};

const postingAccountCreated = (mcs: PostingAccount) => {
  postingAccountId.value = mcs.id;
  emitPostingAccountSelected();
};

watch(
  () => props.selectedId,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      if (newVal != oldVal) postingAccountId.value = newVal ? newVal : 0;
    }
  },
  { immediate: true }
);
</script>
