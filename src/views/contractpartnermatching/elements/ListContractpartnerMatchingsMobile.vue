<template>
  <div
    data-testid="contractpartner-matching-mobile-accordion"
    class="md:hidden w-full max-w-md mx-auto px-2 mb-6 space-y-3"
  >
    <Accordion type="multiple" class="space-y-2">
      <AccordionItem
        v-for="mcm in contractpartnerMatchings"
        :key="mcm.id"
        :value="`item-${mcm.id}`"
        :data-testid="`contractpartner-matching-mobile-row-${mcm.id}`"
        class="border rounded-lg bg-background shadow-sm px-3 py-1"
      >
        <AccordionTrigger class="hover:no-underline w-full min-w-0">
          <div
            :data-testid="`contractpartner-matching-mobile-trigger-${mcm.id}`"
            class="grid grid-cols-[1fr_auto] items-center w-full gap-2"
          >
            <div class="flex flex-col items-start text-left overflow-hidden">
              <span class="font-bold text-sm truncate w-full">{{
                mcm.matchingText
              }}</span>
              <span class="text-xs text-muted-foreground">{{
                mcm.contractpartnerName
              }}</span>
            </div>
            <div class="flex items-center gap-1 pr-2">
              <Button
                variant="ghost"
                size="icon"
                :data-testid="`contractpartner-matching-mobile-edit-${mcm.id}`"
                @click.stop="editContractpartnerMatching(mcm)"
              >
                <Pencil class="icon-medium" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :data-testid="`contractpartner-matching-mobile-delete-${mcm.id}`"
                @click.stop="deleteContractpartnerMatching(mcm)"
              >
                <Trash2 class="icon-medium" />
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
                $t("Contractpartner.moneyflowComment")
              }}</span>
              <span class="text-right">{{ mcm.moneyflowComment }}</span>
            </div>
            <div class="flex justify-between gap-2">
              <span class="text-muted-foreground">{{
                $t("General.postingAccount")
              }}</span>
              <span class="text-right">{{ mcm.postingAccountName }}</span>
            </div>
            <div class="flex justify-between gap-2">
              <span class="text-muted-foreground">{{
                $t("General.lastUsed")
              }}</span>
              <span class="text-right"><SpanDate :date="mcm.lastUsed" /></span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<script lang="ts" setup>
import SpanDate from "@/components/common/SpanDate.vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

defineProps({
  contractpartnerMatchings: {
    type: Array as PropType<ContractpartnerMatching[]>,
    required: true,
  },
});

const emit = defineEmits([
  "editContractpartnerMatching",
  "deleteContractpartnerMatching",
]);

const editContractpartnerMatching = (mcm: ContractpartnerMatching) => {
  emit("editContractpartnerMatching", mcm);
};

const deleteContractpartnerMatching = (mcm: ContractpartnerMatching) => {
  emit("deleteContractpartnerMatching", mcm);
};
</script>
