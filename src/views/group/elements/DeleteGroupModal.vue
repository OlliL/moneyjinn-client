<template>
  <ModalDelete
    :title="$t('Group.title.delete')"
    id-suffix="DeleteGroup"
    v-model:open="open"
    :delete-action="() => GroupService.deleteGroup(group.id)"
    :delete-success-action="() => onDone?.(group)"
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
import { storeToRefs } from "pinia";
import { useDeleteGroupModalStore } from "./DeleteGroupModal.store";

const { open, entity: group, onDone } = storeToRefs(useDeleteGroupModalStore());
</script>
