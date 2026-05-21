<template>
  <div
    data-testid="contractpartner-mobile-accordion"
    class="md:hidden w-full max-w-md mx-auto px-2 mb-6 space-y-3"
  >
    <div v-if="contractpartners.length === 0" data-testid="contractpartner-empty-mobile" class="w-full text-center text-muted-foreground mt-4">
      {{ $t('General.noEntries') }}
    </div>
    <Accordion v-else type="multiple" class="space-y-2">
      <AccordionItem
        v-for="mcp in contractpartners"
        :key="mcp.id"
        :value="`item-${mcp.id}`"
        :data-testid="`contractpartner-mobile-row-${mcp.id}`"
        class="border rounded-lg bg-background shadow-sm px-3 py-2"
      >
        <AccordionTrigger
          :data-testid="`contractpartner-mobile-trigger-${mcp.id}`"
          class="hover:no-underline"
        >
          <div class="flex items-center justify-between w-full gap-2">
            <div class="flex flex-col items-start text-left min-w-0">
              <span class="font-bold text-sm truncate">{{ mcp.name }}</span>
              <span class="text-xs text-muted-foreground">
                {{ mcp.postingAccountName || "-" }}
              </span>
            </div>
            <div class="flex items-center gap-1 pr-2">
              <Button
                variant="ghost"
                size="icon"
                :data-testid="`contractpartner-mobile-edit-${mcp.id}`"
                @click.stop="editContractpartner(mcp)"
              >
                <Pencil class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :data-testid="`contractpartner-mobile-delete-${mcp.id}`"
                @click.stop="deleteContractpartner(mcp)"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :data-testid="`contractpartner-mobile-accounts-${mcp.id}`"
                @click.stop="listContractpartnerAccounts(mcp)"
              >
                <Banknote class="h-4 w-4" />
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
                $t("General.validFrom")
              }}</span>
              <SpanDate :date="mcp.validFrom" />
            </div>
            <div class="flex justify-between gap-2">
              <span class="text-muted-foreground">{{
                $t("General.validTil")
              }}</span>
              <SpanDate :date="mcp.validTil" />
            </div>
            <div class="flex justify-between gap-2">
              <span class="text-muted-foreground">{{
                $t("Contractpartner.moneyflowComment")
              }}</span>
              <span class="text-right">{{ mcp.moneyflowComment }}</span>
            </div>
            <div class="flex justify-between gap-2">
              <span class="text-muted-foreground">{{
                $t("General.postingAccount")
              }}</span>
              <span class="text-right">{{ mcp.postingAccountName }}</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<script lang="ts" setup>
import SpanDate from "@/components/SpanDate.vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import { Banknote, Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

defineProps({
  contractpartners: {
    type: Array as PropType<Contractpartner[]>,
    required: true,
  },
});

const emit = defineEmits([
  "deleteContractpartner",
  "editContractpartner",
  "listContractpartnerAccounts",
]);

const deleteContractpartner = (mcp: Contractpartner) => {
  emit("deleteContractpartner", mcp);
};

const editContractpartner = (mcp: Contractpartner) => {
  emit("editContractpartner", mcp);
};

const listContractpartnerAccounts = (mcp: Contractpartner) => {
  emit("listContractpartnerAccounts", mcp);
};
</script>
