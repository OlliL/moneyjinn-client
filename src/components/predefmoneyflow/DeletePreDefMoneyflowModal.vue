<template>
  <ModalVue :title="$t('PreDefMoneyflow.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="flex flex-col rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableBody>
            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.amount") }}
              </TableCell>
              <TableCell
                class="font-semibold text-foreground pr-4 py-3 text-base"
              >
                <SpanAmount :amount="mpm.amount" />
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.contractpartner") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                {{ mpm.contractpartnerName }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.comment") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                {{ mpm.comment }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.postingAccount") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                {{ mpm.postingAccountName }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.capitalsource") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                {{ mpm.capitalsourceComment }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("PreDefMoneyflow.onceAMonth") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                <SpanBoolean :value="!mpm.onceAMonth" />
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("PreDefMoneyflow.createDate") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                <SpanDate :date="mpm.createDate" />
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("PreDefMoneyflow.lastUsed") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                <SpanDate :date="mpm.lastUsed" />
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
        @click="deletePreDefMoneyflow"
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
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { Trash2 } from "lucide-vue-next";
import { ref, useTemplateRef } from "vue";
import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import SpanAmount from "../SpanAmount.vue";
import SpanBoolean from "../SpanBoolean.vue";
import SpanDate from "../SpanDate.vue";

const serverErrors = ref(new Array<string>());

const mpm = ref({} as PreDefMoneyflow);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["preDefMoneyflowDeleted"]);

const _show = (_mpm: PreDefMoneyflow) => {
  mpm.value = _mpm;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deletePreDefMoneyflow = () => {
  serverErrors.value = new Array<string>();

  PreDefMoneyflowService.deletePreDefMoneyflow(mpm.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("preDefMoneyflowDeleted", mpm.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
