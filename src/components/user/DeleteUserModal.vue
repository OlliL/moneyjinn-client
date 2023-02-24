<template>
  <ModalVue title="Benutzerkonto l&ouml;schen" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Name
        </div>
        <div class="text-start col-sm-9">{{ user.userName }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Gruppe
        </div>
        <div class="text-start col-sm-9">{{ user.groupName }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Anmeldung erlaubt
        </div>
        <div class="text-start col-sm-9">
          <SpanBoolean :value="user.userCanLogin" />
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Administrator
        </div>
        <div class="text-start col-sm-9">
          <SpanBoolean :value="user.userIsAdmin" />
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Neu
        </div>
        <div class="text-start col-sm-9">
          <SpanBoolean :value="user.userIsNew" />
        </div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-danger" @click="deleteUser">
        L&ouml;schen
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import SpanBoolean from "../SpanBoolean.vue";

import { handleBackendError } from "@/tools/views/ThrowError";

import type { User } from "@/model/user/User";

import UserControllerHandler from "@/handler/UserControllerHandler";

const user = ref({} as User);
const serverErrors = ref(new Array<string>());
const modalComponent = ref();
const emit = defineEmits(["userDeleted"]);

const _show = (_user: User) => {
  user.value = _user;
  serverErrors.value = new Array<string>();
  modalComponent.value._show();
};

const deleteUser = () => {
  serverErrors.value = new Array<string>();

  UserControllerHandler.deleteUser(user.value.id)
    .then(() => {
      modalComponent.value._hide();
      emit("userDeleted", user.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
