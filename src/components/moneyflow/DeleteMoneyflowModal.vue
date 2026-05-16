<template>
  <ModalVue :title="$t('Moneyflow.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="flex flex-col rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("Moneyflow.bookingdate") }}
              </TableCell>
              <TableCell><SpanDate :date="mmf.bookingDate" /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("Moneyflow.invoicedate") }}
              </TableCell>
              <TableCell><SpanDate :date="mmf.invoiceDate" /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.contractpartner") }}
              </TableCell>
              <TableCell>{{ mmf.contractpartnerName }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.capitalsource") }}
              </TableCell>
              <TableCell>{{ mmf.capitalsourceComment }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.amount") }}
              </TableCell>
              <TableCell><SpanAmount :amount="mmf.amount" /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.comment") }}
              </TableCell>
              <TableCell>{{ mmf.comment }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.postingAccount") }}
              </TableCell>
              <TableCell>{{ mmf.postingAccountName }}</TableCell>
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

import ModalVue from "../Modal.vue";
import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

import MoneyflowService from "@/service/MoneyflowService";
import DivError from "../DivError.vue";
import { handleBackendError } from "@/tools/views/HandleBackendError";

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
