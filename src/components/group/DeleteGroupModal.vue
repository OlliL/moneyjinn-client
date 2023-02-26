<template>
  <ModalVue :title="$t('Group.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.name") }}
        </div>
        <div class="text-start col-sm-9">{{ group.name }}</div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-danger" @click="deleteGroup">
        {{ $t("General.delete") }}
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";

import { handleBackendError } from "@/tools/views/ThrowError";

import type { Group } from "@/model/group/Group";

import GroupControllerHandler from "@/handler/GroupControllerHandler";

const serverErrors = ref(new Array<string>());

const group = ref({} as Group);
const modalComponent = ref();
const emit = defineEmits(["groupDeleted"]);

const _show = (_group: Group) => {
  group.value = _group;
  serverErrors.value = new Array<string>();
  modalComponent.value._show();
};

const deleteGroup = () => {
  serverErrors.value = new Array<string>();

  GroupControllerHandler.deleteGroup(group.value.id)
    .then(() => {
      modalComponent.value._hide();
      emit("groupDeleted", group.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
defineExpose({ _show });
</script>
