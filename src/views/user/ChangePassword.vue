<template>
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("User.title.changePassword") }}</h4>
    </div>
    <div class="flex justify-center">
      <div
        class="w-full max-w-xl rounded-sm border bg-card text-card-foreground p-4"
      >
        <form @submit.prevent="changePassword" id="changePasswordForm">
          <div class="space-y-4">
            <div>
              <InputStandard
                v-model="passwordOld"
                :validation-schema="schema.passwordOld"
                id="passwordOld"
                :field-label="$t('User.oldPassword')"
                field-type="password"
              />
            </div>
            <div>
              <InputStandard
                v-model="password1"
                :validation-schema-ref="schema.password"
                id="password1"
                :field-label="$t('User.newPassword')"
                field-type="password"
              />
            </div>
            <div>
              <InputStandard
                v-model="password2"
                :validation-schema-ref="schema.password"
                id="password2"
                :field-label="$t('User.passwordVerify')"
                field-type="password"
              />
            </div>
            <div class="flex justify-center">
              <ButtonSubmit
                :button-label="$t('General.save')"
                form-id="changePasswordForm"
                data-testid="change-password-submit"
              >
                <template #icon><Save class="icon-medium" /></template>
              </ButtonSubmit>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { string, type ZodTypeAny } from "zod";

import router, { Routes } from "@/router";

import InputStandard from "@/components/common/InputStandard.vue";

import { useUserSessionStore } from "@/stores/UserSessionStore";

import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";

import { ErrorCode, getErrorMessage } from "@/model/ErrorCode";

import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import UserService from "@/service/UserService";
import { Save } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

const { t } = useI18n();

const schema = {
  passwordOld: string(globErr(t("User.validation.passwordOld"))).min(1),
  password: ref(string() as ZodTypeAny),
};

const passwordOld = ref("");
const password1 = ref("");
const password2 = ref("");
const userIsNew = ref(false);

const { handleSubmit, values, setFieldTouched } = useForm();

watch(
  () => [password1.value, password2.value],
  () => {
    schema.password.value = string(globErr(t("User.validation.password")))
      .min(1)
      .refine(
        () => password1.value == password2.value,
        t("User.validation.passwordNotEqual"),
      );
  },
);

onMounted(() => {
  const userSessionStore = useUserSessionStore();
  if (userSessionStore.userSession.userIsNew) {
    userIsNew.value = true;
  } else {
    userIsNew.value = false;
  }
  if (userIsNew.value) {
    toast.error(getErrorMessage(ErrorCode.PASSWORD_MUST_BE_CHANGED), {
      duration: Infinity,
    });
  }
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
});

const changePassword = handleSubmit(() => {
  UserService.changePassword(passwordOld.value, password1.value)
    .then(() => {
      const userSessionStore = useUserSessionStore();
      if (userSessionStore.userSession.userIsNew) {
        userSessionStore.logout();
        router.push({
          name: Routes.Login,
        });
      } else {
        router.push({
          name: Routes.Home,
        });
      }
    })
    .catch(handleBackendError);
});
</script>
