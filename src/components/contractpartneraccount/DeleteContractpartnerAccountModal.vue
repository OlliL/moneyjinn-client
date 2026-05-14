<template>
  <ModalVue
    :title="$t('ContractpartnerAccount.title.delete')"
    ref="modalComponent"
    :z-index="zIndex"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />

      <div class="flex flex-col rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-1/3 text-foreground border-r"
              >
                {{ $t("General.iban") }}
              </TableCell>
              <TableCell>
                {{ mca.accountNumber }}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-1/3 text-foreground border-r"
              >
                {{ $t("General.bic") }}
              </TableCell>
              <TableCell>
                {{ mca.bankCode }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </template>

    <template #footer>
      <Button
        @click="deleteContractpartnerAccount"
        class="flex items-center gap-2 !rounded-md px-6"
        variant="destructive"
      >
        <Trash2 />
        {{ $t("General.delete") }}
      </Button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from "vue";

// Shadcn UI Komponenten
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-vue-next";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import ContractpartnerAccountService from "@/service/ContractpartnerAccountService";

const props = defineProps({
  zIndex: {
    type: String,
    default: "2001",
  },
});

const serverErrors = ref(new Array<string>());
const mca = ref({} as ContractpartnerAccount);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");

const emit = defineEmits(["contractpartnerAccountDeleted"]);

const _show = (_mca: ContractpartnerAccount) => {
  mca.value = _mca;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteContractpartnerAccount = () => {
  serverErrors.value = new Array<string>();

  ContractpartnerAccountService.deleteContractpartnerAccount(mca.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("contractpartnerAccountDeleted", mca.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
