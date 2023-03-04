<template>
  <form @submit.prevent="handleLogin">
    <div
      class="d-flex flex-column min-vh-100 justify-content-center align-items-center"
    >
      <div class="card">
        <div class="card-header text-center p-3">
          <h4>{{ $t("LoginView.welcome") }}</h4>
        </div>
        <div class="card-body">
          <div class="text-center p-3">
            <h5>
              {{ $t("LoginView.enterYourData") }}
            </h5>
          </div>
          <DivError :server-errors="serverErrors" />
          <div class="row no-gutters flex-lg-nowrap mb-2">
            <InputStandard
              v-model="username"
              :validation-schema="schema.username"
              id="username"
              :field-label="$t('General.username')"
              :focus="true"
            >
              <template #icon
                ><span class="input-group-text"
                  ><i class="bi bi-person"></i></span
              ></template>
            </InputStandard>
          </div>
          <div class="row no-gutters flex-lg-nowrap mb-2">
            <InputStandard
              v-model="password"
              :validation-schema="schema.password"
              field-type="password"
              id="password"
              :field-label="$t('General.password')"
            >
              <template #icon
                ><span class="input-group-text"><i class="bi bi-lock"></i></span
              ></template>
            </InputStandard>
          </div>
          <div class="row no-gutters flex-lg-nowrap mb-2">
            <div class="p-1 form-group col-sm-12 text-center">
              <ButtonSubmit :button-label="$t('LoginView.login')">
                <template #icon
                  ><i class="bi bi-box-arrow-in-right"></i>&nbsp;
                </template>
              </ButtonSubmit>
            </div>
          </div>
        </div>
        <div class="card-footer text-center">
          <small
            >moneyjin {{ version }} - &copy; {{ $t("LoginView.by") }} Oliver
            Lehmann</small
          >
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
import { string } from "zod";

import router, { Routes } from "@/router";
import { version } from "../../package.json";

import ButtonSubmit from "@/components/ButtonSubmit.vue";
import DivError from "@/components/DivError.vue";
import InputStandard from "@/components/InputStandard.vue";

import UserControllerHandler from "@/handler/UserControllerHandler";
import { handleBackendError } from "@/tools/views/HandleBackendError";

const serverErrors = ref(new Array<string>());

const schema = {
  username: string().min(1, "Bitte Benutzernamen angeben!"),
  password: string().min(1, "Bitte Passwort angeben!"),
};

const username = ref("");
const password = ref("");

const { handleSubmit } = useForm();

const handleLogin = handleSubmit((values) => {
  serverErrors.value = new Array<string>();

  UserControllerHandler.login(values.username, values.password)
    .then(() => {
      router.push({ name: Routes.Home });
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
      password.value = "";
    });
});
</script>
