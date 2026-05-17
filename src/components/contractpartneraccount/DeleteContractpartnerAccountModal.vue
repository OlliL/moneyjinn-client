<template>
  <ModalVue
    :title="$t('ContractpartnerAccount.title.delete')"
    ref="modalComponent"
    z-index="2001"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="flex flex-col rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableBody>
            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.iban") }}
              </TableCell>
              <TableCell
                class="font-semibold text-foreground pr-4 py-3 text-base"
              >
                {{ mca.accountNumber }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.bic") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                {{ mca.bankCode }}
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
        @click="deleteContractpartnerAccount"
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
import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import ContractpartnerAccountService from "@/service/ContractpartnerAccountService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { Trash2 } from "lucide-vue-next";
import { ref, useTemplateRef } from "vue";
import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";

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
