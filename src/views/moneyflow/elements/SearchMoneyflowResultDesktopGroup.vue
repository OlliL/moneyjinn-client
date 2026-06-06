<template>
  <TableRow>
    <TableCell class="align-middle border-r">
      <Button
        variant="ghost"
        size="icon"
        data-testid="search-moneyflow-group-expand"
        @click="toggleCollapse"
        :title="isCollapsed ? 'Collapse details' : 'Expand details'"
        :aria-label="isCollapsed ? 'Collapse details' : 'Expand details'"
        class="action-icon-button"
      >
        <ChevronRight v-if="!isCollapsed" class="icon-medium" />
        <ChevronDown v-else class="icon-medium" />
      </Button>
    </TableCell>
    <TableCell class="align-middle border-r" v-if="colBookingMonth">
      <router-link
        class="text-primary hover:underline"
        :to="{
          name: Routes.ListReports,
          params: { year: moneyflowGroup.year, month: moneyflowGroup.month },
        }"
      >
        {{ moneyflowGroup.monthString }} {{ moneyflowGroup.year }}
      </router-link>
    </TableCell>
    <TableCell class="align-middle border-r" v-if="colBookingYear">
      <router-link
        class="text-primary hover:underline"
        :to="{
          name: Routes.ListReports,
          params: { year: moneyflowGroup.year },
        }"
      >
        {{ moneyflowGroup.year }}
      </router-link>
    </TableCell>
    <TableCell
      class="align-middle border-r !whitespace-normal"
      v-if="colContractpartner"
    >
      {{ moneyflowGroup.contractpartnerName }}
    </TableCell>

    <TableCell class="text-right border-r align-middle">
      <SpanAmount :amount="moneyflowGroup.amount" />
    </TableCell>
    <TableCell class="text-left align-middle break-words !whitespace-normal">
      {{ moneyflowGroup.commentString }}
    </TableCell>
  </TableRow>

  <TableRow v-if="isCollapsed">
    <TableCell
      :colspan="
        3 +
        (colBookingMonth ? 1 : 0) +
        (colBookingYear ? 1 : 0) +
        (colContractpartner ? 1 : 0)
      "
      class="p-0"
    >
      <div class="p-4">
        <div class="flex flex-col rounded-md border w-full overflow-x-auto">
          <Table class="[&_td]:!py-1 [&_th]:!py-1">
            <TableHeader>
              <TableRow>
                <TableHead class="hidden border-r border-b md:table-cell"
                  ><span class="sr-only">Status</span></TableHead
                >
                <TableHead class="table-head-cell">{{
                  $t("Moneyflow.bookingdate")
                }}</TableHead>
                <TableHead class="table-head-cell">{{
                  $t("Moneyflow.invoicedate")
                }}</TableHead>
                <TableHead class="table-head-cell" colspan="2">{{
                  $t("General.amount")
                }}</TableHead>
                <TableHead class="table-head-cell">{{
                  $t("General.contractpartner")
                }}</TableHead>
                <TableHead class="table-head-cell">{{
                  $t("General.comment")
                }}</TableHead>
                <TableHead class="table-head-cell">{{
                  $t("General.postingAccount")
                }}</TableHead>
                <TableHead class="table-head-cell">{{
                  $t("General.capitalsource")
                }}</TableHead>
                <TableHead
                  class="font-bold border-b text-foreground text-center"
                  colspan="2"
                ></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <DisplayMoneyflowRowDesktop
                v-for="(moneyflow, index) of moneyflowGroup.moneyflows"
                :key="moneyflow.id"
                :mmf="moneyflow"
                :index="index"
              />
            </TableBody>
          </Table>
        </div>
      </div>
    </TableCell>
  </TableRow>
</template>
<script lang="ts" setup>
import SpanAmount from "@/components/common/SpanAmount.vue";
import DisplayMoneyflowRowDesktop from "@/components/moneyflow/DisplayMoneyflowRowDesktop.vue";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { Routes } from "@/router";
import { ChevronDown, ChevronRight } from "lucide-vue-next";
import { ref } from "vue";

type MoneyflowGroup = {
  month: number;
  monthString: string;
  year: number;
  contractpartnerName: string;
  amount: number;
  comment: Set<string>;
  commentString: string;
  moneyflows: Array<Moneyflow>;
};

const props = defineProps<{
  moneyflowGroup: MoneyflowGroup;
  colBookingMonth: boolean;
  colBookingYear: boolean;
  colContractpartner: boolean;
}>();

const isCollapsed = ref(false);
const toggleCollapse = () => (isCollapsed.value = !isCollapsed.value);
</script>
