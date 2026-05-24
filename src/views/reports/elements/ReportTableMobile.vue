<template>
  <div class="fixed bottom-12 right-6 z-50 md:hidden">
    <Sheet v-model:open="isSheetOpen">
      <SheetTrigger as-child>
        <Button
          data-testid="report-table-mobile-filter-trigger"
          class="h-12 w-12 p-0 rounded-full shadow-lg flex items-center justify-center"
        >
          <Filter class="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        data-testid="report-table-mobile-filter-sheet"
        side="bottom"
        class="h-[75vh] rounded-t-xl p-6 flex flex-col"
      >
        <SheetHeader class="text-left pb-4 border-b shrink-0">
          <SheetTitle>{{ $t("Reports.filterData") }}</SheetTitle>
          <SheetDescription class="sr-only">
            {{ $t("Reports.filterData") }}
          </SheetDescription>
        </SheetHeader>

        <form
          @submit.prevent="handleEnter"
          @keydown.enter.prevent="handleEnter"
          class="flex-1 overflow-y-auto space-y-4 pb-8 px-0.5"
        >
          <div class="space-y-2 border-b pb-4">
            <p class="text-sm font-semibold px-0.5">
              {{ $t("Moneyflow.orderBy") }}
            </p>
            <div class="grid grid-cols-2 gap-1.5">
              <Button
                v-for="option in sortOptions"
                :key="option.field"
                variant="outline"
                size="sm"
                class="justify-between px-3 h-9 font-normal text-xs transition-all"
                :class="{
                  'bg-primary/15 border-primary text-primary font-bold shadow-sm ring-1 ring-primary/20':
                    props.sortBy.has(option.field),
                }"
                @click="sortByColumn(option.field)"
              >
                <span class="truncate mr-1">{{ $t(option.label) }}</span>
                <component
                  :is="getSortIcon(option.field)"
                  class="h-3.5 w-3.5 shrink-0"
                  :class="
                    props.sortBy.has(option.field)
                      ? 'text-primary'
                      : 'text-muted-foreground/50'
                  "
                />
              </Button>
            </div>
          </div>

          <InputStandard
            v-model="filterCapitalsource"
            id="report-table-mobile-filter-capitalsource"
            :field-label="t('General.capitalsource')"
            :placeholder="$t('General.enterFilter')"
            enterkeyhint="send"
          >
            <template #button>
              <Button
                data-testid="report-table-mobile-filter-capitalsource-reset"
                type="button"
                variant="outline"
                size="icon"
                @click="filterCapitalsource = ''"
                class="rounded-l-none border-l"
              >
                <X class="icon-small" />
              </Button>
            </template>
          </InputStandard>

          <InputStandard
            v-model="filterContractpartner"
            id="report-table-mobile-filter-contractpartner"
            :field-label="t('General.contractpartner')"
            :placeholder="$t('General.enterFilter')"
            enterkeyhint="send"
          >
            <template #button>
              <Button
                data-testid="report-table-mobile-filter-contractpartner-reset"
                type="button"
                variant="outline"
                size="icon"
                @click="filterContractpartner = ''"
                class="rounded-l-none border-l"
              >
                <X class="icon-small" />
              </Button>
            </template>
          </InputStandard>

          <InputStandard
            v-model="filterComment"
            id="report-table-mobile-filter-comment"
            :field-label="t('General.comment')"
            :placeholder="$t('General.enterFilter')"
            enterkeyhint="send"
          >
            <template #button>
              <Button
                data-testid="report-table-mobile-filter-comment-reset"
                type="button"
                variant="outline"
                size="icon"
                @click="filterComment = ''"
                class="rounded-l-none border-l"
              >
                <X class="icon-small" />
              </Button>
            </template>
          </InputStandard>

          <InputStandard
            v-model="filterPostingAccount"
            id="report-table-mobile-filter-postingAccount"
            :field-label="t('General.postingAccount')"
            :placeholder="$t('General.enterFilter')"
            enterkeyhint="send"
          >
            <template #button>
              <Button
                data-testid="report-table-mobile-filter-postingAccount-reset"
                type="button"
                variant="outline"
                size="icon"
                @click="filterPostingAccount = ''"
                class="rounded-l-none border-l"
              >
                <X class="icon-small" />
              </Button>
            </template>
          </InputStandard>
        </form>
      </SheetContent>
    </Sheet>
  </div>

  <div class="md:hidden w-full max-w-md mx-auto px-2 mb-6 space-y-3">
    <div
      class="p-2 bg-muted/60 text-xs rounded-md text-center text-muted-foreground font-medium flex items-center justify-center gap-1.5 flex-wrap"
    >
      <span>
        {{
          $t("Reports.howManyFlowsShownMessage", {
            num: moneyflows.length,
            all: moneyflowsCount || 0,
          })
        }}
      </span>
      <template v-if="activeSort">
        <span class="text-muted-foreground/30">•</span>
        <div
          class="flex items-center gap-1 text-primary/80 cursor-pointer active:opacity-60 transition-opacity whitespace-nowrap"
          @click="sortByColumn(activeSort.field)"
        >
          <span class="truncate">{{ $t(activeSort.label) }}</span>
          <component :is="activeSort.icon" class="h-3 w-3 shrink-0" />
        </div>
      </template>
    </div>

    <Accordion type="multiple" class="space-y-2">
      <AccordionItem
        v-for="mmf in moneyflows"
        :key="'mobile-' + mmf.id"
        :value="'item-' + mmf.id"
        :data-testid="`report-mobile-moneyflow-row-${mmf.id}`"
        class="border rounded-lg bg-background shadow-sm px-3 py-1"
        :class="{ 'border-destructive/30 bg-destructive/5': mmf.private }"
      >
        <AccordionTrigger class="hover:no-underline w-full min-w-0">
          <div class="grid grid-cols-[1fr_auto] items-center w-full gap-2">
            <div class="flex flex-col items-start text-left overflow-hidden">
              <div
                class="flex items-center gap-1.5 text-xs text-muted-foreground font-normal truncate w-full"
              >
                <Calendar
                  class="icon-extra-small text-muted-foreground/60 shrink-0"
                />
                <SpanDate :date="mmf.bookingDate" />

                <span
                  v-if="mmf.private"
                  class="bg-destructive/20 text-destructive px-1 rounded text-[10px]"
                >
                  {{ $t("Moneyflow.private") }}
                </span>
                <span
                  v-if="mmf.moneyflowSplitEntries?.length"
                  class="bg-primary/20 text-primary px-1 rounded text-[10px]"
                >
                  {{ $t("Moneyflow.subbookings") }}
                </span>
              </div>

              <div class="flex items-center gap-1 min-w-0 truncate">
                <Handshake
                  class="icon-small shrink-0 text-foreground/80"
                  :title="$t('General.contractpartner')"
                />
                <span
                  class="font-bold text-base text-foreground truncate w-full"
                  >{{ mmf.contractpartnerName }}</span
                >
              </div>
            </div>

            <div class="flex flex-col items-end gap-1.5 shrink-0 text-right">
              <span
                class="font-extrabold text-sm text-foreground"
                :class="{
                  'border-b border-double border-foreground':
                    mmf.moneyflowSplitEntries?.length,
                }"
              >
                <SpanAmount :amount="mmf.amount" />
              </span>

              <div class="flex gap-0.5">
                <Button
                  v-if="mmf.hasReceipt"
                  :data-testid="`report-mobile-moneyflow-receipt-${mmf.id}`"
                  variant="ghost"
                  size="icon"
                  class="h-7 w-7"
                  @click.stop="showReceipt(mmf.id)"
                >
                  <ReceiptText class="h-3.5 w-3.5" />
                </Button>
                <Button
                  v-if="mmf.userId === userSessionStore.getUserId"
                  :data-testid="`report-mobile-moneyflow-edit-${mmf.id}`"
                  variant="ghost"
                  size="icon"
                  class="h-7 w-7"
                  @click.stop="editMoneyflow(mmf)"
                >
                  <Pencil class="h-3.5 w-3.5" />
                </Button>
                <Button
                  v-if="mmf.userId === userSessionStore.getUserId"
                  :data-testid="`report-mobile-moneyflow-delete-${mmf.id}`"
                  variant="ghost"
                  size="icon"
                  class="h-7 w-7 text-destructive"
                  @click.stop="deleteMoneyflow(mmf)"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </Button>
                <Button
                  v-if="mmf.userId !== userSessionStore.getUserId"
                  :data-testid="`report-mobile-moneyflow-list-${mmf.id}`"
                  variant="ghost"
                  size="icon"
                  class="h-7 w-7"
                  @click.stop="listMoneyflow(mmf)"
                >
                  <Eye class="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent class="pt-3 pb-1 space-y-2 border-t mt-2">
          <div
            class="text-xs text-muted-foreground bg-muted/40 p-2 rounded space-y-2"
          >
            <div
              class="flex items-center gap-1.5 break-all w-full"
              v-if="!mmf.moneyflowSplitEntries?.length"
            >
              <MessageSquareMore
                class="icon-extra-small shrink-0 text-foreground"
                :title="$t('General.comment')"
              />
              <span class="text-foreground">{{ mmf.comment }}</span>
            </div>

            <div
              class="grid grid-cols-2 gap-2 text-xs text-muted-foreground/80 pt-0.5 border-t border-muted/60 mt-1"
            >
              <div class="flex items-center gap-1 min-w-0 truncate">
                <CreditCard
                  class="icon-extra-small shrink-0 text-muted-foreground/80"
                  :title="$t('General.capitalsource')"
                />
                {{ mmf.capitalsourceComment }}
              </div>
              <div
                v-if="
                  mmf.postingAccountName && !mmf.moneyflowSplitEntries?.length
                "
                class="flex items-center gap-1 min-w-0 truncate"
              >
                <Tag
                  class="icon-extra-small shrink-0 text-muted-foreground/80"
                  :title="$t('General.postingAccount')"
                />
                {{ mmf.postingAccountName }}
              </div>
            </div>
          </div>

          <div
            v-if="mmf.moneyflowSplitEntries?.length"
            class="pl-3 border-l-2 border-primary/30 space-y-1.5 pt-0.5"
          >
            <div
              class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1"
            >
              {{ $t("Moneyflow.subbookings") }}
            </div>
            <div
              v-for="mse in mmf.moneyflowSplitEntries"
              :key="mse.id"
              class="flex justify-between items-start text-xs bg-muted/20 p-2 rounded gap-2"
            >
              <div class="flex flex-col min-w-0 text-left">
                <div class="flex items-center gap-1 min-w-0 truncate">
                  <MessageSquareMore
                    class="icon-extra-small shrink-0 text-muted-foreground/80"
                    :title="$t('General.comment')"
                  />
                  <span class="font-medium text-foreground text-xs truncate">{{
                    mse.comment
                  }}</span>
                </div>
                <div class="flex items-center gap-1 min-w-0 truncate">
                  <Tag
                    class="icon-extra-small shrink-0 text-muted-foreground/80"
                    :title="$t('General.postingAccount')"
                  />
                  <span class="text-xs-muted truncate">{{
                    mse.postingAccountName
                  }}</span>
                </div>
              </div>
              <span
                class="font-semibold text-[11px] shrink-0 text-muted-foreground"
              >
                <SpanAmount :amount="mse.amount" />
              </span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    <div
      v-if="moneyflows.length === 0"
      data-testid="report-table-empty-mobile"
      class="p-4 border rounded-lg bg-muted/40 flex justify-center items-center text-sm font-bold shadow-sm text-muted-foreground"
    >
      {{ $t("General.noEntries") }}
    </div>
    <div
      v-else
      class="p-4 border rounded-lg bg-muted/40 flex justify-between items-center text-sm font-bold shadow-sm"
    >
      <span>{{ $t("Reports.overallSums") }}</span>
      <span class="underline decoration-double text-base">
        <SpanAmount :amount="amountSum" />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import InputStandard from "@/components/common/InputStandard.vue";
