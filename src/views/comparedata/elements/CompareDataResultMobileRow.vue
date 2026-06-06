<template>
  <AccordionItem
    :value="'item-' + rowIndex"
    class="border rounded-lg bg-card shadow-sm px-3 py-1"
  >
    <AccordionTrigger class="hover:no-underline w-full min-w-0">
      <div class="grid grid-cols-[1fr_auto] items-center w-full gap-2">
        <div class="flex flex-col items-start text-left min-w-0 gap-1">
          <!-- Meta Info -->
          <div
            class="flex items-center gap-1.5 text-xs text-muted-foreground font-normal truncate w-full"
          >
            <div class="flex items-center gap-1.5 truncate">
              <Calendar class="icon-extra-small shrink-0" />
              <SpanDate :date="displayDate" />
              <template v-if="displayInvoiceDate">
                <CalendarDays
                  class="icon-extra-small shrink-0 ml-1 text-muted-foreground/60"
                />
                <SpanDate :date="displayInvoiceDate" />
              </template>
              <div class="flex gap-1 ml-1">
                <Database
                  v-if="mmf"
                  class="icon-extra-small text-blue-500/70"
                />
                <FileText
                  v-if="importData"
                  class="icon-extra-small text-orange-500/70"
                />
              </div>
            </div>
          </div>

          <!-- Hero Title (Partner or Multi-line Comment) -->
          <div class="flex items-start gap-1.5 font-bold pr-4 min-w-0 w-full">
            <Handshake v-if="!isHeroComment" class="icon-small shrink-0 mt-1" />
            <MessageSquareMore
              v-else
              class="icon-small shrink-0 mt-1 text-muted-foreground/70"
            />
            <div
              :class="[
                isHeroComment
                  ? 'line-clamp-3 text-sm leading-tight text-foreground/90 font-normal'
                  : 'truncate text-base',
                'min-w-0 flex-1',
              ]"
            >
              {{ heroTitle }}
            </div>
          </div>
        </div>

        <!-- Amount & Actions -->
        <div class="flex flex-col items-end gap-1.5 shrink-0 text-right">
          <span
            class="font-extrabold text-sm text-foreground"
            :class="{
              'border-b border-double border-foreground':
                mmf?.moneyflowSplitEntries?.length,
            }"
          >
            <SpanAmount :amount="displayAmount" />
          </span>
          <div class="flex gap-0.5">
            <template v-if="mmf && isOwnMoneyflow">
              <Button
                variant="ghost"
                size="icon"
                class="h-7 w-7"
                @click.stop="moneyflowActions.edit(mmf.id)"
              >
                <Pencil class="icon-small" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                class="h-7 w-7 text-destructive"
                @click.stop="moneyflowActions.delete(mmf.id)"
              >
                <Trash2 class="icon-small" />
              </Button>
            </template>
            <Button
              v-if="importData"
              variant="ghost"
              size="icon"
              class="h-7 w-7 text-primary"
              @click.stop="createMoneyflow"
            >
              <Plus class="icon-small" />
            </Button>
          </div>
        </div>
      </div>
    </AccordionTrigger>

    <AccordionContent class="pt-3 pb-1 space-y-4 border-t mt-2">
      <!-- Database Block -->
      <div v-if="mmf" class="space-y-1.5">
        <div
          class="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400"
        >
          <Database class="icon-extra-small" /> {{ $t("CompareData.database") }}
        </div>
        <div
          class="bg-muted/40 p-2.5 rounded-md text-xs space-y-2 border border-blue-100 dark:border-blue-900/30"
        >
          <div class="grid grid-cols-2 gap-x-4 gap-y-2">
            <div class="flex flex-col">
              <span
                class="text-[10px] text-muted-foreground flex items-center gap-1"
              >
                <Calendar class="icon-extra-small" />
                {{ $t("Moneyflow.bookingdate") }}
              </span>
              <SpanDate :date="mmf.bookingDate" />
            </div>
            <div class="flex flex-col text-right">
              <span
                class="text-[10px] text-muted-foreground flex items-center gap-1 justify-end"
              >
                <CalendarDays class="icon-extra-small" />
                {{ $t("Moneyflow.invoicedate") }}
              </span>
              <SpanDate :date="mmf.invoiceDate" />
            </div>
            <div class="flex flex-col">
              <span
                class="text-[10px] text-muted-foreground flex items-center gap-1"
              >
                <Handshake class="icon-extra-small" />
                {{ $t("General.contractpartner") }}
              </span>
              <span class="font-medium truncate">{{
                mmf.contractpartnerName
              }}</span>
            </div>
            <div class="flex flex-col text-right">
              <span class="text-[10px] text-muted-foreground">{{
                $t("General.amount")
              }}</span>
              <SpanAmount :amount="mmf.amount" class="font-semibold" />
            </div>
          </div>
          <div v-if="mmf.comment" class="flex flex-col border-t pt-1.5">
            <span
              class="text-[10px] text-muted-foreground flex items-center gap-1"
            >
              <MessageSquareMore class="icon-extra-small" />
              {{ $t("General.comment") }}
            </span>
            <span class="whitespace-normal break-words">{{ mmf.comment }}</span>
          </div>
          <div
            class="flex items-center gap-1.5 text-muted-foreground pt-1 border-t italic"
          >
            <CreditCard class="icon-extra-small" />
            {{ mmf.capitalsourceComment }}
          </div>
        </div>
      </div>

      <!-- Source Block -->
      <div v-if="importData" class="space-y-1.5">
        <div
          class="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400"
        >
          <FileText class="icon-extra-small" /> {{ $t("CompareData.source") }}
        </div>
        <div
          class="bg-orange-50/50 dark:bg-orange-950/20 p-2.5 rounded-md text-xs space-y-2 border border-orange-100 dark:border-orange-900/30"
        >
          <div class="grid grid-cols-2 gap-x-4 gap-y-2">
            <div class="flex flex-col">
              <span
                class="text-[10px] text-muted-foreground flex items-center gap-1"
              >
                <Calendar class="icon-extra-small" />
                {{ $t("Moneyflow.bookingdate") }}
              </span>
              <SpanDate :date="importData.bookingDate" />
            </div>
            <div class="flex flex-col text-right">
              <span
                class="text-[10px] text-muted-foreground flex items-center gap-1 justify-end"
              >
                <CalendarDays class="icon-extra-small" />
                {{ $t("Moneyflow.invoicedate") }}
              </span>
              <SpanDate :date="importData.invoiceDate" />
            </div>
            <div class="flex flex-col">
              <span
                class="text-[10px] text-muted-foreground flex items-center gap-1"
              >
                <Handshake class="icon-extra-small" />
                {{ $t("General.contractpartner") }}
              </span>
              <span class="font-medium truncate">{{
                importData.partner || importData.contractpartnerName
              }}</span>
            </div>
            <div class="flex flex-col text-right">
              <span class="text-[10px] text-muted-foreground">{{
                $t("General.amount")
              }}</span>
              <SpanAmount :amount="importData.amount" class="font-semibold" />
            </div>
          </div>
          <div v-if="importData.comment" class="flex flex-col border-t pt-1.5">
            <span
              class="text-[10px] text-muted-foreground flex items-center gap-1"
            >
              <MessageSquareMore class="icon-extra-small" />
              {{ $t("General.comment") }}
            </span>
            <SpanImportComment :comment="importData.comment" />
          </div>
          <div
            class="flex items-center gap-1.5 text-muted-foreground pt-1 border-t italic"
          >
            <CreditCard class="icon-extra-small" /> {{ capitalsourceComment }}
          </div>
        </div>
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
import { CompareDataActionsKey } from "@/model/CrudActions";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import {
  Calendar,
  CalendarDays,
  CreditCard,
  Database,
  FileText,
  Handshake,
  MessageSquareMore,
  Pencil,
  Plus,
  Trash2,
} from "lucide-vue-next";
import { computed, inject } from "vue";

const props = defineProps<{
  mmf?: Moneyflow;
  importData?: CompareDataDataset;
  capitalsourceId: number;
  capitalsourceComment: string;
  rowIndex: number;
}>();

const userSessionStore = useUserSessionStore();

const displayDate = computed(
  () => props.mmf?.bookingDate || props.importData?.bookingDate,
);
const displayAmount = computed(
  () => props.mmf?.amount ?? props.importData?.amount,
);
const displayInvoiceDate = computed(
  () => props.mmf?.invoiceDate || props.importData?.invoiceDate,
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

const isHeroComment = computed(
  () =>
    !(
      props.mmf?.contractpartnerName ||
      props.importData?.partner ||
      props.importData?.contractpartnerName
    ),
);

const moneyflowActions = inject(CompareDataActionsKey)!;

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
    contractpartnerMatchingId: props.importData?.contractpartnerMatchingId,
  } as Moneyflow;
  moneyflowActions.create(moneyflowToCreate);
};
</script>

<style scoped>
:deep([data-radix-collection-item]) {
  display: flex;
  align-items: center;
}
</style>
