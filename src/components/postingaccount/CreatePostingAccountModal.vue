<template>
  <ModalVue
    :title="title"
    max-width="max-w-md"
    id-suffix="CreatePostingAccount"
    v-model:open="open"
  >
    <template #body>
      <form
        @submit.prevent="createPostingAccount"
        id="createPostingAccountForm-CreatePostingAccount"
        class="space-y-6"
      >
        <DivError :server-errors="serverErrors" />

        <div class="form-section space-y-4">
          <InputStandard
            v-model="mpa.name"
            :validation-schema="schema.name"
            id="name-CreatePostingAccount"
            :field-label="$t('General.name')"
          />
        </div>
      </form>
    </template>
    <template #footer>
      <Button
        type="button"
        variant="secondary"
        class="button-with-icon hidden md:flex"
        data-testid="createPostingAccountResetButton"
        @click="resetForm"
      >
        <Undo2 class="icon-medium" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        form-id="createPostingAccountForm-CreatePostingAccount"
        test-id="createPostingAccountSaveButton"
      >
        <template #icon><Save class="icon-medium" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import PostingAccountService from "@/service/PostingAccountService";
import { useCreatePostingAccountModalStore } from "./CreatePostingAccountModal.store";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";
import { Save, Undo2 } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import { computed, ref, toRaw, watch } from "vue";
import { useI18n } from "vue-i18n";
import { string, ZodType } from "zod";
import ButtonSubmit from "../common/ButtonSubmit.vue";
import DivError from "../common/DivError.vue";
import InputStandard from "../common/InputStandard.vue";
import ModalVue from "../common/Modal.vue";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());
const mpa = ref({} as PostingAccount);
const origMpa = ref({} as PostingAccount | undefined);
const { open, postingAccount, onDone } = storeToRefs(
  useCreatePostingAccountModalStore(),
);

const emit = defineEmits<{
  postingAccountCreated: [postingAccount: PostingAccount];
  postingAccountUpdated: [postingAccount: PostingAccount];
}>();

const { handleSubmit, values, setFieldTouched } = useForm();

const schema: Partial<{ [key in keyof PostingAccount]: ZodType }> = {
  name: string(globErr(t("PostingAccount.validation.name")))
    .min(1)
    .max(100, t("PostingAccount.validation.length.name")),
};

const title = computed(() => {
  return origMpa.value === undefined
    ? t("PostingAccount.title.create")
    : t("PostingAccount.title.update");
});

const resetForm = () => {
  if (origMpa.value) {
    mpa.value = structuredClone(toRaw(origMpa.value))!;
  } else {
    mpa.value = {} as PostingAccount;
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

// Combined watcher for open and postingAccount state
watch(
  [open, postingAccount],
  ([isVisible, entry]) => {
    if (isVisible) {
      origMpa.value = entry;
      resetForm();
    }
  },
  { immediate: true },
);

const createPostingAccount = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  const serviceCall =
    mpa.value.id > 0
      ? PostingAccountService.updatePostingAccount(mpa.value)
      : PostingAccountService.createPostingAccount(mpa.value);

  serviceCall
    .then((result) => {
      const isUpdate = mpa.value.id > 0;
      if (!isUpdate) mpa.value = result as PostingAccount;

      open.value = false;
      onDone.value?.(mpa.value);
      isUpdate
        ? emit("postingAccountUpdated", mpa.value)
        : emit("postingAccountCreated", mpa.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});
</script>