import SpanAmount from "@/components/common/SpanAmount.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpNarrowWide,
  Calendar,
  CreditCard,
  Eye,
  Filter,
  Handshake,
  MessageSquareMore,
  Pencil,
  ReceiptText,
  Tag,
  Trash2,
  X,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  moneyflows: Moneyflow[];
  moneyflowsCount: number;
  amountSum: number;
  sortBy: Map<keyof Moneyflow, boolean>;
}>();

const filterContractpartner = defineModel<string>("filterContractpartner", {
  default: "",
});
const filterComment = defineModel<string>("filterComment", { default: "" });
const filterPostingAccount = defineModel<string>("filterPostingAccount", {
  default: "",
});
const filterCapitalsource = defineModel<string>("filterCapitalsource", {
  default: "",
});
const emit = defineEmits<{
  sortByColumn: [field: keyof Moneyflow];
  showReceipt: [id: number];
  editMoneyflow: [moneyflow: Moneyflow];
  deleteMoneyflow: [moneyflow: Moneyflow];
  listMoneyflow: [moneyflow: Moneyflow];
}>();

const userSessionStore = useUserSessionStore();
const isSheetOpen = ref(false);

const showReceipt = (id: number) => {
  emit("showReceipt", id);
};

const editMoneyflow = (moneyflow: Moneyflow) => {
  emit("editMoneyflow", moneyflow);
};

