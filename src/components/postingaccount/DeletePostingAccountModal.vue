<template>
  <ModalVue title="Kapitalquelle l&ouml;schen" ref="modalComponent">
    <template #body>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Name
        </div>
        <div class="text-start col-sm-9">{{ mpa.name }}</div>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-danger"
        @click="deletePostingAccount"
      >
        L&ouml;schen
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import PostingAccountControllerHandler from "@/handler/PostingAccountControllerHandler";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { usePostingAccountStore } from "@/stores/PostingAccountStore";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";

export default defineComponent({
  name: "DeletePostingAccountModal",
  data() {
    return {
      mpa: {} as PostingAccount,
    };
  },
  computed: {},
  methods: {
    async _show(mpa: PostingAccount) {
      this.mpa = mpa;
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    async deletePostingAccount() {
      await PostingAccountControllerHandler.deletePostingAccount(this.mpa.id);
      const postingAccountStore = usePostingAccountStore();
      postingAccountStore.deletePostingAccount(this.mpa);
      (this.$refs.modalComponent as typeof ModalVue)._hide();
      this.$emit("postingAccountDeleted", this.mpa);
    },
  },
  expose: ["_show"],
  emits: ["postingAccountDeleted"],
  components: { ModalVue },
});
</script>
