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
                <DivError :server-errors="serverErrors" />
                <div class="row no-gutters flex-lg-nowrap mb-4">
                  <div class="col-md-12 col-xs-12">
                    <InputStandard
                      v-model="passwordOld"
                      :validation-schema="schema.passwordOld"
                      :id="password1"
                      field-label="altes Passwort"
                      field-type="password"
                    />
                  </div>
                </div>
                <div class="row no-gutters flex-lg-nowrap mb-2">
                  <div class="col-md-12 col-xs-12">
                    <InputStandard
                      v-model="password1"
                      :validation-schema-ref="schema.password"
                      :id="password1"
                      field-label="neues Passwort"
                      field-type="password"
                    />
                  </div>
                </div>
                <div class="row no-gutters flex-lg-nowrap mb-3">
                  <div class="col-md-12 col-xs-12">
                    <InputStandard
                      v-model="password2"
                      :validation-schema-ref="schema.password"
                      :id="password2"
                      field-label="neues Passwort wiederholen"
                      field-type="password"
                    />
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

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { string } from "zod";

import router, { Routes } from "@/router";

import DivError from "@/components/DivError.vue";
import InputStandard from "@/components/InputStandard.vue";

import { useUserSessionStore } from "@/stores/UserSessionStore";

import { getError, handleBackendError } from "@/tools/views/ThrowError";
import { globErr } from "@/tools/views/ZodUtil";

import { ErrorCode } from "@/model/ErrorCode";

import UserControllerHandler from "@/handler/UserControllerHandler";

const schema = {
  passwordOld: string(globErr("Bitte altes Passwort angeben!")).min(1),
  password: computed(() => {
    password1.value;
    password2.value;

    return string(globErr("Bitte Passwort angeben!"))
      .min(1)
      .refine(
        () => password1.value == password2.value,
        "Die Passwörter stimmen nicht überein!"
      );
  }),
};

const serverErrors = ref(new Array<string>());
const passwordOld = ref("");
const password1 = ref("");
const password2 = ref("");
const userIsNew = ref(false);

onMounted(() => {
  serverErrors.value = new Array<string>();

  const userSessionStore = useUserSessionStore();
  if (userSessionStore.userIsNew) {
    userIsNew.value = true;
  } else {
    userIsNew.value = false;
  }
  if (userIsNew.value) {
    serverErrors.value.push(getError(ErrorCode.PASSWORD_MUST_BE_CHANGED));
  }
});

const changePassword = () => {
  serverErrors.value = new Array<string>();

  UserControllerHandler.changePassword(passwordOld.value, password1.value)
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
};
</script>
