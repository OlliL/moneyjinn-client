<template>
  <ModalVue :title="$t('PreDefMoneyflow.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />

      <div class="flex flex-col rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.amount") }}
              </TableCell>
              <TableCell><SpanAmount :amount="mpm.amount" /></TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.contractpartner") }}
              </TableCell>
              <TableCell>{{ mpm.contractpartnerName }}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.comment") }}
              </TableCell>
              <TableCell>{{ mpm.comment }}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.postingAccount") }}
              </TableCell>
              <TableCell>{{ mpm.postingAccountName }}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.capitalsource") }}
              </TableCell>
              <TableCell>{{ mpm.capitalsourceComment }}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("PreDefMoneyflow.onceAMonth") }}
              </TableCell>
              <TableCell><SpanBoolean :value="mpm.onceAMonth" /></TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("PreDefMoneyflow.createDate") }}
              </TableCell>
              <TableCell><SpanDate :date="mpm.createDate" /></TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("PreDefMoneyflow.lastUsed") }}
              </TableCell>
              <TableCell><SpanDate :date="mpm.lastUsed" /></TableCell>
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
