<template>
  <AccordionItem
    :value="capitalsourceComment"
    class="border rounded-lg bg-background shadow-sm overflow-hidden"
  >
    <AccordionTrigger class="hover:no-underline w-full min-w-0 py-2 px-3">
      <div class="grid grid-cols-[1fr_auto] items-center w-full gap-2">
        <div class="flex flex-col items-start text-left overflow-hidden">
          <span class="font-bold text-sm truncate w-full">
            {{ capitalsourceComment }}
          </span>
          <span class="text-xs text-muted-foreground">
            {{ capitalsourceTypeString }} · {{ capitalsourceStateString }}
          </span>
        </div>

        <div class="flex flex-col items-end gap-1">
          <span class="text-xs text-muted-foreground">
            {{
              currentMonthIsSettled
                ? $t("Reports.endOfMonthFixed")
                : $t("Reports.currentAmount")
            }}
          </span>
          <span class="font-bold underline decoration-primary text-sm">
            <SpanAmount
              :amount="
                currentMonthIsSettled ? amountEndOfMonthFixed : amountCurrent
              "
            />
          </span>
        </div>
      </div>
    </AccordionTrigger>

    <AccordionContent class="px-2 pb-4">
      <div class="grid grid-cols-2 gap-4 text-sm bg-muted/40 p-3 rounded-md">
        <div class="flex flex-col gap-2">
          <div>
            <span class="text-xs-muted block">
              {{ $t("Reports.beginOfMonth") }}
            </span>
            <SpanAmount :amount="amountBeginOfMonthFixed" />
          </div>

          <div>
            <span class="text-xs-muted block">
              {{ $t("Reports.endOfMonthCalculated") }}
            </span>
            <SpanAmount :amount="amountEndOfMonthCalculated" />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <div v-if="!currentMonthIsSettled">
            <span class="text-xs-muted block">
              {{ $t("Reports.state") }}
            </span>
            <span class="text-xs">{{ amountCurrentStateString }}</span>
          </div>

          <div v-if="currentMonthIsSettled">
            <span class="text-xs-muted block">
              {{ $t("Reports.difference") }}
            </span>
            <SpanAmount :amount="differenceFixedCalculated" />
          </div>
        </div>
      </div>
    </AccordionContent>
  </AccordionItem>
</template>

<script lang="ts" setup>
import SpanAmount from "@/components/common/SpanAmount.vue";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CapitalsourceState,
  capitalsourceStateNames,
} from "@/model/capitalsource/CapitalsourceState";
import {
  CapitalsourceType,
  capitalsourceTypeNames,
} from "@/model/capitalsource/CapitalsourceType";
import { formatDateWithTime } from "@/tools/views/FormatDate";
import { computed, type PropType } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
    capitalsourceType: CapitalsourceType;
    capitalsourceState: CapitalsourceState;
    capitalsourceComment: string;
    amountBeginOfMonthFixed: number;
    amountEndOfMonthFixed?: number;
    amountEndOfMonthCalculated: number;
    amountCurrent?: number;
    amountCurrentState?: Date;
    currentMonthIsSettled: boolean;
}>();

const capitalsourceTypeString = computed(() => {
  return capitalsourceTypeNames[props.capitalsourceType];
});
const capitalsourceStateString = computed(() => {
  return capitalsourceStateNames[props.capitalsourceState];
});
const differenceFixedCalculated = computed(() => {
  return props.amountEndOfMonthFixed == null
    ? 0
    : props.amountEndOfMonthFixed - props.amountEndOfMonthCalculated;
});
const amountCurrentStateString = computed(() => {
  return props.amountCurrentState == null
    ? t("Reports.calculated")
    : formatDateWithTime(props.amountCurrentState);
});
</script>
