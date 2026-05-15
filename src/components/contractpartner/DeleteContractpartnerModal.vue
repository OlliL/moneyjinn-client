<template>
  <ModalVue :title="$t('Contractpartner.title.delete')" ref="modalComponent">
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
              <TableCell>{{ mcp.name }}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("Contractpartner.street") }}
              </TableCell>
              <TableCell>{{ mcp.street }}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("Contractpartner.postcode") }}
              </TableCell>
              <TableCell>{{ mcp.postcode }}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("Contractpartner.town") }}
              </TableCell>
              <TableCell>{{ mcp.town }}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("Contractpartner.country") }}
              </TableCell>
              <TableCell>{{ mcp.country }}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.validFrom") }}
              </TableCell>
              <TableCell><SpanDate :date="mcp.validFrom" /></TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.validTil") }}
              </TableCell>
              <TableCell><SpanDate :date="mcp.validTil" /></TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("Contractpartner.moneyflowComment") }}
              </TableCell>
              <TableCell>{{ mcp.moneyflowComment }}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.postingAccount") }}
              </TableCell>
              <TableCell>{{ mcp.postingAccountName }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </template>

    <template #footer>
      <Button
        variant="destructive"
        class="flex items-center gap-2 px-6"
        @click="deleteContractpartner"
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

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import SpanDate from "../SpanDate.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import ContractpartnerService from "@/service/ContractpartnerService";

const serverErrors = ref(new Array<string>());
const mcp = ref({} as Contractpartner);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["contractpartnerDeleted"]);

const _show = (_mcp: Contractpartner) => {
  mcp.value = _mcp;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteContractpartner = () => {
  serverErrors.value = new Array<string>();

  ContractpartnerService.deleteContractpartner(mcp.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("contractpartnerDeleted", mcp.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
