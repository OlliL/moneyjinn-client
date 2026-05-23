<template>
  <div
    data-testid="predef-moneyflow-mobile-accordion"
    class="md:hidden w-full max-w-md mx-auto px-2 mb-6 space-y-3"
  >
    <template v-if="preDefMoneyflows.length === 0">
      <div
        data-testid="predef-moneyflow-empty-mobile"
        class="w-full text-center text-muted-foreground my-8"
      >
        {{ $t("General.noEntries") }}
      </div>
    </template>
    <template v-else>
      <Accordion type="multiple" class="space-y-2">
        <AccordionItem
          v-for="mpm in preDefMoneyflows"
          :key="mpm.id"
          :value="`item-${mpm.id}`"
          :data-testid="`predef-moneyflow-mobile-row-${mpm.id}`"
          class="border rounded-lg bg-background shadow-sm px-3 py-2"
        >
          <AccordionTrigger class="hover:no-underline w-full min-w-0">
            <div
              :data-testid="`predef-moneyflow-mobile-trigger-${mpm.id}`"
              class="grid grid-cols-[1fr_auto] items-center w-full gap-2"
            >
              <div class="flex flex-col items-start text-left overflow-hidden">
                <span class="font-bold text-sm truncate w-full">{{
                  mpm.contractpartnerName
                }}</span>
                <span class="text-xs text-muted-foreground">{{
                  mpm.comment
                }}</span>
              </div>
              <div class="flex items-center gap-1 pr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  :data-testid="`predef-moneyflow-mobile-edit-${mpm.id}`"
                  @click.stop="editPreDefMoneyflow(mpm)"
                >
                  <Pencil class="icon-small" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  :data-testid="`predef-moneyflow-mobile-delete-${mpm.id}`"
                  @click.stop="deletePreDefMoneyflow(mpm)"
                >
                  <Trash2 class="icon-small" />
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
                  $t("General.amount")
                }}</span>
                <SpanAmount :amount="mpm.amount" />
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-muted-foreground">{{
                  $t("General.postingAccount")
                }}</span>
                <span class="text-right">{{ mpm.postingAccountName }}</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-muted-foreground">{{
                  $t("General.capitalsource")
                }}</span>
                <span class="text-right">{{ mpm.capitalsourceComment }}</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-muted-foreground">{{
                  $t("PreDefMoneyflow.onceAMonthShort")
                }}</span>
                <SpanBoolean :value="mpm.onceAMonth" />
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-muted-foreground">{{
                  $t("PreDefMoneyflow.createDate")
                }}</span>
                <SpanDate :date="mpm.createDate" />
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-muted-foreground">{{
                  $t("PreDefMoneyflow.lastUsed")
                }}</span>
                <SpanDate :date="mpm.lastUsed" />
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
import SpanBoolean from "@/components/common/SpanBoolean.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

defineProps({
  preDefMoneyflows: {
    type: Array as PropType<PreDefMoneyflow[]>,
    required: true,
  },
});

const emit = defineEmits(["editPreDefMoneyflow", "deletePreDefMoneyflow"]);

const editPreDefMoneyflow = (mpm: PreDefMoneyflow) => {
  emit("editPreDefMoneyflow", mpm);
};

const deletePreDefMoneyflow = (mpm: PreDefMoneyflow) => {
  emit("deletePreDefMoneyflow", mpm);
};
</script>
