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
                field-label="Name"
              />
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary" @click="resetForm">
        r&uuml;cksetzen
      </button>
      <ButtonSubmit
        button-label="Speichern"
        :form-id="'createPostingAccountForm' + idSuffix"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { string, ZodType } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";

import { handleServerError } from "@/tools/views/ThrowError";
import { globErr } from "@/tools/views/ZodUtil";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";

import PostingAccountControllerHandler from "@/handler/PostingAccountControllerHandler";

defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
});

const serverErrors = ref(new Array<string>());

const schema: Partial<{ [key in keyof PostingAccount]: ZodType }> = {
  name: string(globErr("Bitte Name angeben!")).min(1),
};

const mpa = ref({} as PostingAccount);
const origMpa = ref({} as PostingAccount | undefined);
const modalComponent = ref();
const emit = defineEmits(["postingAccountCreated", "postingAccountUpdated"]);

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origMpa.value === undefined
    ? "Buchungskonto hinzufügen"
    : "Buchungskonto bearbeiten";
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
  origMpa.value = _mpa ? _mpa : undefined;
  resetForm();
  modalComponent.value._show();
};

const createPostingAccount = handleSubmit(() => {
  if (mpa.value.id > 0) {
    //update
    PostingAccountControllerHandler.updatePostingAccount(mpa.value).then(
      (validationResult) => {
        if (!handleServerError(validationResult, serverErrors)) {
          modalComponent.value._hide();
          emit("postingAccountUpdated", mpa.value);
        }
      }
    );
  } else {
    //create
    PostingAccountControllerHandler.createPostingAccount(mpa.value).then(
      (postingAccountValidation) => {
        const validationResult = postingAccountValidation.validationResult;

        if (!handleServerError(validationResult, serverErrors)) {
          mpa.value = postingAccountValidation.mpa;
          modalComponent.value._hide();
          emit("postingAccountCreated", mpa.value);
        }
      }
    );
  }
});
defineExpose({ _show });
</script>
