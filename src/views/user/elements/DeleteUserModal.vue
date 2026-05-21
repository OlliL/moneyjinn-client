<template>
  <ModalDelete
    :title="$t('User.title.delete')"
    :server-errors="serverErrors"
    ref="modalComponent"
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
import ModalDelete from "@/components/ModalDelete.vue";
import ModalDeleteRow from "@/components/ModalDeleteRow.vue";
import SpanBoolean from "@/components/SpanBoolean.vue";
import type { User } from "@/model/user/User";
import { userRoleNames } from "@/model/user/UserRole";
import UserService from "@/service/UserService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { computed, ref, useTemplateRef } from "vue";

const user = ref({} as User);
const serverErrors = ref(new Array<string>());
const modalComponent = useTemplateRef<typeof ModalDelete>("modalComponent");
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
