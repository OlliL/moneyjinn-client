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
          <div class="space-y-2 pb-0">
            <p class="text-sm font-semibold px-0.5">
              {{ $t("General.displayOptions") }}
            </p>
            <div class="flex items-center gap-2 px-0.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                class="w-full justify-start gap-2 h-10 px-3 font-normal"
                :class="{
                  'bg-primary/10 border-primary text-primary font-bold':
                    showPlanned,
                }"
                @click="showPlanned = !showPlanned"
              >
                <CalendarClock class="icon-small" />
                {{ $t("Moneyflow.reserved") }}
              </Button>
            </div>
          </div>
          <div class="space-y-2 pb-1">
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
                  class="icon-small shrink-0"
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
            :placeholder="
              t('General.capitalsource') + ' ' + t('General.enterFilter')
            "
            enterkeyhint="send"
          >
            <template #icon><CreditCard class="icon-medium" /></template>
            <template #button>
              <Button
                data-testid="report-table-mobile-filter-capitalsource-reset"
                type="button"
                variant="outline"
                size="icon"
                @click="filterCapitalsource = ''"
                class="rounded-l-none border-l"
              >
                <X class="icon-medium" />
              </Button>
            </template>
          </InputStandard>

          <InputStandard
            v-model="filterContractpartner"
            id="report-table-mobile-filter-contractpartner"
            :placeholder="
              t('General.contractpartner') + ' ' + t('General.enterFilter')
            "
            enterkeyhint="send"
          >
            <template #icon><Handshake class="icon-medium" /></template>
            <template #button>
              <Button
                data-testid="report-table-mobile-filter-contractpartner-reset"
                type="button"
                variant="outline"
                size="icon"
                @click="filterContractpartner = ''"
                class="rounded-l-none border-l"
              >
                <X class="icon-medium" />
              </Button>
            </template>
          </InputStandard>

          <InputStandard
            v-model="filterComment"
            id="report-table-mobile-filter-comment"
            :placeholder="t('General.comment') + ' ' + t('General.enterFilter')"
            enterkeyhint="send"
          >
            <template #icon><MessageSquareMore class="icon-medium" /></template>
            <template #button>
              <Button
                data-testid="report-table-mobile-filter-comment-reset"
                type="button"
                variant="outline"
                size="icon"
                @click="filterComment = ''"
                class="rounded-l-none border-l"
              >
                <X class="icon-medium" />
              </Button>
            </template>
          </InputStandard>

          <InputStandard
            v-model="filterPostingAccount"
            id="report-table-mobile-filter-postingAccount"
            :placeholder="
              t('General.postingAccount') + ' ' + t('General.enterFilter')
            "
            enterkeyhint="send"
          >
            <template #icon><Tag class="icon-medium" /></template>
            <template #button>
              <Button
                data-testid="report-table-mobile-filter-postingAccount-reset"
                type="button"
                variant="outline"
                size="icon"
                @click="filterPostingAccount = ''"
                class="rounded-l-none border-l"
              >
                <X class="icon-medium" />
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
            num: visibleMoneyflows.length,
            all: moneyflowsCount || 0,
          })
        }}
      </span>
      <span
        v-if="!showPlanned && hiddenPlannedCount > 0"
        class="text-orange-500/80"
      >
        ({{ hiddenPlannedCount }} {{ $t("Moneyflow.reserved") }} ausgeblendet)
      </span>
      <template v-if="activeSort">
        <span class="text-muted-foreground/30">•</span>
        <div
          class="flex items-center gap-1 text-primary/80 cursor-pointer active:opacity-60 transition-opacity whitespace-nowrap"
          @click="sortByColumn(activeSort.field)"
        >
          <span class="truncate">{{ $t(activeSort.label) }}</span>
          <component :is="activeSort.icon" class="icon-extra-small shrink-0" />
        </div>
      </template>
    </div>

    <Accordion type="multiple" class="space-y-2">
      <ReportTableMobileRow
        v-for="mmf in visibleMoneyflows"
        :key="'mobile-' + mmf.id"
        :mmf="mmf"
        @show-receipt="showReceipt"
        @edit-moneyflow="editMoneyflow"
        @delete-moneyflow="deleteMoneyflow"
        @list-moneyflow="listMoneyflow"
      />
    </Accordion>

    <div v-if="limit < filteredMoneyflows.length" class="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        class="w-1/2 text-xs h-10 border-primary/30 text-primary/90 hover:bg-primary/5 hover:text-primary transition-all gap-2 shadow-sm"
        @click="limit += 10"
      >
        <ChevronDown class="icon-small" />
        weitere 10 anzeigen
      </Button>
      <Button
        variant="outline"
        size="sm"
        class="w-1/2 text-xs h-10 border-primary/30 text-primary/90 hover:bg-primary/5 hover:text-primary transition-all gap-2 shadow-sm"
        @click="limit = filteredMoneyflows.length"
      >
        <ChevronsDown class="icon-small" />
        alle anzeigen
      </Button>
    </div>

    <div
      v-if="visibleMoneyflows.length === 0"
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
        <SpanAmount :amount="visibleAmountSum" />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import InputStandard from "@/components/common/InputStandard.vue";
import SpanAmount from "@/components/common/SpanAmount.vue";
import { Accordion } from "@/components/ui/accordion";
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
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpNarrowWide,
  CalendarClock,
  ChevronDown,
  ChevronsDown,
  CreditCard,
  Filter,
  Handshake,
  MessageSquareMore,
  Tag,
  X,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import ReportTableMobileRow from "./ReportTableMobileRow.vue";

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

const isSheetOpen = ref(false);

const showPlanned = ref(false);
const limit = ref(5);

const today = new Date();
today.setHours(0, 0, 0, 0);

const filteredMoneyflows = computed(() => {
  if (showPlanned.value) return props.moneyflows;
  return props.moneyflows.filter((mmf) => {
    const bookingDate = new Date(mmf.bookingDate);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate <= today;
  });
});

const hiddenPlannedCount = computed(() => {
  return props.moneyflows.length - filteredMoneyflows.value.length;
});

const visibleMoneyflows = computed(() => {
  return filteredMoneyflows.value.slice(0, limit.value);
});

const visibleAmountSum = computed(() => {
  return visibleMoneyflows.value.reduce((acc, mmf) => acc + mmf.amount, 0);
});

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
