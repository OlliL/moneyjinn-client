<template>
  <div
    data-testid="capitalsource-mobile-accordion"
    class="md:hidden w-full max-w-md mx-auto px-2 mb-6 space-y-3"
  >
    <div
      v-if="capitalsources.length === 0"
      data-testid="capitalsource-empty-mobile"
      class="w-full text-center text-muted-foreground mt-4"
    >
      {{ $t("General.noEntries") }}
    </div>
    <Accordion v-else type="multiple" class="space-y-2">
      <AccordionItem
        v-for="mcs in capitalsources"
        :key="mcs.id"
        :value="`item-${mcs.id}`"
        :data-testid="`capitalsource-mobile-row-${mcs.id}`"
        class="border rounded-lg bg-background shadow-sm px-3 py-2"
      >
        <AccordionTrigger
          :data-testid="`capitalsource-mobile-trigger-${mcs.id}`"
          class="hover:no-underline"
        >
          <div class="flex items-center justify-between w-full gap-2">
            <div class="flex flex-col items-start text-left min-w-0">
              <span class="font-bold text-sm truncate">{{ mcs.comment }}</span>
              <span class="text-xs text-muted-foreground"
                >{{ typeString(mcs) }} / {{ stateString(mcs) }}</span
              >
            </div>
            <div
              v-if="mcs.userId === userId"
              class="flex items-center gap-1 pr-2"
            >
              <Button
                variant="ghost"
                size="icon"
                :data-testid="`capitalsource-mobile-edit-${mcs.id}`"
                @click.stop="editCapitalsource(mcs)"
              >
                <Pencil class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :data-testid="`capitalsource-mobile-delete-${mcs.id}`"
                @click.stop="deleteCapitalsource(mcs)"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent class="pt-2">
          <div
            class="grid grid-cols-1 gap-2 text-sm bg-muted/40 p-3 rounded-md"
          >
            <div class="flex justify-between gap-2">
              <span class="text-muted-foreground">{{
                $t("General.iban")
              }}</span>
              <SpanIban :iban="mcs.accountNumber" />
            </div>
            <div class="flex justify-between gap-2">
              <span class="text-muted-foreground">{{ $t("General.bic") }}</span>
              <span>{{ mcs.bankCode }}</span>
            </div>
            <div class="flex justify-between gap-2">
              <span class="text-muted-foreground">{{
                $t("General.validFrom")
              }}</span>
              <SpanDate :date="mcs.validFrom" />
            </div>
            <div class="flex justify-between gap-2">
              <span class="text-muted-foreground">{{
                $t("General.validTil")
              }}</span>
              <SpanDate :date="mcs.validTil" />
            </div>
            <div class="flex justify-between gap-2">
              <span class="text-muted-foreground">{{
                $t("Capitalsource.groupUse")
              }}</span>
              <SpanBoolean :value="mcs.groupUse" />
            </div>
            <div class="flex justify-between gap-2">
              <span class="text-muted-foreground">{{
                $t("Capitalsource.importAllowed")
              }}</span>
              <b :class="importAllowedColorClass(mcs)">{{
                importAllowedString(mcs)
              }}</b>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<script lang="ts" setup>
import SpanBoolean from "@/components/common/SpanBoolean.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import SpanIban from "@/components/common/SpanIban.vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { capitalsourceImportNames } from "@/model/capitalsource/CapitalsourceImport";
import { capitalsourceStateNames } from "@/model/capitalsource/CapitalsourceState";
import { capitalsourceTypeNames } from "@/model/capitalsource/CapitalsourceType";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

defineProps({
  capitalsources: {
    type: Array as PropType<Capitalsource[]>,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["deleteCapitalsource", "editCapitalsource"]);

const deleteCapitalsource = (mcs: Capitalsource) => {
  emit("deleteCapitalsource", mcs);
};

const editCapitalsource = (mcs: Capitalsource) => {
  emit("editCapitalsource", mcs);
};

const importAllowedColorClass = (mcs: Capitalsource): string => {
  return mcs.importAllowed > 0 ? "text-green-600" : "text-red-600";
};

const importAllowedString = (mcs: Capitalsource): string => {
  return capitalsourceImportNames[mcs.importAllowed];
};

const typeString = (mcs: Capitalsource): string => {
  return capitalsourceTypeNames[mcs.type];
};

const stateString = (mcs: Capitalsource): string => {
  return capitalsourceStateNames[mcs.state];
};
</script>
