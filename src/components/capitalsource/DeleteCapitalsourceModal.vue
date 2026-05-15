<template>
  <ModalVue :title="$t('Capitalsource.title.delete')" ref="modalComponent">
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
              <TableCell>{{ mcs.comment }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("Capitalsource.type") }}
              </TableCell>
              <TableCell>{{ typeString }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("Capitalsource.state") }}
              </TableCell>
              <TableCell>{{ stateString }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.iban") }}
              </TableCell>
              <TableCell>{{ mcs.accountNumber }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.bic") }}
              </TableCell>
              <TableCell>{{ mcs.bankCode }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.validFrom") }}
              </TableCell>
              <TableCell><SpanDate :date="mcs.validFrom" /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("General.validTil") }}
              </TableCell>
              <TableCell><SpanDate :date="mcs.validTil" /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("Capitalsource.groupUse") }}
              </TableCell>
              <TableCell><SpanBoolean :value="mcs.groupUse" /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-primary/[0.10] w-40 whitespace-normal text-foreground border-r"
              >
                {{ $t("Capitalsource.importAllowed") }}
              </TableCell>
              <TableCell>
                <b :class="importAllowedColorClass">{{
                  importAllowedString
                }}</b>
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
        @click="deleteCapitalsource"
      >
        <Trash2 />
        {{ $t("General.delete") }}
      </Button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-vue-next";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import SpanBoolean from "../SpanBoolean.vue";
import SpanDate from "../SpanDate.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { capitalsourceImportNames } from "@/model/capitalsource/CapitalsourceImport";
import { capitalsourceStateNames } from "@/model/capitalsource/CapitalsourceState";
import { capitalsourceTypeNames } from "@/model/capitalsource/CapitalsourceType";

import CapitalsourceService from "@/service/CapitalsourceService";

const serverErrors = ref(new Array<string>());

const mcs = ref({} as Capitalsource);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["capitalsourceDeleted"]);

const importAllowedColorClass = computed(() => {
  return mcs.value.importAllowed > 0 ? "text-green-600" : "text-red-600";
});

const importAllowedString = computed(() => {
  return capitalsourceImportNames[mcs.value.importAllowed];
});

const typeString = computed(() => {
  return capitalsourceTypeNames[mcs.value.type];
});

const stateString = computed(() => {
  return capitalsourceStateNames[mcs.value.state];
});

const _show = (_mcs: Capitalsource) => {
  mcs.value = _mcs;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteCapitalsource = () => {
  serverErrors.value = new Array<string>();

  CapitalsourceService.deleteCapitalsource(mcs.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("capitalsourceDeleted", mcs.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
