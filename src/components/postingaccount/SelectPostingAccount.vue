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
        :class="'form-select form-control ' + errorData.inputClass"
        @input="onInput($event)"
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
        :style="'color: ' + errorData.fieldColor"
        >{{ errorData.fieldLabel }}</label
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
import { computed, onMounted, ref, watch, type PropType } from "vue";

import CreatePostingAccountModalVue from "./CreatePostingAccountModal.vue";

import { usePostingAccountStore } from "@/stores/PostingAccountStore";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { any, type ZodType } from "zod";
import {
  generateErrorDataVeeValidate,
  type ErrorData,
} from "@/tools/views/ErrorData";
import { useField } from "vee-validate";
import { toFieldValidator } from "@vee-validate/zod";

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
const emit = defineEmits(["update:modelValue"]);

const postingAccountArray = computed((): Array<PostingAccount> => {
  const postingAccountStore = usePostingAccountStore();
  return postingAccountStore.getPostingAccount;
});

onMounted(() => {
  const userSessionStore = useUserSessionStore();
  userIsAdmin.value = userSessionStore.isAdmin;
});

const {
  value: fieldValue,
  meta: fieldMeta,
  errorMessage,
  setState,
  handleChange,
} = useField(
  "postincAccount" + props.idSuffix,
  toFieldValidator(props.validationSchema),
  {
    initialValue: props.modelValue,
  }
);

const onInput = (event: any) => {
  setState({ touched: true });
  handleChange(event, true);
  emit("update:modelValue", fieldValue.value);
};

const errorData = computed((): ErrorData => {
  return generateErrorDataVeeValidate(
    fieldMeta.touched,
    props.fieldLabel,
    errorMessage.value
  );
});

const showCreatePostingAccountModal = () => {
  createPostingAccountModal.value._show();
};

const postingAccountCreated = (mcs: PostingAccount) => {
  fieldValue.value = mcs.id;
};

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      postingAccountId.value = newVal ? newVal : 0;
    }
  },
  { immediate: true }
);
</script>
