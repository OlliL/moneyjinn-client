<template>
  <ModalVue :title="$t('Group.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="flex flex-col rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.name") }}
              </TableCell>
              <TableCell>{{ group.name }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </template>
    <template #footer>
      <Button
        variant="destructive"
        class="flex items-center gap-2 px-6"
        @click="deleteGroup"
      >
        <Trash2 />
        {{ $t("General.delete") }}
      </Button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from "vue";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-vue-next";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { Group } from "@/model/group/Group";

import GroupService from "@/service/GroupService";

const serverErrors = ref(new Array<string>());

const group = ref({} as Group);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
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
