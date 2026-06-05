<template>
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
import { useCreatePostingAccountModalStore } from "./CreatePostingAccountModal.store";
import { usePostingAccountStore } from "@/stores/PostingAccountStore";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { SquarePlus } from "lucide-vue-next";
import { computed, type Ref } from "vue";
import { any, type ZodType } from "zod";
import SelectStandard from "../common/SelectStandard.vue";

const postingAccountId = defineModel({ type: Number });

const props = withDefaults(
  defineProps<{
    validationSchema?: ZodType;
    validationSchemaRef?: Ref<ZodType>;
    fieldLabel: string;
    idSuffix?: string;
  }>(),
  {
    validationSchema: () => any().optional(),
    idSuffix: "",
  },
);

const userSessionStore = useUserSessionStore();
const userIsAdmin = computed(() => userSessionStore.isAdmin);
const postingAccountStore = usePostingAccountStore();
const { openCreatePostingAccount } = useCreatePostingAccountModalStore();

const selectBoxValues = computed(
  () => postingAccountStore.getAsSelectBoxValues,
);

const showCreatePostingAccountModal = () =>
  openCreatePostingAccount(
    (postingAccountEntry) => (postingAccountId.value = postingAccountEntry.id),
  );
</script>
