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
  watch,
  type PropType,
  type Ref,
} from "vue";
import { any, type ZodType } from "zod";

import CreatePostingAccountModalVue from "./CreatePostingAccountModal.vue";
import SelectStandard from "../SelectStandard.vue";

import { usePostingAccountStore } from "@/stores/PostingAccountStore";
import { useUserSessionStore } from "@/stores/UserSessionStore";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";

const props = defineProps({
  modelValue: {
    type: Number,
    required: false,
  },
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

const postingAccountId: Ref<number | undefined> = ref(undefined);
const createPostingAccountModal = useTemplateRef<
  typeof CreatePostingAccountModalVue
>("createPostingAccountModal");
const userIsAdmin = ref(false);
const postingAccountStore = usePostingAccountStore();
const emit = defineEmits(["update:modelValue"]);

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

const postingAccountCreated = (mcs: PostingAccount) => {
  postingAccountId.value = mcs.id;
};

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      postingAccountId.value = newVal;
    }
  },
  { immediate: true },
);

watch(postingAccountId, (newVal, oldVal) => {
  if (newVal != oldVal) {
    postingAccountId.value = newVal;
    emit("update:modelValue", postingAccountId.value);
  }
});
</script>
