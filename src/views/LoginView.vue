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
            <div class="input-group">
              <div class="form-floating">
                <input
                  v-model="username"
                  ref="usernameRef"
                  id="username"
                  type="text"
                  :class="'form-control ' + usernameErrorData.inputClass"
                />
                <label
                  for="username"
                  :style="'color: ' + usernameErrorData.fieldColor"
                  >{{ usernameErrorData.fieldLabel }}</label
                >
              </div>
              <span class="input-group-text"><i class="bi bi-person"></i></span>
            </div>
          </div>
          <div class="row no-gutters flex-lg-nowrap mb-2">
            <div class="input-group">
              <div class="form-floating">
                <input
                  v-model="password"
                  id="password"
                  type="password"
                  :class="'form-control ' + passwordErrorData.inputClass"
                />
                <label
                  for="password"
                  :style="'color: ' + passwordErrorData.fieldColor"
                  >{{ passwordErrorData.fieldLabel }}</label
                >
              </div>
              <span class="input-group-text"><i class="bi bi-lock"></i></span>
            </div>
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
import { onMounted, ref, computed } from "vue";
import {
  useField,
  useForm,
  useIsFormDirty,
  useIsFormValid,
} from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { object, string } from "zod";
import {
  generateErrorDataVeeValidate,
  type ErrorData,
} from "@/tools/views/ErrorData";

const validationSchema = toFormValidator(
  object({
    username: string().min(1, "Bitte Benutzernamen angeben!"),
    password: string().min(1, "Bitte Passwort angeben!"),
  })
);

const { handleSubmit, errors } = useForm({
  validationSchema,
});

const { value: username, meta: usernameMeta } = useField("username");
const { value: password, meta: passwordMeta } = useField("password");

const usernameRef = ref(null);
const serverError = ref("");

const isDirty = useIsFormDirty();
const isValid = useIsFormValid();

const isDisabled = computed(() => {
  return !isDirty.value || !isValid.value;
});

const passwordErrorData = computed((): ErrorData => {
  return generateErrorDataVeeValidate(
    passwordMeta.dirty,
    "Passwort",
    errors.value.password
  );
});

const usernameErrorData = computed((): ErrorData => {
  return generateErrorDataVeeValidate(
    usernameMeta.dirty,
    "Benutzername",
    errors.value.username
  );
});
onMounted(() => {
  (usernameRef.value as any).focus();
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
