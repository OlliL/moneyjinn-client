<template>
  <ModalVue :title="$t('ETF.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="flex flex-col rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/10 w-40 whitespace-normal text-foreground border-r"
                >{{ $t("General.name") }}</TableCell
              >
              <TableCell>{{ etf.name }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/10 w-40 whitespace-normal text-foreground border-r"
                >{{ $t("ETF.isin") }}</TableCell
              >
              <TableCell>{{ etf.isin }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/10 w-40 whitespace-normal text-foreground border-r"
                >{{ $t("ETF.wkn") }}</TableCell
              >
              <TableCell>{{ etf.wkn }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/10 w-40 whitespace-normal text-foreground border-r"
                >{{ $t("ETF.ticker") }}</TableCell
              >
              <TableCell>{{ etf.ticker }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/10 w-40 whitespace-normal text-foreground border-r"
                >{{ $t("ETF.chartUrl") }}</TableCell
              >
              <TableCell><a :href="etf.chartUrl">Link</a></TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/10 w-40 whitespace-normal text-foreground border-r"
                >{{ $t("ETFFlow.transactionCostsAbsolute") }}</TableCell
              >
              <TableCell
                ><SpanAmount :amount="etf.transactionCostsAbsolute"
              /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/10 w-40 whitespace-normal text-foreground border-r"
                >{{ $t("ETFFlow.transactionCostsRelative") }}</TableCell
              >
              <TableCell>{{ trabsactionCostsRelativeString }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/10 w-40 whitespace-normal text-foreground border-r"
                >{{ $t("ETFFlow.transactionCostsMaximum") }}</TableCell
              >
              <TableCell
                ><SpanAmount :amount="etf.transactionCostsMaximum"
              /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/10 w-40 whitespace-normal text-foreground border-r"
                >{{ $t("ETF.partialTaxExemption") }}</TableCell
              >
              <TableCell>{{ partialTaxExemptionString }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </template>
    <template #footer>
      <Button
        variant="destructive"
        class="flex items-center gap-2 rounded-md px-6"
        @click="deleteEtf"
      >
        <Trash2 class="h-4 w-4" />
        {{ $t("General.delete") }}
      </Button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { Trash2 } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { Etf } from "@/model/etf/Etf";

import CrudEtfService from "@/service/CrudEtfService";
import SpanAmount from "../SpanAmount.vue";
import { formatNumber } from "@/tools/views/FormatNumber";

const serverErrors = ref(new Array<string>());

const etf = ref({} as Etf);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["etfDeleted"]);

const trabsactionCostsRelativeString = computed(() => {
  return etf.value.transactionCostsRelative === undefined
    ? ""
    : formatNumber(etf.value.transactionCostsRelative, 2) + " %";
});

const partialTaxExemptionString = computed(() => {
  return etf.value.partialTaxExemption === undefined
    ? ""
    : formatNumber(etf.value.partialTaxExemption, 2) + " %";
});

const _show = (_etf: Etf) => {
  etf.value = _etf;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteEtf = () => {
  serverErrors.value = new Array<string>();

  CrudEtfService.deleteEtf(etf.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("etfDeleted", etf.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
