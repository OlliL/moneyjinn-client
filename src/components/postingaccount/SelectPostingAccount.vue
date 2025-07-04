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
    <template #icon
      ><span
        class="input-group-text"
        @click="showCreatePostingAccountModal"
        v-if="userIsAdmin"
        ><i class="bi bi-plus"></i></span
    ></template>
  </SelectStandard>
</template>
<script lang="ts" setup>
import {
  computed,
  onMounted,
  ref,
  useTemplateRef,
  type PropType,
  type Ref,
} from "vue";
import { any, type ZodType } from "zod";

import CreatePostingAccountModalVue from "./CreatePostingAccountModal.vue";
import SelectStandard from "../SelectStandard.vue";

import { usePostingAccountStore } from "@/stores/PostingAccountStore";
import { useUserSessionStore } from "@/stores/UserSessionStore";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";

const postingAccountId = defineModel({ type: Number });

const props = defineProps({
  validationSchema: {
    type: Object as PropType<ZodType>,
    required: false,
    default: any().optional(),
  },
  validationSchemaRef: {
    type: Object as PropType<Ref<ZodType>>,
    required: false,
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

const createPostingAccountModal = useTemplateRef<
  typeof CreatePostingAccountModalVue
>("createPostingAccountModal");
const userIsAdmin = ref(false);
const postingAccountStore = usePostingAccountStore();

const selectBoxValues = computed(
  () => postingAccountStore.getAsSelectBoxValues,
);

onMounted(() => {
  const userSessionStore = useUserSessionStore();
  userIsAdmin.value = userSessionStore.isAdmin;
});

const showCreatePostingAccountModal = () => {
  createPostingAccountModal.value?._show();
};

const postingAccountCreated = (mpa: PostingAccount) => {
  postingAccountId.value = mpa.id;
};
</script>
