<template>
  <ModalVue
    :title="$t('ContractpartnerMatching.title.delete')"
    ref="modalComponent"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="flex flex-col rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/10 w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("ContractpartnerMatching.matchingText") }}
              </TableCell>
              <TableCell>{{ mcm.matchingText }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/10 w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.contractpartner") }}
              </TableCell>
              <TableCell>{{ mcm.contractpartnerName }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/10 w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("Contractpartner.moneyflowComment") }}
              </TableCell>
              <TableCell>{{ mcm.moneyflowComment }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/10 w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.postingAccount") }}
              </TableCell>
              <TableCell>{{ mcm.postingAccountName }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </template>
    <template #footer>
      <Button
        variant="destructive"
        class="flex items-center gap-2 rounded-md px-6"
        @click="deleteContractpartnerMatching"
      >
        <Trash2 class="h-4 w-4" />
        {{ $t("General.delete") }}
      </Button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from "vue";
import { Trash2 } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";

import ContractpartnerMatchingService from "@/service/ContractpartnerMatchingService";

const serverErrors = ref(new Array<string>());

const mcm = ref({} as ContractpartnerMatching);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["contractpartnerMatchingDeleted"]);

const _show = (_mcm: ContractpartnerMatching) => {
  mcm.value = _mcm;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteContractpartnerMatching = () => {
  serverErrors.value = new Array<string>();

  ContractpartnerMatchingService.deleteContractpartnerMatching(mcm.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("contractpartnerMatchingDeleted", mcm.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
