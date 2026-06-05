<template>
  <ModalDelete
    :title="$t('Group.title.delete')"
    :server-errors="serverErrors"
    id-suffix="DeleteGroup"
    v-model:open="open"
    @confirm="deleteGroup"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.name')" highlight-value>
        {{ group.name }}
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import GroupService from "@/service/GroupService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import useDeleteGroupModalStore from "./DeleteGroupModal.store";

const { open, group, onDone } = storeToRefs(useDeleteGroupModalStore());

const serverErrors = ref(new Array<string>());

watch(open, (newVal) => {
  if (newVal) {
    serverErrors.value = new Array<string>();
  }
});

const deleteGroup = () => {
  serverErrors.value = new Array<string>();

  GroupService.deleteGroup(group.value.id)
    .then(() => {
      open.value = false;
      onDone.value?.();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
