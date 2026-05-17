<template>
  <ModalVue :title="$t('Capitalsource.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="flex flex-col rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableBody>
            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.name") }}
              </TableCell>
              <TableCell
                class="font-semibold text-foreground pr-4 py-3 text-base"
              >
                {{ mcs.comment }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("Capitalsource.type") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                {{ typeString }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("Capitalsource.state") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                {{ stateString }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.iban") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                <SpanIban :iban="mcs.accountNumber" />
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.bic") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                {{ mcs.bankCode }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.validFrom") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                <SpanDate :date="mcs.validFrom" />
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.validTil") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                <SpanDate :date="mcs.validTil" />
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
        <Trash2 class="h-4 w-4" />
        {{ $t("General.delete") }}
      </Button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { capitalsourceStateNames } from "@/model/capitalsource/CapitalsourceState";
import { capitalsourceTypeNames } from "@/model/capitalsource/CapitalsourceType";
import CapitalsourceService from "@/service/CapitalsourceService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { Trash2 } from "lucide-vue-next";
import { computed, ref, useTemplateRef } from "vue";
import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import SpanDate from "../SpanDate.vue";
import SpanIban from "../SpanIban.vue";

const serverErrors = ref(new Array<string>());

const mcs = ref({} as Capitalsource);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["capitalsourceDeleted"]);

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
