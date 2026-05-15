<template>
  <ModalVue :title="$t('User.title.delete')" ref="modalComponent">
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
              <TableCell>{{ user.userName }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.group") }}
              </TableCell>
              <TableCell>{{ user.groupName }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("User.role") }}
              </TableCell>
              <TableCell>{{ role }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("User.new") }}
              </TableCell>
              <TableCell><SpanBoolean :value="user.userIsNew" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </template>
    <template #footer>
      <Button
        variant="destructive"
        class="flex items-center gap-2 px-6"
        @click="deleteUser"
      >
        <Trash2 />
        {{ $t("General.delete") }}
      </Button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-vue-next";

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
