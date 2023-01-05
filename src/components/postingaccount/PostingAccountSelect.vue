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
<script lang="ts">
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { usePostingAccountStore } from "@/stores/PostingAccountStore";
import CreatePostingAccountModalVue from "../postingaccount/CreatePostingAccountModal.vue";

import { defineComponent } from "vue";
import { useUserSessionStore } from "@/stores/UserSessionStore";

export default defineComponent({
  name: "PostingAccountSelect",
  data() {
    return {
      postingAccountId: 0,
      userIsAdmin: false,
    };
  },
  emits: ["postingAccountSelected"],
  props: {
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
  },
  computed: {
    postingAccountArray(): Array<PostingAccount> {
      const postingAccountStore = usePostingAccountStore();
      return postingAccountStore.getPostingAccount;
    },
  },
  watch: {
    selectedId: {
      handler(newVal: number, oldVal: number) {
        if (newVal != oldVal) this.postingAccountId = newVal;
      },
      immediate: true,
    },
  },
  created() {
    const userSessionStore = useUserSessionStore();
    this.userIsAdmin = userSessionStore.isAdmin;
  },
  methods: {
    emitPostingAccountSelected() {
      this.$emit(
        "postingAccountSelected",
        this.postingAccountArray.filter((mpa) => {
          return mpa.id === +this.postingAccountId;
        })[0]
      );
    },
    showCreatePostingAccountModal() {
      (
        this.$refs
          .createPostingAccountModal as typeof CreatePostingAccountModalVue
      )._show();
    },
    postingAccountCreated(mpa: PostingAccount) {
      this.postingAccountId = mpa.id;
      this.emitPostingAccountSelected();
    },
  },
  components: {
    CreatePostingAccountModalVue,
  },
});
</script>
