<template>
  <ModalVue :title="$t('PostingAccount.title.delete')" ref="modalComponent">
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
                {{ mpa.name }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </template>
    <template #footer>
      <Button
        variant="destructive"
        class="flex items-center gap-2 rounded-md px-6"
        @click="deletePostingAccount"
      >
        <Trash2 class="h-4 w-4" />
        {{ $t("General.delete") }}
      </Button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import PostingAccountService from "@/service/PostingAccountService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { Trash2 } from "lucide-vue-next";
import { ref, useTemplateRef } from "vue";
import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";

const serverErrors = ref(new Array<string>());

const mpa = ref({} as PostingAccount);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["postingAccountDeleted"]);

const _show = (_mpa: PostingAccount) => {
  mpa.value = _mpa;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deletePostingAccount = () => {
  serverErrors.value = new Array<string>();

  PostingAccountService.deletePostingAccount(mpa.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("postingAccountDeleted", mpa.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
