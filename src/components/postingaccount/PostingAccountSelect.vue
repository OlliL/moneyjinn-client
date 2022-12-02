<template>
  <CreatePostingAccountModalVue
    ref="createPostingAccountModal"
    @posting-account-created="postingAccountCreated"
  />

  <div class="input-group">
    <div class="form-floating">
      <select
        v-model="postingAccountId"
        id="postingAccount"
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

      <label for="postingAccount" :style="'color: ' + fieldColor">{{
        fieldLabel
      }}</label>
    </div>
    <span
      class="input-group-text"
      role="button"
      @click="showCreatePostingAccountModal"
      ><i class="bi bi-plus"></i
    ></span>
  </div>
</template>
<script lang="ts">
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { usePostingAccountStore } from "@/stores/PostingAccountStore";
import CreatePostingAccountModalVue from "../postingaccount/CreatePostingAccountModal.vue";

import { mapActions } from "pinia";
import { defineComponent } from "vue";

//FIXME: only show PostingAccount "+" when user is admin

export default defineComponent({
  name: "PostingAccountSelect",
  data() {
    return { postingAccountId: 0 };
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
    this.initPostingAccountStore();
  },
  methods: {
    ...mapActions(usePostingAccountStore, ["initPostingAccountStore"]),
    ...mapActions(usePostingAccountStore, ["addPostingAccountToStore"]),
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
      this.addPostingAccountToStore(mpa);
      this.postingAccountId = mpa.id;
    },
  },
  components: {
    CreatePostingAccountModalVue,
  },
});
</script>
