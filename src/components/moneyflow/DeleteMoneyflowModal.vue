<template>
  <ModalVue :title="$t('Moneyflow.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="flex flex-col rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableBody>
            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("Moneyflow.bookingdate") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                <SpanDate :date="mmf.bookingDate" />
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("Moneyflow.invoicedate") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                <SpanDate :date="mmf.invoiceDate" />
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.contractpartner") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                {{ mmf.contractpartnerName }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.capitalsource") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                {{ mmf.capitalsourceComment }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.comment") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                {{ mmf.comment }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.amount") }}
              </TableCell>
              <TableCell
                class="font-semibold text-foreground pr-4 py-3 text-base"
              >
                <SpanAmount :amount="mmf.amount" />
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.postingAccount") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                {{ mmf.postingAccountName }}
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
        @click="deleteMoneyflow"
      >
        <Trash2 class="h-4 w-4" />
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

import ModalVue from "../Modal.vue";
import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

import MoneyflowService from "@/service/MoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import DivError from "../DivError.vue";

const serverErrors = ref(new Array<string>());

const mmf = ref({} as Moneyflow);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["moneyflowDeleted"]);

const _show = (_mmf: Moneyflow) => {
  mmf.value = _mmf;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteMoneyflow = () => {
  serverErrors.value = new Array<string>();

  MoneyflowService.deleteMoneyflow(mmf.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("moneyflowDeleted", mmf.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
defineExpose({ _show });
</script>
