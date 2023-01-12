<template>
  <form @submit.prevent="handleLogin">
    <div
      class="d-flex flex-column min-vh-100 justify-content-center align-items-center"
    >
      <div class="card">
        <div class="card-header text-center p-3">
          <h4>Willkommen!</h4>
        </div>
        <div class="card-body">
          <div class="text-center p-3">
            <h5>
              Geben Sie Ihre Nutzerdaten ein und klicken Sie auf „Anmelden“.
            </h5>
          </div>
          <DivError :server-errors="serverErrors" />
          <div class="row no-gutters flex-lg-nowrap mb-2">
            <input-standard
              v-model="username"
              :validation-schema="schema.username"
              id="username"
              field-label="Benutzername"
              :focus="true"
            >
              <template #icon><i class="bi bi-person"></i></template>
            </input-standard>
          </div>
          <div class="row no-gutters flex-lg-nowrap mb-2">
            <input-standard
              v-model="password"
              :validation-schema="schema.password"
              type="password"
              id="password"
              field-label="Passwort"
            >
              <template #icon><i class="bi bi-lock"></i></template>
            </input-standard>
          </div>
          <div class="row no-gutters flex-lg-nowrap mb-2">
            <div class="p-1 form-group col-sm-12 text-center">
              <button-submit button-label="Anmelden">
                <template #icon
                  ><i class="bi bi-box-arrow-in-right"></i>&nbsp;
                </template>
              </button-submit>
            </div>
          </div>
        </div>
        <div class="card-footer text-center">
          <small>moneyjin {{ version }} - &copy; by Oliver Lehmann</small>
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

import InputStandard from "@/components/InputStandard.vue";
import ButtonSubmit from "@/components/ButtonSubmit.vue";
import DivError from "@/components/DivError.vue";

import UserControllerHandler from "@/handler/UserControllerHandler";

const serverErrors = ref(new Array<String>());

const schema = {
  username: string().min(1, "Bitte Benutzernamen angeben!"),
  password: string().min(1, "Bitte Passwort angeben!"),
};

const username = ref("");
const password = ref("");

const { handleSubmit } = useForm();

const handleLogin = handleSubmit((values) => {
  serverErrors.value.splice(0, serverErrors.value.length);

  UserControllerHandler.login(values.username, values.password)
    .then(() => {
      router.push({ name: Routes.Home });
    })
    .catch((error) => {
      serverErrors.value.push(error.message);
      password.value = "";
    });
});
</script>
