<template>
  <ModalVue
    :title="title"
    maxWidth="max-w-[calc(100%-2rem)] md:max-w-2xl lg:max-w-2xl w-full mx-auto"
    id-suffix="CreatePreDefMoneyflow"
    v-model:open="open"
  >
    <template #body>
      <form
        @submit.prevent="createPreDefMoneyflow"
        id="createPreDefMoneyflowForm"
      >
        <div class="space-y-4">
          <div class="form-section space-y-4">
            <div class="grid grid-cols-2 sm:grid-cols-24 gap-4">
              <div class="col-span-1 sm:col-span-7">
                <InputStandard
                  v-model="mData.amount"
                  :validation-schema="schema.amount"
                  id="amount"
                  field-type="number"
                  step="0.01"
                  :field-label="$t('General.amount')"
                >
                  <template #icon><Euro class="icon-medium" /></template>
                </InputStandard>
              </div>
              <div class="col-span-1 sm:col-span-6">
                <div class="grid gap-1.5 relative justify-items-start w-full">
                  <Label
                    for="onceAMonth"
                    class="text-left ml-1 text-sm font-medium text-foreground leading-none"
                  >
                    {{ $t("PreDefMoneyflow.onceAMonth") }}
                  </Label>
                  <ToggleGroup
                    type="single"
                    class="border border-input bg-muted inline-flex h-8 rounded-md overflow-hidden p-0 items-stretch w-full"
                    :model-value="mData.onceAMonth ? 'yes' : 'no'"
                    @update:model-value="
                      (val: any) => val && (mData.onceAMonth = val === 'yes')
                    "
                    id="onceAMonth"
                  >
                    <ToggleGroupItem
                      value="no"
                      class="text-xs font-medium h-full px-3 flex-1 transition-all rounded-none data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm text-muted-foreground border-r border-input last:border-r-0"
                    >
                      {{ $t("General.no") }}
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="yes"
                      class="text-xs font-medium h-full px-3 flex-1 transition-all rounded-none data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm text-muted-foreground"
                    >
                      {{ $t("General.yes") }}
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
              <div class="col-span-2 sm:col-span-11">
                <div class="grid gap-1.5 relative justify-items-start w-full">
                  <Label
                    class="text-left ml-1 text-sm font-medium text-foreground leading-none"
                    for="fav-div"
                  >
                    {{ $t("Moneyflow.favorite") }}
                  </Label>
                  <div class="flex items-center w-full gap-3" id="fav-div">
                    <div class="flex items-stretch relative">
                      <button
                        data-testid="createPreDefMoneyflowFavoriteButton"
                        type="button"
                        @click="mData.isFavorite = !mData.isFavorite"
                        :class="[
                          'flex items-center justify-center p-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 shrink-0 transition-all z-20',
                          mData.isFavorite
                            ? 'rounded-l-md border-r-0'
                            : 'rounded-md',
                        ]"
                        :title="$t('General.markAsFav')"
                      >
                        <Star
                          class="h-5 w-5 transition-all"
                          :class="
                            mData.isFavorite
                              ? 'fill-primary text-primary'
                              : 'text-muted-foreground'
                          "
                        />
                      </button>

                      <div
                        v-if="mData.isFavorite"
                        class="flex items-center h-8 border border-input rounded-r-md pl-2 md:pl-1 pr-2 gap-1 bg-muted/5 animate-in slide-in-from-left-2 duration-200"
                      >
                        <div class="w-12">
                          <InputStandard
                            v-model="mData.favoriteAbbreviation"
                            :validation-schema="schema.favoriteAbbreviation"
                            id="favoriteAbbreviation"
                            field-label=""
                            maxlength="3"
                            align="center"
                            class="[&_input]:border-0 [&_input]:focus-visible:ring-0 [&_input]:h-8 [&_input]:bg-transparent [&_input]:shadow-none [&_input]:p-0"
                          />
                        </div>

                        <div
                          class="shrink-0 border-l border-border/50 pl-1 h-6 flex items-center"
                        >
                          <Popover v-model:open="isPopoverOpen">
                            <PopoverTrigger as-child>
                              <div
                                class="h-7.5 w-7.5 rounded-sm border cursor-pointer transition-all flex items-center justify-center shadow-sm hover:opacity-90 border-transparent"
                                :style="{
                                  backgroundColor: mData.favoriteColor,
                                }"
                                data-testid="favoriteColorPicker"
                              ></div>
                            </PopoverTrigger>
                            <PopoverContent
                              class="w-40 p-2 bg-popover border rounded-md shadow-md z-3000"
                              align="start"
                            >
                              <div class="flex justify-end mb-1">
                                <button
                                  type="button"
                                  @click="isPopoverOpen = false"
                                  class="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <X class="icon-small" />
                                </button>
                              </div>
                              <div class="grid grid-cols-5 gap-1 mb-2">
                                <div
                                  v-for="color in randomColors"
                                  :key="color"
                                  @mouseenter="hoveredColor = color"
                                  @mouseleave="hoveredColor = null"
                                  @click="selectColor(color)"
                                  class="h-6 w-6 rounded-sm cursor-pointer border border-input/50 hover:scale-110 transition-transform"
                                  data-testid="favoriteColorOption"
                                  :style="{ backgroundColor: color }"
                                ></div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="xs"
                                class="w-full h-7 text-[10px] gap-1"
                                data-testid="createPreDefMoneyflowResetColorsButton"
                                @click="updateRandomColors"
                              >
                                <RefreshCw class="icon-extra-small" />
                                {{ $t("General.reset") }}
                              </Button>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="mData.isFavorite"
                      class="flex items-center gap-2 ml-auto shrink-0 h-8"
                    >
                      <span
                        class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 text-right"
                      >
                        {{ $t("PreDefMoneyflow.preview") }}:
                      </span>
                      <div class="w-12 h-8 relative shrink-0">
                        <FavoriteIcon
                          :text="mData.favoriteAbbreviation"
                          :color="previewColor"
                          class="absolute top-1/2 -translate-y-1/2 left-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-span-2 sm:col-span-12">
                <InputStandard
                  v-model="mData.comment"
                  :validation-schema="schema.comment"
                  id="comment"
                  :field-label="$t('General.comment')"
                >
                  <template #icon
                    ><MessageSquareMore class="icon-medium"
                  /></template>
                </InputStandard>
              </div>
              <div class="col-span-2 sm:col-span-12">
                <SelectContractpartner
                  v-model="mData.contractpartnerId"
                  :validation-schema="schema.contractpartnerId"
                  id-suffix="CreatePreDefMoneyflow"
                  :field-label="$t('General.contractpartner')"
                />
              </div>
              <div class="col-span-2 sm:col-span-12">
                <SelectCapitalsource
                  v-model="mData.capitalsourceId"
                  :validation-schema="schema.capitalsourceId"
                  id-suffix="CreatePreDefMoneyflow"
                  :field-label="$t('General.capitalsource')"
                  :validity-date="validityDate"
                />
              </div>
              <div class="col-span-2 sm:col-span-12">
                <SelectPostingAccount
                  v-model="mData.postingAccountId"
                  :validation-schema="schema.postingAccountId"
                  id-suffix="CreatePreDefMoneyflow"
                  :field-label="$t('General.postingAccount')"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <Button
        type="button"
        variant="secondary"
        data-testid="createPreDefMoneyflowResetButton"
        class="button-with-icon hidden md:flex"
        @click="resetForm(values, setFieldTouched)"
      >
        <Undo2 class="icon-medium" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        form-id="createPreDefMoneyflowForm"
        data-testid="createPreDefMoneyflowSaveButton"
      >
        <template #icon><Save class="icon-medium" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import { amountSchema, globErr } from "@/tools/views/ZodUtil";
