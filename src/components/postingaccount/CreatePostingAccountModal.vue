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
        <div class="form-section space-y-4">
          <InputStandard
            v-model="mData.name"
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
        @click="resetForm(values, setFieldTouched)"
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
import { globErr } from "@/tools/views/ZodUtil";
import { Save, Undo2 } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import { useI18n } from "vue-i18n";
import { string, ZodType } from "zod";
import ButtonSubmit from "../common/ButtonSubmit.vue";
import InputStandard from "../common/InputStandard.vue";
import ModalVue from "../common/Modal.vue";
import { useCreatePostingAccountModalStore } from "./CreatePostingAccountModal.store";

const { t } = useI18n();
const store = useCreatePostingAccountModalStore();
const { open, mData, title } = storeToRefs(store);
const { resetForm, save } = store;
const { handleSubmit, values, setFieldTouched } = useForm();

const schema: Partial<{ [key in keyof PostingAccount]: ZodType }> = {
  name: string(globErr(t("PostingAccount.validation.name")))
    .min(1)
    .max(100, t("PostingAccount.validation.length.name")),
};
const createPostingAccount = save(handleSubmit);
</script>
