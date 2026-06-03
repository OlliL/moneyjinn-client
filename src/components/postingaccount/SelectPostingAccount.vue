<template>
  <CreatePostingAccountModalVue
    ref="createPostingAccountModal"
    :id-suffix="idSuffix"
    @posting-account-created="postingAccountCreated"
  />

  <SelectStandard
    v-model="postingAccountId"
    :validation-schema="validationSchema"
    :validation-schema-ref="validationSchemaRef"
    :id="'postingAccount' + idSuffix"
    :field-label="fieldLabel"
    :select-box-values="selectBoxValues"
  >
    <template #icon v-if="userIsAdmin"
      ><SquarePlus @click="showCreatePostingAccountModal" class="icon-medium"
    /></template>
  </SelectStandard>
</template>
<script lang="ts" setup>
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { usePostingAccountStore } from "@/stores/PostingAccountStore";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { SquarePlus } from "lucide-vue-next";
import { computed, useTemplateRef, type PropType, type Ref } from "vue";
import { any, type ZodType } from "zod";
import SelectStandard from "../common/SelectStandard.vue";
import CreatePostingAccountModalVue from "./CreatePostingAccountModal.vue";

const postingAccountId = defineModel({ type: Number });

const props = withDefaults(defineProps<{
    validationSchema?: ZodType;
    validationSchemaRef?: Ref<ZodType>;
    fieldLabel: string;
    idSuffix?: string;
}>(), {
  validationSchema: () => any().optional(),
  idSuffix: ""
});

const createPostingAccountModal = useTemplateRef<
  typeof CreatePostingAccountModalVue
>("createPostingAccountModal");
const userSessionStore = useUserSessionStore();
const userIsAdmin = computed(() => userSessionStore.isAdmin);
const postingAccountStore = usePostingAccountStore();

const selectBoxValues = computed(
  () => postingAccountStore.getAsSelectBoxValues,
);

const showCreatePostingAccountModal = () => {
  createPostingAccountModal.value?._show();
};

const postingAccountCreated = (mpa: PostingAccount) => {
  postingAccountId.value = mpa.id;
};
</script>
