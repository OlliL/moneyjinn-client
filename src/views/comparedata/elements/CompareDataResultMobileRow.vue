<template>
  <AccordionItem
    :value="'item-' + rowIndex"
    class="border rounded-lg bg-card shadow-sm px-3 py-1"
  >
    <AccordionTrigger class="hover:no-underline w-full min-w-0">
      <div class="flex flex-col w-full gap-1 text-left min-w-0">
        <!-- Meta Info & Amount Row -->
        <div class="flex justify-between items-center w-full">
          <div
            class="flex items-center gap-1.5 text-xs text-muted-foreground font-normal"
          >
            <Calendar class="icon-extra-small shrink-0" />
            <SpanDate :date="displayDate" />
            <div class="flex gap-1 ml-1">
              <Database v-if="mmf" class="icon-extra-small text-blue-500/70" />
              <FileText
                v-if="importData"
                class="icon-extra-small text-orange-500/70"
              />
            </div>
          </div>
          <div class="text-right shrink-0">
            <span class="font-extrabold text-sm">
              <SpanAmount :amount="displayAmount" />
            </span>
          </div>
        </div>
        <!-- Hero Title (Partner or Multi-line Comment) -->
        <div
          :class="[
            isHeroComment
              ? 'line-clamp-3 text-sm leading-tight text-foreground/90'
              : 'truncate text-base',
            'font-bold pr-4',
          ]"
        >
          {{ heroTitle }}
        </div>
      </div>
    </AccordionTrigger>

    <AccordionContent class="pt-3 pb-2 space-y-4 border-t mt-2">
      <!-- Database Block -->
      <div v-if="mmf" class="space-y-1.5">
        <div
          class="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400"
        >
          <Database class="h-3 w-3" /> {{ $t("CompareData.database") }}
        </div>
        <div
          class="bg-muted/40 p-2.5 rounded-md text-xs space-y-2 border border-blue-100 dark:border-blue-900/30"
        >
          <div class="grid grid-cols-2 gap-x-4 gap-y-1">
            <div class="flex flex-col">
              <span class="text-[10px] text-muted-foreground">{{
                $t("Moneyflow.bookingdate")
              }}</span>
              <SpanDate :date="mmf.bookingDate" />
            </div>
            <div class="flex flex-col text-right">
              <span class="text-[10px] text-muted-foreground">{{
                $t("General.amount")
              }}</span>
              <SpanAmount :amount="mmf.amount" class="font-semibold" />
            </div>
          </div>
          <div class="flex flex-col border-t pt-1.5">
            <span class="text-[10px] text-muted-foreground">{{
              $t("General.contractpartner")
            }}</span>
            <span class="font-medium">{{ mmf.contractpartnerName }}</span>
          </div>
          <div v-if="mmf.comment" class="flex flex-col">
            <span class="text-[10px] text-muted-foreground">{{
              $t("General.comment")
            }}</span>
            <span class="italic">{{ mmf.comment }}</span>
          </div>
          <div
            class="flex items-center gap-1.5 text-muted-foreground pt-1 border-t italic"
          >
            <CreditCard class="h-3 w-3" /> {{ mmf.capitalsourceComment }}
          </div>
        </div>
      </div>

      <!-- Source Block -->
      <div v-if="importData" class="space-y-1.5">
        <div
          class="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400"
        >
          <FileText class="h-3 w-3" /> {{ $t("CompareData.source") }}
        </div>
        <div
          class="bg-orange-50/50 dark:bg-orange-950/20 p-2.5 rounded-md text-xs space-y-2 border border-orange-100 dark:border-orange-900/30"
        >
          <div class="grid grid-cols-2 gap-x-4 gap-y-1">
            <div class="flex flex-col">
              <span class="text-[10px] text-muted-foreground">{{
                $t("Moneyflow.bookingdate")
              }}</span>
              <SpanDate :date="importData.bookingDate" />
            </div>
            <div class="flex flex-col text-right">
              <span class="text-[10px] text-muted-foreground">{{
                $t("General.amount")
              }}</span>
              <SpanAmount :amount="importData.amount" class="font-semibold" />
            </div>
          </div>
          <div class="flex flex-col border-t pt-1.5">
            <span class="text-[10px] text-muted-foreground">{{
              $t("General.contractpartner")
            }}</span>
            <span class="font-medium">{{
              importData.partner || importData.contractpartnerName
            }}</span>
          </div>
          <div v-if="importData.comment" class="flex flex-col">
            <span class="text-[10px] text-muted-foreground">{{
              $t("General.comment")
            }}</span>
            <SpanImportComment :comment="importData.comment" />
          </div>
          <div
            class="flex items-center gap-1.5 text-muted-foreground pt-1 border-t italic"
          >
            <CreditCard class="h-3 w-3" /> {{ capitalsourceComment }}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-2 pt-2">
        <template v-if="mmf && isOwnMoneyflow">
          <Button
            variant="outline"
            size="sm"
            class="flex-1 gap-2"
            @click="editMoneyflow"
          >
            <Pencil class="h-3.5 w-3.5" /> {{ $t("General.edit") }}
          </Button>
          <Button
            variant="outline"
            size="sm"
            class="flex-1 gap-2 text-destructive hover:bg-destructive/10"
            @click="deleteMoneyflow"
          >
            <Trash2 class="h-3.5 w-3.5" /> {{ $t("General.delete") }}
          </Button>
        </template>
        <Button
          v-if="importData"
          variant="default"
          size="sm"
          :class="['gap-2', mmf ? 'flex-1' : 'w-full']"
          @click="createMoneyflow"
        >
          <Plus class="h-3.5 w-3.5" /> {{ $t("General.new") }}
        </Button>
      </div>
    </AccordionContent>
  </AccordionItem>
