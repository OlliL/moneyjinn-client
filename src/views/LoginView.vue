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
          <div class="input-group mb-3 p1">
            <span class="input-group-text"><i class="bi bi-person"></i></span>
            <div class="form-floating">
              <input
                v-model="username"
                id="username"
                type="text"
                @input="validateUsername"
                :class="'form-control ' + usernameErrorData.inputClass"
              />
              <label
                for="username"
                :style="'color: ' + usernameErrorData.fieldColor"
                >{{ usernameErrorData.fieldLabel }}</label
              >
            </div>
          </div>

          <div class="input-group mb-3 p-1">
            <span class="input-group-text"><i class="bi bi-lock"></i></span>
            <div class="form-floating">
              <input
                v-model="password"
                id="password"
                type="password"
                @input="validatePassword"
                :class="'form-control ' + passwordErrorData.inputClass"
              />
              <label
                for="password"
                :style="'color: ' + passwordErrorData.fieldColor"
                >{{ passwordErrorData.fieldLabel }}</label
              >
            </div>
          </div>

          <div class="p-1 form-group col-sm-12 text-center">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="!formIsValid"
            >
              <i class="bi bi-box-arrow-in-right"></i> Anmelden
            </button>
          </div>
        </div>
        <div class="card-footer text-center">
          <small>moneyjinn 0.23.0 - &copy; by Oliver Lehmann</small>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import type { ErrorData } from "@/tools/views/ErrorData";
import { generateErrorData } from "@/tools/views/ErrorData";
import UserControllerHandler from "@/handler/UserControllerHandler";

type LoginViewData = {
  username: string;
  password: string;
  usernameIsValid: boolean | null;
  usernameErrorMessage: string;
  passwordIsValid: boolean | null;
  passwordErrorMessage: string;
  serverError: string;
};

export default {
  name: "LoginView",
  data(): LoginViewData {
    return {
      username: "",
      password: "",
      usernameIsValid: null,
      usernameErrorMessage: "",
      passwordIsValid: null,
      passwordErrorMessage: "",
      serverError: "",
    };
  },
  computed: {
    usernameErrorData(): ErrorData {
      return generateErrorData(
        this.usernameIsValid,
        "Benutzername",
        this.usernameErrorMessage
      );
    },
    passwordErrorData(): ErrorData {
      return generateErrorData(
        this.passwordIsValid,
        "Passwort",
        this.passwordErrorMessage
      );
    },
    formIsValid() {
      return this.passwordIsValid && this.usernameIsValid;
    },
  },
  methods: {
    validateUsername() {
      if (this.username.length === 0) {
        this.usernameIsValid = false;
        this.usernameErrorMessage = "Bitte Benutzernamen angeben!";
      } else {
        this.usernameIsValid = true;
        this.usernameErrorMessage = "";
      }
    },
    validatePassword() {
      if (this.password.length === 0) {
        this.passwordIsValid = false;
        this.passwordErrorMessage = "Bitte Passwort angeben!";
      } else {
        this.passwordIsValid = true;
        this.passwordErrorMessage = "";
      }
    },
    async handleLogin() {
      this.serverError = "";

      this.validateUsername();
      this.validatePassword();

      if (this.formIsValid) {
        const ret = await UserControllerHandler.login(
          this.username,
          this.password
        ).catch((error) => {
          this.serverError = error.message;
          this.password = "";
          return false;
        });
        if (await ret) {
          alert("TODO: redirect");
        }
      }
    },
  },
};
</script>
