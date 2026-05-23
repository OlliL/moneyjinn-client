<template>
  <div class="hidden md:block overflow-x-auto text-center">
    <div class="flex flex-col rounded-md border">
      <Table class="w-full text-xs md:text-sm">
        <TableHeader>
          <TableRow>
            <TableHead class="align-top"></TableHead>
            <TableHead class="table-head-cell align-top">
              <span
                class="hidden md:block items-center justify-center mt-1 font-bold"
                >{{ $t("Moneyflow.bookingdate") }}
                <component
                  :is="sortIcon('bookingDate')"
                  class="inline icon-small text-primary cursor-pointer"
                  :title="$t('Moneyflow.bookingdate')"
                  :aria-label="$t('Moneyflow.bookingdate')"
                  @click="sortByColumn('bookingDate')"
                />
              </span>
              <span class="block md:hidden">
                <component
                  :is="sortIcon('bookingDate')"
                  class="inline icon-small text-primary cursor-pointer"
                  :title="$t('Moneyflow.bookingdate')"
                  :aria-label="$t('Moneyflow.bookingdate')"
                  @click="sortByColumn('bookingDate')"
                />
              </span>
            </TableHead>
            <TableHead class="table-head-cell align-top">
              <span class="items-center justify-center gap-1 mt-1 font-bold">
                {{ $t("Moneyflow.invoicedate") }}
                <component
                  :is="sortIcon('invoiceDate')"
                  class="inline icon-small text-primary cursor-pointer"
                  :title="$t('Moneyflow.invoicedate')"
                  :aria-label="$t('Moneyflow.invoicedate')"
                  @click="sortByColumn('invoiceDate')"
                />
              </span>
            </TableHead>
            <TableHead class="table-head-cell align-top" colspan="2">
              <span class="items-center justify-center gap-1 mt-1 font-bold">
                {{ $t("General.amount") }}
                <component
                  :is="sortIcon('amount')"
                  class="icon-small text-primary cursor-pointer shrink-0"
                  :title="$t('General.amount')"
                  :aria-label="$t('General.amount')"
                  @click="sortByColumn('amount')"
                />
              </span>

              <span class="flex md:hidden items-center justify-center w-full">
                <component
                  :is="sortIcon('amount')"
                  class="icon-small text-primary cursor-pointer"
                  :title="$t('General.amount')"
                  :aria-label="$t('General.amount')"
                  @click="sortByColumn('amount')"
                />
              </span>
            </TableHead>
            <TableHead class="table-head-cell align-top">
              <span class="items-center justify-center gap-1 mt-1 font-bold">
                {{ $t("General.contractpartner") }}
                <component
                  :is="sortIcon('contractpartnerName')"
                  class="inline icon-small text-primary cursor-pointer"
                  :title="$t('General.contractpartner')"
                  :aria-label="$t('General.contractpartner')"
                  @click="sortByColumn('contractpartnerName')"
                />
              </span>
              <div class="flex items-center w-full max-w-sm mt-1 mb-2">
                <Input
                  type="text"
                  :placeholder="$t('General.enterFilter')"
                  v-model="filterContractpartner"
                  class="h-8 rounded-r-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:z-10"
                />

                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  :title="$t('General.reset')"
                  :aria-label="$t('General.reset')"
                  @click="filterContractpartner = ''"
                  class="action-icon-button rounded-l-none border-l"
                >
                  <X />
                </Button>
              </div>
            </TableHead>
            <TableHead class="table-head-cell align-top">
              <div class="hidden md:block">
                <span class="items-center justify-center gap-1 mt-1 font-bold">
                  {{ $t("General.comment") }}
                  <component
                    :is="sortIcon('comment')"
                    class="inline icon-small text-primary cursor-pointer mb-1 ml-0.5"
                    :title="$t('General.comment')"
                    :aria-label="$t('General.comment')"
                    @click="sortByColumn('comment')"
                  />
                </span>
                <div class="flex items-center w-full max-w-sm mt-1">
                  <Input
                    type="text"
                    :placeholder="$t('General.enterFilter')"
                    v-model="filterComment"
                    class="h-8 rounded-r-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:z-10"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    :title="$t('General.reset')"
                    :aria-label="$t('General.reset')"
                    @click="filterComment = ''"
                    class="action-icon-button rounded-l-none border-l"
                  >
                    <X />
                  </Button>
                </div>
              </div>
              <span
                class="flex md:hidden items-center justify-center min-w-0 break-words"
              >
                <component
                  :is="sortIcon('comment')"
                  class="inline icon-small text-primary cursor-pointer"
                  :title="$t('General.comment')"
                  :aria-label="$t('General.comment')"
                  @click="sortByColumn('comment')"
                />
              </span>
            </TableHead>

            <TableHead class="table-head-cell align-top">
              <span class="items-center justify-center gap-1 mt-1 font-bold">
                {{ $t("General.postingAccount") }}
                <component
                  :is="sortIcon('postingAccountName')"
                  class="inline icon-small text-primary cursor-pointer mb-1 ml-0.5"
                  :title="$t('General.postingAccount')"
                  :aria-label="$t('General.postingAccount')"
                  @click="sortByColumn('postingAccountName')"
                />
              </span>
              <div class="flex items-center w-full max-w-sm mt-1">
                <Input
                  type="text"
                  :placeholder="$t('General.enterFilter')"
                  v-model="filterPostingAccount"
                  class="h-8 rounded-r-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:z-10"
                />
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  :title="$t('General.reset')"
                  :aria-label="$t('General.reset')"
                  @click="filterPostingAccount = ''"
                  class="action-icon-button rounded-l-none border-l"
                >
                  <X />
                </Button>
              </div>
            </TableHead>

            <TableHead class="table-head-cell align-top">
              <span class="items-center justify-center gap-1 mt-1 font-bold">
                {{ $t("General.capitalsource") }}
                <component
                  :is="sortIcon('capitalsourceComment')"
                  class="inline icon-small text-primary cursor-pointer mb-1 ml-0.5"
                  :title="$t('General.capitalsource')"
                  :aria-label="$t('General.capitalsource')"
                  @click="sortByColumn('capitalsourceComment')"
                />
              </span>
              <div class="flex items-center w-full max-w-sm mt-1">
                <Input
                  type="text"
                  :placeholder="$t('General.enterFilter')"
                  v-model="filterCapitalsource"
                  class="h-8 rounded-r-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:z-10"
                />
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  :title="$t('General.reset')"
                  :aria-label="$t('General.reset')"
                  @click="filterCapitalsource = ''"
                  class="action-icon-button rounded-l-none border-l"
                >
                  <X />
                </Button>
              </div>
            </TableHead>
            <TableHead colspan="2"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <ReportTableDesktopRow
            v-for="(mmf, index) in sortedMoneyflows"
            :key="mmf.id"
            :mmf="mmf"
            :index="index"
            @show-receipt="showReceipt"
            @delete-moneyflow="deleteMoneyflow"
            @edit-moneyflow="editMoneyflow"
            @list-moneyflow="listMoneyflow"
          />
          <TableRow
            v-if="sortedMoneyflows.length === 0"
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
import SpanAmount from "@/components/common/SpanAmount.vue";
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
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { ArrowDown, ArrowUp, ArrowUpDown, X } from "lucide-vue-next";
import { computed, onMounted, type PropType } from "vue";
import ReportTableDesktopRow from "./ReportTableDesktopRow.vue";

