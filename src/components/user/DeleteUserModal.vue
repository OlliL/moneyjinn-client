<template>
  <ModalVue :title="$t('User.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="flex flex-col rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableBody>
            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.name") }}
              </TableCell>
              <TableCell
                class="font-semibold text-foreground pr-4 py-3 text-base"
              >
                {{ user.userName }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.group") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                {{ user.groupName }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("User.role") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                {{ role }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("User.new") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                <SpanBoolean :value="user.userIsNew" />
              </TableCell>
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
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { User } from "@/model/user/User";
import { userRoleNames } from "@/model/user/UserRole";
import UserService from "@/service/UserService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { Trash2 } from "lucide-vue-next";
import { computed, ref, useTemplateRef } from "vue";
import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import SpanBoolean from "../SpanBoolean.vue";

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
