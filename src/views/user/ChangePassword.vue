<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Passwortwechsel</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-2">
      <div class="col-xxl-3 col-lg-4 col-md-5 col-sm-6 col-xs-12">
        <div class="card w-100 bg-light">
          <div class="card-body">
            <form @submit.prevent="changePassword">
              <div class="container-fluid">
                <div v-if="serverError">
                  <div
                    class="alert alert-danger"
                    v-for="(error, index) in serverError"
                    :key="index"
                  >
                    {{ error }}
                  </div>
                </div>
                <div class="row no-gutters flex-lg-nowrap mb-4">
                  <div class="col-md-12 col-xs-12">
                    <div class="form-floating">
                      <input
                        v-model="passwordOld"
                        id="passwordOld"
                        type="password"
                        @input="validatePasswordOld"
                        :class="
                          'form-control ' + passwordOldErrorData.inputClass
                        "
                      />
                      <label
                        :for="passwordOld"
                        :style="'color: ' + passwordOldErrorData.fieldColor"
                        >{{ passwordOldErrorData.fieldLabel }}</label
                      >
                    </div>
                  </div>
                </div>
                <div class="row no-gutters flex-lg-nowrap mb-2">
                  <div class="col-md-12 col-xs-12">
                    <div class="form-floating">
                      <input
                        v-model="password1"
                        id="password1"
                        type="password"
                        @input="validatePassword1"
                        :class="'form-control ' + password1ErrorData.inputClass"
                      />
                      <label
                        :for="password1"
                        :style="'color: ' + password1ErrorData.fieldColor"
                        >{{ password1ErrorData.fieldLabel }}</label
                      >
                    </div>
                  </div>
                </div>
                <div class="row no-gutters flex-lg-nowrap mb-3">
                  <div class="col-md-12 col-xs-12">
                    <div class="form-floating">
                      <input
                        v-model="password2"
                        id="password2"
                        type="password"
                        @input="validatePassword2"
                        :class="'form-control ' + password2ErrorData.inputClass"
                      />
                      <label
                        :for="password2"
                        :style="'color: ' + password2ErrorData.fieldColor"
                        >{{ password2ErrorData.fieldLabel }}</label
                      >
                    </div>
                  </div>
                </div>
                <div class="row no-gutters flex-lg-nowrap mt-2">
                  <div class="col-12">
                    <button type="submit" class="btn btn-primary">
                      speichern
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

<script lang="ts">
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { validateInputField } from "@/tools/views/ValidateInputField";
import { getError } from "@/tools/views/ThrowError";
import UserControllerHandler from "@/handler/UserControllerHandler";
import { defineComponent } from "vue";
import router, { Routes } from "@/router";
import { ErrorCode } from "@/model/ErrorCode";
import { useUserSessionStore } from "@/stores/UserSessionStore";

type ChangePasswordData = {
  serverError: Array<String> | undefined;
  passwordOld: string;
  password1: string;
  password2: string;
  passwordOldIsValid: boolean | null;
  passwordOldErrorMessage: string;
  password1IsValid: boolean | null;
  password1ErrorMessage: string;
  password2IsValid: boolean | null;
  password2ErrorMessage: string;
  userIsNew: boolean;
};
export default defineComponent({
  name: "ChangePassword",
  data(): ChangePasswordData {
    return {
      serverError: undefined,
      passwordOld: "",
      password1: "",
      password2: "",
      passwordOldIsValid: null,
      passwordOldErrorMessage: "",
      password1IsValid: null,
      password1ErrorMessage: "",
      password2IsValid: null,
      password2ErrorMessage: "",
      userIsNew: false,
    };
  },
  created() {
    const userSessionStore = useUserSessionStore();
    if (userSessionStore.userIsNew) {
      this.userIsNew = true;
    } else {
      this.userIsNew = false;
    }
    this.serverError = new Array<string>();
    if (this.userIsNew) {
      this.serverError.push(getError(ErrorCode.PASSWORD_MUST_BE_CHANGED));
    }
  },
  computed: {
    formIsValid(): boolean {
      const isValid = this.password1IsValid && this.password2IsValid;
      if (isValid === null || isValid === undefined || isValid === true) {
        return true;
      }
      return false;
    },
    passwordOldErrorData(): ErrorData {
      return generateErrorData(
        this.passwordOldIsValid,
        "altes Passwort",
        this.passwordOldErrorMessage
      );
    },
    password1ErrorData(): ErrorData {
      return generateErrorData(
        this.password1IsValid,
        "neues Passwort",
        this.password1ErrorMessage
      );
    },
    password2ErrorData(): ErrorData {
      return generateErrorData(
        this.password2IsValid,
        "neues Passwort wiederholen",
        this.password2ErrorMessage
      );
    },
  },
  methods: {
    validatePasswordOld() {
      [this.passwordOldIsValid, this.passwordOldErrorMessage] =
        validateInputField(this.passwordOld, "altes Passwort angeben!");
    },
    validatePassword1() {
      [this.password1IsValid, this.password1ErrorMessage] = validateInputField(
        this.password1,
        "neues Passwort angeben!"
      );
    },
    validatePassword2() {
      [this.password2IsValid, this.password2ErrorMessage] = validateInputField(
        this.password2,
        "Passwortwiederholung angeben!"
      );
    },

    async changePassword() {
      this.validatePasswordOld();
      this.validatePassword2();
      this.validatePassword1();

      this.serverError = undefined;

      if (this.formIsValid) {
        if (this.password1 != this.password2) {
          this.serverError = new Array<string>();
          this.serverError.push("Die neuen Passwörter stimmen nicht überein!");
          return;
        }
        try {
          await UserControllerHandler.changePassword(
            this.passwordOld,
            this.password1
          );
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
        } catch (e) {
          this.serverError = new Array<string>();
          this.serverError.push((e as Error).message);
        }
      }
    },
  },
  components: {},
});
</script>
