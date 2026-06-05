<template>
  <div class="hidden md:block overflow-x-auto text-center">
    <div class="flex flex-col rounded-md border">
      <Table class="w-full text-xs md:text-sm">
        <TableHeader>
          <TableRow>
            <TableHead class="table-head-cell"></TableHead>

            <TableHead class="table-head-cell align-top py-2">
              <span
                class="inline-flex items-center justify-center w-full gap-1 font-bold whitespace-nowrap transition-colors"
                :class="{ 'text-primary': props.sortBy.has('bookingDate') }"
              >
                {{ $t("Moneyflow.bookingdate") }}
                <component
                  :is="sortIcon('bookingDate')"
                  class="icon-medium text-primary cursor-pointer shrink-0 hover:text-primary/70 transition-colors"
                  :title="$t('Moneyflow.bookingdate')"
                  :aria-label="$t('Moneyflow.bookingdate')"
                  @click="$emit('sortByColumn', 'bookingDate')"
                />
              </span>
            </TableHead>

            <TableHead class="table-head-cell align-top py-2">
              <span
                class="inline-flex items-center justify-center w-full gap-1 font-bold whitespace-nowrap transition-colors"
                :class="{ 'text-primary': props.sortBy.has('invoiceDate') }"
              >
                {{ $t("Moneyflow.invoicedate") }}
                <component
                  :is="sortIcon('invoiceDate')"
                  class="icon-medium text-primary cursor-pointer shrink-0 hover:text-primary/70 transition-colors"
                  :title="$t('Moneyflow.invoicedate')"
                  :aria-label="$t('Moneyflow.invoicedate')"
                  @click="$emit('sortByColumn', 'invoiceDate')"
                />
              </span>
            </TableHead>

            <TableHead class="table-head-cell align-top py-2" colspan="2">
              <span
                class="inline-flex items-center justify-center w-full gap-1 font-bold whitespace-nowrap transition-colors"
                :class="{ 'text-primary': props.sortBy.has('amount') }"
              >
                {{ $t("General.amount") }}
                <component
                  :is="sortIcon('amount')"
                  class="icon-medium text-primary cursor-pointer shrink-0 hover:text-primary/70 transition-colors"
                  :title="$t('General.amount')"
                  :aria-label="$t('General.amount')"
                  @click="$emit('sortByColumn', 'amount')"
                />
              </span>
            </TableHead>

            <TableHead class="table-head-cell align-top py-2">
              <div
                class="flex flex-col items-stretch text-center justify-between gap-2"
              >
                <span
                  class="inline-flex items-center justify-center gap-1 font-bold whitespace-nowrap transition-colors"
                  :class="{
                    'text-primary': props.sortBy.has('contractpartnerName'),
                  }"
                >
                  {{ $t("General.contractpartner") }}
                  <component
                    :is="sortIcon('contractpartnerName')"
                    class="icon-medium text-primary cursor-pointer shrink-0 hover:text-primary/70 transition-colors"
                    :title="$t('General.contractpartner')"
                    :aria-label="$t('General.contractpartner')"
                    @click="$emit('sortByColumn', 'contractpartnerName')"
                  />
                </span>
                <div class="flex items-center w-full min-w-[120px]">
                  <Input
                    type="text"
                    :placeholder="$t('General.enterFilter')"
                    v-model="filterContractpartner"
                    class="h-8 w-full rounded-r-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:z-10"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    :title="$t('General.reset')"
                    :aria-label="$t('General.reset')"
                    @click="filterContractpartner = ''"
                    class="action-icon-button rounded-l-none border-l shrink-0"
                  >
                    <X />
                  </Button>
                </div>
              </div>
            </TableHead>

            <TableHead class="table-head-cell align-top py-2">
              <div
                class="flex flex-col items-stretch text-center justify-between gap-2"
              >
                <span
                  class="inline-flex items-center justify-center gap-1 font-bold whitespace-nowrap transition-colors"
                  :class="{ 'text-primary': props.sortBy.has('comment') }"
                >
                  {{ $t("General.comment") }}
                  <component
                    :is="sortIcon('comment')"
                    class="icon-medium text-primary cursor-pointer shrink-0 hover:text-primary/70 transition-colors"
                    :title="$t('General.comment')"
                    :aria-label="$t('General.comment')"
                    @click="$emit('sortByColumn', 'comment')"
                  />
                </span>
                <div class="flex items-center w-full min-w-[120px]">
                  <Input
                    type="text"
                    :placeholder="$t('General.enterFilter')"
                    v-model="filterComment"
                    class="h-8 w-full rounded-r-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:z-10"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    :title="$t('General.reset')"
                    :aria-label="$t('General.reset')"
                    @click="filterComment = ''"
                    class="action-icon-button rounded-l-none border-l shrink-0"
                  >
                    <X />
                  </Button>
                </div>
              </div>
            </TableHead>

            <TableHead class="table-head-cell align-top py-2">
              <div
                class="flex flex-col items-stretch text-center justify-between gap-2"
              >
                <span
                  class="inline-flex items-center justify-center gap-1 font-bold whitespace-nowrap transition-colors"
                  :class="{
                    'text-primary': props.sortBy.has('postingAccountName'),
                  }"
                >
                  {{ $t("General.postingAccount") }}
                  <component
                    :is="sortIcon('postingAccountName')"
                    class="icon-medium text-primary cursor-pointer shrink-0 hover:text-primary/70 transition-colors"
                    :title="$t('General.postingAccount')"
                    :aria-label="$t('General.postingAccount')"
                    @click="$emit('sortByColumn', 'postingAccountName')"
                  />
                </span>
                <div class="flex items-center w-full min-w-[120px]">
                  <Input
                    type="text"
                    :placeholder="$t('General.enterFilter')"
                    v-model="filterPostingAccount"
                    class="h-8 w-full rounded-r-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:z-10"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    :title="$t('General.reset')"
                    :aria-label="$t('General.reset')"
                    @click="filterPostingAccount = ''"
                    class="action-icon-button rounded-l-none border-l shrink-0"
                  >
                    <X />
                  </Button>
                </div>
              </div>
            </TableHead>

            <TableHead class="table-head-cell align-top py-2">
              <div
                class="flex flex-col items-stretch text-center justify-between gap-2"
              >
                <span
                  class="inline-flex items-center justify-center gap-1 font-bold whitespace-nowrap transition-colors"
                  :class="{
                    'text-primary': props.sortBy.has('capitalsourceComment'),
                  }"
                >
                  {{ $t("General.capitalsource") }}
                  <component
                    :is="sortIcon('capitalsourceComment')"
                    class="icon-medium text-primary cursor-pointer shrink-0 hover:text-primary/70 transition-colors"
                    :title="$t('General.capitalsource')"
                    :aria-label="$t('General.capitalsource')"
                    @click="$emit('sortByColumn', 'capitalsourceComment')"
                  />
                </span>
                <div class="flex items-center w-full min-w-[120px]">
                  <Input
                    type="text"
                    :placeholder="$t('General.enterFilter')"
                    v-model="filterCapitalsource"
                    class="h-8 w-full rounded-r-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:z-10"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    :title="$t('General.reset')"
                    :aria-label="$t('General.reset')"
                    @click="filterCapitalsource = ''"
                    class="action-icon-button rounded-l-none border-l shrink-0"
                  >
                    <X />
                  </Button>
                </div>
              </div>
            </TableHead>
            <TableHead colspan="2"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <DisplayMoneyflowRowDesktop
            v-for="(mmf, index) in moneyflows"
            :key="mmf.id"
            :mmf="mmf"
            :index="index"
          />
          <TableRow
            v-if="moneyflows.length === 0"
            data-testid="report-table-empty-desktop"
          >
            <TableCell colspan="10" class="text-center text-muted-foreground">
              {{ $t("General.noEntries") }}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colspan="3" class="text-end block md:table-cell">
              &sum;
            </TableCell>
            <TableCell colspan="2" class="text-end">
              <u><SpanAmount :amount="amountSum" /></u>
            </TableCell>
            <TableCell colspan="6" class="block md:table-cell"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Script-Teil bleibt unverändert...
import SpanAmount from "@/components/common/SpanAmount.vue";
import DisplayMoneyflowRowDesktop from "@/components/moneyflow/DisplayMoneyflowRowDesktop.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpNarrowWide,
  X,
} from "lucide-vue-next";

const props = defineProps<{
  moneyflows: Moneyflow[];
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
}>();

const sortIcon = (sortedField: keyof Moneyflow) => {
  const direction = props.sortBy.get(sortedField);
  if (direction === undefined) return ArrowUpDown;
  return direction ? ArrowUpNarrowWide : ArrowDownWideNarrow;
};
</script>
