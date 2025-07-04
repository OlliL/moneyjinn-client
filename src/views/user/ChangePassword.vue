<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("User.title.changePassword") }}</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-2">
      <div class="col-xxl-3 col-xl-5 col-md-6 col-xs-12">
        <div class="card w-100 bg-light">
          <div class="card-body">
            <form @submit.prevent="changePassword">
              <div class="container-fluid">
                <DivError :server-errors="serverErrors" />
                <div class="row no-gutters flex-lg-nowrap mb-4">
                  <div class="col-md-12 col-xs-12">
                    <InputStandard
                      v-model="passwordOld"
                      :validation-schema="schema.passwordOld"
                      id="passwordOld"
                      :field-label="$t('User.oldPassword')"
                      field-type="password"
                    />
                  </div>
                </div>
                <div class="row no-gutters flex-lg-nowrap mb-2">
                  <div class="col-md-12 col-xs-12">
                    <InputStandard
                      v-model="password1"
                      :validation-schema-ref="schema.password"
                      id="password1"
                      :field-label="$t('User.newPassword')"
                      field-type="password"
                    />
                  </div>
                </div>
                <div class="row no-gutters flex-lg-nowrap mb-3">
                  <div class="col-md-12 col-xs-12">
                    <InputStandard
                      v-model="password2"
                      :validation-schema-ref="schema.password"
                      id="password2"
                      :field-label="$t('User.passwordVerify')"
                      field-type="password"
                    />
                  </div>
                </div>
                <div class="row no-gutters flex-lg-nowrap mt-2">
                  <div class="col-12">
                    <button type="submit" class="btn btn-primary">
                      {{ $t("General.save") }}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { string, type ZodTypeAny } from "zod";

import router, { Routes } from "@/router";

import DivError from "@/components/DivError.vue";
import InputStandard from "@/components/InputStandard.vue";

import { useUserSessionStore } from "@/stores/UserSessionStore";

import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";

import { ErrorCode, getErrorMessage } from "@/model/ErrorCode";

import UserService from "@/service/UserService";
import { useForm } from "vee-validate";

const { t } = useI18n();

const schema = {
  passwordOld: string(globErr(t("User.validation.passwordOld"))).min(1),
  password: ref(string() as ZodTypeAny),
};

const serverErrors = ref(new Array<string>());
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
  serverErrors.value = new Array<string>();

  const userSessionStore = useUserSessionStore();
  if (userSessionStore.userIsNew) {
    userIsNew.value = true;
  } else {
    userIsNew.value = false;
  }
  if (userIsNew.value) {
    serverErrors.value.push(
      getErrorMessage(ErrorCode.PASSWORD_MUST_BE_CHANGED),
    );
  }
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
});

const changePassword = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  UserService.changePassword(passwordOld.value, password1.value)
    .then(() => {
      const userSessionStore = useUserSessionStore();
      if (userSessionStore.userIsNew) {
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
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});
</script>