const deleteMoneyflow = (moneyflow: Moneyflow) => {
  emit("deleteMoneyflow", moneyflow);
};

const listMoneyflow = (moneyflow: Moneyflow) => {
  emit("listMoneyflow", moneyflow);
};

const handleEnter = (event: Event): void => {
  event.preventDefault();
  event.stopPropagation();
  isSheetOpen.value = false;
};

const sortOptions: { field: keyof Moneyflow; label: string }[] = [
  { field: "bookingDate", label: "Moneyflow.bookingdate" },
  { field: "amount", label: "General.amount" },
  { field: "contractpartnerName", label: "General.contractpartner" },
  { field: "comment", label: "General.comment" },
  { field: "postingAccountName", label: "General.postingAccount" },
  { field: "capitalsourceComment", label: "General.capitalsource" },
];

const getDirectionIcon = (direction: boolean | undefined) => {
  if (direction === undefined) return ArrowUpDown;
  return direction ? ArrowUpNarrowWide : ArrowDownWideNarrow;
};

const activeSort = computed(() => {
  const entry = props.sortBy.entries().next().value;
  if (!entry) return null;

  const [field, direction] = entry as [keyof Moneyflow, boolean];
  const option = sortOptions.find((opt) => opt.field === field);

  return {
    label: option?.label || field,
    icon: getDirectionIcon(direction),
    field,
  };
});

const sortByColumn = (field: keyof Moneyflow) => {
  emit("sortByColumn", field);
};

const getSortIcon = (field: keyof Moneyflow) => {
  return getDirectionIcon(props.sortBy.get(field));
};
</script>