const props = defineProps<{
  filteredMoneyflows: Moneyflow[];
  amountSum: number;
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
const sortBy = defineModel<Map<keyof Moneyflow, boolean>>("sortBy", {
  type: Object as PropType<Map<keyof Moneyflow, boolean>>,
  required: true,
});

const emit = defineEmits<{
  showReceipt: [id: number];
  deleteMoneyflow: [moneyflow: Moneyflow];
  editMoneyflow: [moneyflow: Moneyflow];
  listMoneyflow: [moneyflow: Moneyflow];
}>();

onMounted(() => {
  if (sortBy.value.size > 0) {
    const entry = sortBy.value.entries().next().value;
    if (entry) {
      sortByColumn(entry[0]);
    }
  }
});

const userSessionStore = useUserSessionStore();

const sortedMoneyflows = computed(() => {
  let result = [...props.filteredMoneyflows];
  if (sortBy.value.size > 0) {
    const entry = sortBy.value.entries().next().value;
    if (entry) {
      const field = entry[0];
      const ascending = entry[1] === true;
      result.sort((a, b) => {
        const comparison = compareColumns(a, b, field);
        return ascending ? comparison : -1 * comparison;
      });
    }
  }
  return result;
});

const compareColumns = (
  a: Moneyflow,
  b: Moneyflow,
  field: keyof Moneyflow,
): number => {
  let aField = a[field];
  let bField = b[field];
  if (aField === undefined || bField === undefined) return 0;
  if (typeof aField === "string" && typeof bField === "string") {
    aField = aField.toLowerCase();
    bField = bField.toLowerCase();
  }
  if (aField > bField) return 1;
  else if (bField > aField) return -1;
  return 0;
};

const sortByColumn = (field: keyof Moneyflow) => {
  let sortByField = sortBy.value.get(field);
  if (sortByField === undefined || !sortByField) {
    sortByField = true;
  } else {
    sortByField = false;
  }
  sortBy.value.clear();
  sortBy.value.set(field, sortByField);
};

const sortIcon = (sortedField: keyof Moneyflow) => {
  if (sortBy.value.get(sortedField) === undefined) {
    return ArrowUpDown;
  } else if (sortBy.value.get(sortedField)) {
    return ArrowUp;
  }
  return ArrowDown;
};

const showReceipt = (id: number) => {
  emit("showReceipt", id);
};

const deleteMoneyflow = (moneyflow: Moneyflow) => {
  emit("deleteMoneyflow", moneyflow);
};

const editMoneyflow = (moneyflow: Moneyflow) => {
  emit("editMoneyflow", moneyflow);
};

const listMoneyflow = (moneyflow: Moneyflow) => {
  emit("listMoneyflow", moneyflow);
};
</script>
