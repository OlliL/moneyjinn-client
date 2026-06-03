<template>
  <Card
    @click="$emit('update:modelValue', props.mmf.id)"
    class="border rounded-xl bg-card transition-all cursor-pointer active:scale-[0.99] !py-0"
    :class="
      modelValue === props.mmf.id
        ? 'border-primary bg-primary/5 shadow-sm'
        : 'border-border bg-muted/10 hover:bg-muted/20'
    "
  >
    <CardContent class="p-3 flex items-start justify-between gap-3">
      <div class="flex items-start gap-3 min-w-0 flex-1">
        <div class="flex items-center justify-center pt-0.5" @click.stop>
          <RadioGroupItem
            :id="'radio-mobile-' + props.mmf.id"
            :value="String(props.mmf.id)"
            :data-testid="'moneyflow-radio-mobile-' + props.mmf.id"
            class="icon-medium rounded-full border border-primary text-primary shadow focus:outline-none"
          />
        </div>

        <div class="space-y-1 min-w-0 text-xs">
          <div
            class="flex items-center gap-2 min-w-0 text-muted-foreground font-medium truncate"
          >
            <CalendarDays
              class="icon-extra-small shrink-0 text-muted-foreground/80"
            />
            <span class="text-xs">
              <SpanDate :date="mmf.invoiceDate" />
            </span>
          </div>

          <div class="flex items-center gap-1 min-w-0 truncate">
            <Handshake
              class="icon-small shrink-0 text-foreground/80"
              :title="$t('General.contractpartner')"
            />
            <span class="font-medium text-foreground text-sm">{{
              mmf.contractpartnerName
            }}</span>
          </div>

          <div class="flex items-center gap-2 min-w-0 truncate">
            <MessageSquareMore
              class="icon-extra-small shrink-0 text-muted-foreground/80"
              :title="$t('General.comment')"
            />
            <span class="font-medium text-muted-foreground text-xs">{{
              mmf.comment
            }}</span>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col items-end justify-between shrink-0 self-stretch"
      >
        <div class="font-bold text-sm text-right leading-none pt-0.5">
          <SpanAmount :amount="mmf.amount" />
        </div>

        <div class="flex items-center gap-0.5" @click.stop>
          <template v-if="isOwnMoneyflow">
            <Button
              variant="ghost"
              size="icon"
              @click="editMoneyflow"
              class="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
            >
              <Pencil class="icon-small" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              @click="deleteMoneyflow"
              class="h-7 w-7 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 class="icon-small" />
            </Button>
          </template>
          <template v-else>
            <Button
              variant="ghost"
              size="icon"
              @click="listMoneyflow"
              class="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
            >
              <Eye class="icon-small" />
            </Button>
          </template>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import SpanAmount from "@/components/common/SpanAmount.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroupItem } from "@/components/ui/radio-group";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import {
  CalendarDays,
  Eye,
  Handshake,
  MessageSquareMore,
  Pencil,
  Trash2,
} from "lucide-vue-next";
import { computed, type PropType } from "vue";

const props = defineProps<{
    mmf: Moneyflow;
    modelValue: number;
}>();

const userSessionStore = useUserSessionStore();
const emit = defineEmits([
  "deleteMoneyflow",
  "editMoneyflow",
  "listMoneyflow",
  "update:modelValue",
]);

const isOwnMoneyflow = computed(() => {
  return props.mmf.userId === userSessionStore.getUserId;
});

const deleteMoneyflow = () => {
  emit("deleteMoneyflow", props.mmf.id);
};
const editMoneyflow = () => {
  emit("editMoneyflow", props.mmf.id);
};
const listMoneyflow = () => {
  emit("listMoneyflow", props.mmf.id);
};
</script>
