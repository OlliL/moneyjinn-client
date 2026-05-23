<template>
  <ModalDelete
    :title="$t('Group.title.delete')"
    :server-errors="serverErrors"
    ref="modalComponent"
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
import type { Group } from "@/model/group/Group";
import GroupService from "@/service/GroupService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { ref, useTemplateRef } from "vue";

const serverErrors = ref(new Array<string>());

const group = ref({} as Group);
const modalComponent = useTemplateRef<typeof ModalDelete>("modalComponent");
const emit = defineEmits(["groupDeleted"]);

const _show = (_group: Group) => {
  group.value = _group;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteGroup = () => {
  serverErrors.value = new Array<string>();

  GroupService.deleteGroup(group.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("groupDeleted", group.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
defineExpose({ _show });
</script>
