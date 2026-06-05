<template>
  <ModalDelete
    :title="$t('User.title.delete')"
    :server-errors="serverErrors"
    id-suffix="DeleteUser"
    v-model:open="open"
    @confirm="deleteUser"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.name')" highlight-value>
        {{ user.userName }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.group')">
        {{ user.groupName }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('User.role')">
        {{ role }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('User.new')">
        <SpanBoolean :value="user.userIsNew" />
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import SpanBoolean from "@/components/common/SpanBoolean.vue";
import { userRoleNames } from "@/model/user/UserRole";
import UserService from "@/service/UserService";
import useDeleteUserModalStore from "./DeleteUserModal.store";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

const { open, user, onDone } = storeToRefs(
  useDeleteUserModalStore(),
);

const serverErrors = ref(new Array<string>());

watch(open, (newVal) => {
  if (newVal) {
    serverErrors.value = new Array<string>();
  }
});

const role = computed(() => {
  return userRoleNames[user.value.role];
});

const deleteUser = () => {
  serverErrors.value = new Array<string>();

  UserService.deleteUser(user.value.id)
    .then(() => {
      open.value = false;
      onDone.value?.();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