import {
  Euro,
  MessageSquareMore,
  RefreshCw,
  Save,
  Star,
  Undo2,
  X,
} from "@lucide/vue";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { boolean, number, string, type ZodType } from "zod";
import SelectCapitalsource from "../capitalsource/SelectCapitalsource.vue";
import ButtonSubmit from "../common/ButtonSubmit.vue";
import FavoriteIcon from "../common/FavoriteIcon.vue";
import InputStandard from "../common/InputStandard.vue";
import ModalVue from "../common/Modal.vue";
import SelectContractpartner from "../contractpartner/SelectContractpartner.vue";
import SelectPostingAccount from "../postingaccount/SelectPostingAccount.vue";
import { useCreatePreDefMoneyflowModalStore } from "./CreatePreDefMoneyflowModal.store";

const { t } = useI18n();
const store = useCreatePreDefMoneyflowModalStore();
const { open, mData, title } = storeToRefs(store);
const { resetForm, save } = store;
const { handleSubmit, values, setFieldTouched } = useForm();

const schema: Partial<{ [key in keyof PreDefMoneyflow]: ZodType }> = {
  amount: amountSchema(t("Moneyflow.validation.amount")),
  contractpartnerId: number(
    globErr(t("Moneyflow.validation.contractpartnerId")),
  ).gt(0),
  comment: string(globErr(t("Moneyflow.validation.comment")))
    .min(1)
    .max(100, t("Moneyflow.validation.length.comment")),
  favoriteAbbreviation: string(
    globErr(t("PreDefMoneyflow.validation.favoriteAbbreviation")),
  )
    .min(1)
    .max(3),
  postingAccountId: number(
    globErr(t("Moneyflow.validation.postingAccountId")),
  ).gt(0),
  capitalsourceId: number(globErr(t("General.validation.capitalsource"))).gt(0),
  onceAMonth: boolean().optional(),
  isFavorite: boolean().optional(),
};

const validityDate = new Date();
validityDate.setHours(0, 0, 0, 0);
const isPopoverOpen = ref(false);
const randomColors = ref<string[]>([]);
const hoveredColor = ref<string | null>(null);

const previewColor = computed(
  () => hoveredColor.value ?? mData.value.favoriteColor,
);

const updateRandomColors = () => {
  randomColors.value = Array.from(
    { length: 10 },
    () =>
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0"),
  );
};

watch(isPopoverOpen, (val) => {
  if (val) {
    updateRandomColors();
  } else {
    hoveredColor.value = null;
  }
});

watch(
  () => mData.value.isFavorite,
  (favorite) => {
    if (favorite) {
      if (!mData.value.favoriteColor) {
        updateRandomColors();
        mData.value.favoriteColor = randomColors.value[0];
      }
    }
  },
);

const selectColor = (color: string) => {
  mData.value.favoriteColor = color;
  isPopoverOpen.value = false;
};

const createPreDefMoneyflow = save(handleSubmit);
</script>
