<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body>
      <form
        @submit.prevent="createPostingAccount"
        :id="'createPostingAccountForm' + idSuffix"
        class="space-y-6"
      >
        <DivError :server-errors="serverErrors" />

        <div class="form-section space-y-4">
          <InputStandard
            v-model="mpa.name"
            :validation-schema="schema.name"
            :id="'name' + idSuffix"
            :field-label="$t('General.name')"
          />
        </div>
      </form>
    </template>
    <template #footer>
      <Button
        type="button"
        variant="secondary"
        class="button-with-icon"
        @click="resetForm"
      >
        <Undo2 class="icon-small" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        :form-id="'createPostingAccountForm' + idSuffix"
      >
        <template #icon><Save class="icon-small" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import PostingAccountService from "@/service/PostingAccountService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";
import { Save, Undo2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { computed, ref, toRaw, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { string, ZodType } from "zod";
import ButtonSubmit from "../common/ButtonSubmit.vue";
import DivError from "../common/DivError.vue";
import InputStandard from "../common/InputStandard.vue";
import ModalVue from "../common/Modal.vue";

const { t } = useI18n();

defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
});

const serverErrors = ref(new Array<string>());
const mpa = ref({} as PostingAccount);
const origMpa = ref({} as PostingAccount | undefined);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");

const emit = defineEmits(["postingAccountCreated", "postingAccountUpdated"]);

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

const _show = (_mpa?: PostingAccount) => {
  origMpa.value = _mpa ?? undefined;
  resetForm();
  modalComponent.value?._show();
};

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

      modalComponent.value?._hide();
      emit(
        isUpdate ? "postingAccountUpdated" : "postingAccountCreated",
        mpa.value,
      );
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});

defineExpose({ _show });
</script>
