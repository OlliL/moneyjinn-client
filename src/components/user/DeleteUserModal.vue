<template>
  <ModalVue :title="$t('User.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row d-flex justify-content-center mt-3">
        <div class="col-11">
          <table class="table table-bordered table-hover">
            <tbody>
              <tr>
                <th scope="row">{{ $t("General.name") }}</th>
                <td>{{ user.userName }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("General.group") }}</th>
                <td>{{ user.groupName }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("User.role") }}</th>
                <td>{{ role }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("User.new") }}</th>
                <td><SpanBoolean :value="user.userIsNew" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-danger" @click="deleteUser">
        {{ $t("General.delete") }}
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import SpanBoolean from "../SpanBoolean.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { User } from "@/model/user/User";
import { userRoleNames } from "@/model/user/UserRole";

import UserService from "@/service/UserService";

const user = ref({} as User);
const serverErrors = ref(new Array<string>());
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["userDeleted"]);

const _show = (_user: User) => {
  user.value = _user;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const role = computed(() => {
  return userRoleNames[user.value.role];
});

const deleteUser = () => {
  serverErrors.value = new Array<string>();

  UserService.deleteUser(user.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("userDeleted", user.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>

<style scoped>
th {
  background-color: #f2f2f2;
}
</style>