</template>

<script lang="ts" setup>
import SpanAmount from "@/components/common/SpanAmount.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import SpanImportComment from "@/components/common/SpanImportComment.vue";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { CompareDataDataset } from "@/model/comparedata/CompareDataDataset";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import {
  Calendar,
  CreditCard,
  Database,
  FileText,
  Pencil,
  Plus,
  Trash2,
} from "lucide-vue-next";
import { computed, type PropType } from "vue";

const props = defineProps({
  mmf: { type: Object as PropType<Moneyflow>, required: false },
  importData: { type: Object as PropType<CompareDataDataset>, required: false },
  capitalsourceId: { type: Number, required: true },
  capitalsourceComment: { type: String, required: true },
  rowIndex: { type: Number, required: true },
});

const emit = defineEmits([
  "deleteMoneyflow",
  "editMoneyflow",
  "createMoneyflow",
]);
const userSessionStore = useUserSessionStore();

const displayDate = computed(
  () => props.mmf?.bookingDate || props.importData?.bookingDate,
);
const displayAmount = computed(
  () => props.mmf?.amount ?? props.importData?.amount,
);
const isOwnMoneyflow = computed(() =>
  props.mmf ? props.mmf.userId === userSessionStore.getUserId : false,
);

const heroTitle = computed(() => {
  const partner =
    props.mmf?.contractpartnerName ||
    props.importData?.partner ||
    props.importData?.contractpartnerName;

  if (partner) return partner;

  return props.importData?.comment || props.importData?.moneyflowComment || "";
});

const isHeroComment = computed(() => {
  return !(
    props.mmf?.contractpartnerName ||
    props.importData?.partner ||
    props.importData?.contractpartnerName
  );
});

const deleteMoneyflow = () =>
  props.mmf && emit("deleteMoneyflow", props.mmf.id);
const editMoneyflow = () => props.mmf && emit("editMoneyflow", props.mmf.id);
const createMoneyflow = () => {
  if (!props.importData) return;
  const moneyflowToCreate = {
    id: 0,
    bookingDate: props.importData.bookingDate,
    invoiceDate: props.importData.invoiceDate,
    amount: props.importData.amount,
    comment: props.importData.moneyflowComment || props.importData.comment,
    capitalsourceId: props.capitalsourceId,
    contractpartnerId: props.importData.contractpartnerId,
    contractpartnerName: props.importData.contractpartnerName,
    postingAccountId: props.importData.postingAccountId,
    postingAccountName: props.importData.postingAccountName,
  } as Moneyflow;
  emit("createMoneyflow", moneyflowToCreate);
};
</script>

<style scoped>
/* Verhindert, dass das Accordion-Icon (Chevron) das Layout in der Trigger-Zeile verschiebt */
:deep([data-radix-collection-item]) {
  display: flex;
  align-items: center;
}
</style>
