<template>
  <ModalDelete
    :title="$t('User.title.delete')"
    id-suffix="DeleteUser"
    v-model:open="open"
    :delete-action="() => UserService.deleteUser(user.id)"
    :delete-success-action="onDone"
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
import { storeToRefs } from "pinia";
import { computed } from "vue";
import useDeleteUserModalStore from "./DeleteUserModal.store";

const { open, entity: user, onDone } = storeToRefs(useDeleteUserModalStore());

const role = computed(() => userRoleNames[user.value.role]);
</script>
