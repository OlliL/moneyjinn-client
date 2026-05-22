<template>
  <div
    data-testid="etf-mobile-accordion"
    class="md:hidden w-full max-w-md mx-auto px-2 mb-6 space-y-3"
  >
    <template v-if="etfs.length === 0">
      <div
        data-testid="etf-empty-mobile"
        class="w-full text-center text-muted-foreground my-8"
      >
        {{ $t("General.noEntries") }}
      </div>
    </template>
    <template v-else>
      <Accordion type="multiple" class="space-y-2">
        <AccordionItem
          v-for="etf in etfs"
          :key="etf.id"
          :value="`item-${etf.id}`"
          :data-testid="`etf-mobile-row-${etf.id}`"
          class="border rounded-lg bg-background shadow-sm px-3 py-2"
        >
          <AccordionTrigger class="hover:no-underline">
            <div
              :data-testid="`etf-mobile-trigger-${etf.id}`"
              class="flex items-center justify-between w-full gap-2"
            >
              <div class="flex flex-col items-start text-left min-w-0">
                <span class="font-bold text-sm truncate">{{ etf.name }}</span>
                <span class="text-xs text-muted-foreground">{{
                  etf.isin
                }}</span>
              </div>
              <div class="flex items-center gap-1 pr-2">
                <Star
                  v-if="etf.isFavorite"
                  class="h-4 w-4 fill-primary text-primary"
                  :data-testid="`etf-mobile-favorite-${etf.id}`"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  :data-testid="`etf-mobile-edit-${etf.id}`"
                  @click.stop="editEtf(etf)"
                >
                  <Pencil class="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  :data-testid="`etf-mobile-delete-${etf.id}`"
                  @click.stop="deleteEtf(etf)"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent
            :data-testid="`etf-mobile-content-${etf.id}`"
            class="pt-2"
          >
            <div
              class="grid grid-cols-1 gap-2 text-sm bg-muted/40 p-3 rounded-md"
            >
              <div class="flex justify-between gap-2">
                <span class="text-muted-foreground">{{ $t("ETF.wkn") }}</span>
                <span class="text-right">{{ etf.wkn }}</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-muted-foreground">{{
                  $t("ETF.ticker")
                }}</span>
                <span class="text-right">{{ etf.ticker }}</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-muted-foreground">{{
                  $t("ETFFlow.transactionCostsAbsolute")
                }}</span>
                <SpanAmount :amount="etf.transactionCostsAbsolute" />
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-muted-foreground">{{
                  $t("ETFFlow.transactionCostsRelative")
                }}</span>
                <span class="text-right">{{
                  relativeString(etf.transactionCostsRelative)
                }}</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-muted-foreground">{{
                  $t("ETFFlow.transactionCostsMaximum")
                }}</span>
                <SpanAmount :amount="etf.transactionCostsMaximum" />
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-muted-foreground">{{
                  $t("ETF.partialTaxExemption")
                }}</span>
                <span class="text-right">{{
                  relativeString(etf.partialTaxExemption)
                }}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </template>
  </div>
</template>

<script lang="ts" setup>
import SpanAmount from "@/components/common/SpanAmount.vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { Etf } from "@/model/etf/Etf";
import { formatNumber } from "@/tools/views/FormatNumber";
import { Pencil, Star, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

defineProps({
  etfs: {
    type: Array as PropType<Etf[]>,
    required: true,
  },
});

const emit = defineEmits(["deleteEtf", "editEtf"]);

const relativeString = (value: number | undefined): string => {
  if (value === undefined) {
    return "";
  }
  return `${formatNumber(value, 2)} %`;
};

const editEtf = (etf: Etf) => {
  emit("editEtf", etf);
};

const deleteEtf = (etf: Etf) => {
  emit("deleteEtf", etf);
};
</script>
