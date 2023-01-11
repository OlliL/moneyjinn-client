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
          <div class="alert alert-danger" v-if="serverError">
            {{ serverError }}
          </div>
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
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isDisabled"
              >
                <i class="bi bi-box-arrow-in-right"></i> Anmelden
              </button>
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
import UserControllerHandler from "@/handler/UserControllerHandler";
import router, { Routes } from "@/router";
import { version } from "../../package.json";
import { ref, computed } from "vue";
import { useForm, useIsFormDirty, useIsFormValid } from "vee-validate";
import { string } from "zod";

import InputStandard from "@/components/InputStandard.vue";

const schema = {
  username: string().min(1, "Bitte Benutzernamen angeben!"),
  password: string().min(1, "Bitte Passwort angeben!"),
};

const username = ref("");
const password = ref("");

const { handleSubmit } = useForm();

const serverError = ref("");

// TODO - extra Submit-Button component?!
const isDirty = useIsFormDirty();
const isValid = useIsFormValid();

const isDisabled = computed(() => {
  return !isDirty.value || !isValid.value;
});

const handleLogin = handleSubmit((values) => {
  serverError.value = "";

  UserControllerHandler.login(values.username, values.password)
    .then(() => {
      router.push({ name: Routes.Home });
    })
    .catch((error) => {
      serverError.value = error.message;
      password.value = "";
    });
});
</script>
