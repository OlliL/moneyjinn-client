<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form
        @submit.prevent="createPostingAccount"
        :id="'createPostingAccountForm' + idSuffix"
      >
        <div class="container-fluid">
          <DivError :server-errors="serverErrors" />
          <div class="row">
            <div class="col-xs-12">
              <InputStandard
                v-model="mpa.name"
                :validation-schema="schema.name"
                :id="'name' + idSuffix"
                :field-label="$t('General.name')"
              />
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary" @click="resetForm">
        {{ $t("General.reset") }}
      </button>
      <ButtonSubmit
        :button-label="$t('General.save')"
        :form-id="'createPostingAccountForm' + idSuffix"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { string, ZodType } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";

import PostingAccountControllerHandler from "@/handler/PostingAccountControllerHandler";

const { t } = useI18n();

defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
});

const serverErrors = ref(new Array<string>());

const schema: Partial<{ [key in keyof PostingAccount]: ZodType }> = {
  name: string(globErr(t("PostingAccount.validation.name")))
    .min(1)
    .max(60, t("PostingAccount.validation.length.name")),
};

const mpa = ref({} as PostingAccount);
const origMpa = ref({} as PostingAccount | undefined);
const modalComponent = ref();
const emit = defineEmits(["postingAccountCreated", "postingAccountUpdated"]);

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origMpa.value === undefined
    ? t("PostingAccount.title.create")
    : t("PostingAccount.title.update");
});

const resetForm = () => {
  if (origMpa.value) {
    Object.assign(mpa.value, origMpa.value);
  } else {
    mpa.value = {} as PostingAccount;
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = async (_mpa?: PostingAccount) => {
  origMpa.value = _mpa ?? undefined;
  resetForm();
  modalComponent.value._show();
};

const createPostingAccount = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  if (mpa.value.id > 0) {
    //update
    PostingAccountControllerHandler.updatePostingAccount(mpa.value)
      .then(() => {
        modalComponent.value._hide();
        emit("postingAccountUpdated", mpa.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  } else {
    //create
    PostingAccountControllerHandler.createPostingAccount(mpa.value)
      .then((_mpa) => {
        mpa.value = _mpa;
        modalComponent.value._hide();
        emit("postingAccountCreated", mpa.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});
defineExpose({ _show });
</script>
