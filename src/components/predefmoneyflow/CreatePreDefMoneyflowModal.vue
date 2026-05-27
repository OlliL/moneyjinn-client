<template>
  <ModalVue
    :title="title"
    maxWidth="max-w-[calc(100%-2rem)] md:max-w-2xl lg:max-w-2xl w-full mx-auto"
    ref="modalComponent"
  >
    <template #body>
      <form
        @submit.prevent="createPreDefMoneyflow"
        :id="'createPreDefMoneyflowForm' + idSuffix"
      >
        <div class="space-y-4">
          <DivError :server-errors="serverErrors" />

          <div class="form-section space-y-4">
            <div class="grid grid-cols-2 sm:grid-cols-12 gap-4">
              <div class="col-span-1 sm:col-span-4">
                <InputStandard
                  v-model="mpm.amount"
                  :validation-schema="schema.amount"
                  id="amount"
                  field-type="number"
                  step="0.01"
                  :field-label="$t('General.amount')"
                >
                  <template #icon><Euro class="icon-medium" /></template>
                </InputStandard>
              </div>
              <div class="col-span-1 sm:col-span-3">
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
                    :model-value="mpm.onceAMonth ? 'yes' : 'no'"
                    @update:model-value="
                      (val: any) => val && (mpm.onceAMonth = val === 'yes')
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
              <div class="col-span-2 sm:col-span-5">
                <div class="grid gap-1.5 relative justify-items-start w-full">
                  <Label
                    class="text-left ml-1 text-sm font-medium text-foreground leading-none"
                  >
                    {{ $t("Moneyflow.favorite") }}
                  </Label>
                  <div class="flex items-stretch w-full relative">
                    <!-- Favorit Button (Linker Teil des Rahmens) -->
                    <button
                      type="button"
                      @click="mpm.isFavorite = !mpm.isFavorite"
                      :class="[
                        'flex items-center justify-center p-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground min-h-10 w-10 shrink-0 transition-all z-20',
                        mpm.isFavorite
                          ? 'rounded-l-md border-r-0'
                          : 'rounded-md',
                      ]"
                      :title="$t('PreDefMoneyflow.markAsFav')"
                    >
                      <Star
                        class="h-5 w-5 transition-all"
                        :class="
                          mpm.isFavorite
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                        "
                      />
                    </button>

                    <!-- Rahmeninhalt (Eingeblendet wenn Favorit aktiv) -->
                    <div
                      v-if="mpm.isFavorite"
                      class="flex items-center flex-1 min-h-10 border border-input rounded-r-md pl-3 pr-1 gap-3 bg-muted/5 animate-in slide-in-from-left-2 duration-200"
                    >
                      <!-- Kürzel ohne eigenen Rahmen -->
                      <div class="w-12">
                        <InputStandard
                          v-model="mpm.favoriteAbbreviation"
                          :validation-schema="schema.favoriteAbbreviation"
                          id="favoriteAbbreviation"
                          field-label=""
                          maxlength="3"
                          align="center"
                          class="[&_input]:border-0 [&_input]:focus-visible:ring-0 [&_input]:h-8 [&_input]:bg-transparent [&_input]:shadow-none [&_input]:p-0"
                        />
                      </div>

                      <!-- Color Picker -->
                      <div
                        class="shrink-0 border-l border-border/50 pl-3 h-6 flex items-center"
                      >
                        <div class="relative">
                          <div
                            @click="toggleColorPicker"
                            class="h-6 w-6 rounded-sm border cursor-pointer transition-all flex items-center justify-center shadow-sm hover:opacity-90"
                            :style="{
                              backgroundColor: mpm.favoriteColor || '#ffffff',
                            }"
                            :class="[
                              !mpm.favoriteColor ||
                              mpm.favoriteColor.toLowerCase() === '#ffffff'
                                ? 'border-input'
                                : 'border-transparent',
                              favoriteColorErrorMessage
                                ? 'border-destructive!'
                                : '',
                            ]"
                            :data-testid="'favoriteColorPicker' + idSuffix"
                          ></div>

                          <div
                            v-if="showColorPicker"
                            class="absolute z-50 top-full mt-2 left-0 w-40 p-2 bg-popover border rounded-md shadow-md animate-in fade-in zoom-in-95"
                          >
                            <div class="grid grid-cols-5 gap-1 mb-2">
                              <div
                                v-for="color in randomColors"
                                :key="color"
                                @click="selectColor(color)"
                                class="h-6 w-6 rounded-sm cursor-pointer border border-input/50 hover:scale-110 transition-transform"
                                :style="{ backgroundColor: color }"
                              ></div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="xs"
                              class="w-full h-7 text-[10px] gap-1"
                              @click.stop="updateRandomColors"
                            >
                              <RefreshCw class="icon-extra-small" />
                              {{ $t("General.reset") }}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div class="ml-auto flex items-center gap-1.5">
                        <span
                          class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70"
                        >
                          Vorschau:
                        </span>
                        <!-- Vorschau Icon -->
                        <div
                          class="border-l border-border/50 pl-1 h-6 flex items-center shrink-0"
                        >
                          <FavoriteIcon
                            :text="mpm.favoriteAbbreviation"
                            :color="mpm.favoriteColor || '#ffffff'"
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Absolute Positionierung der Fehlermeldung unter der Gruppe -->
                    <p
                      v-if="favoriteColorErrorMessage"
                      class="absolute top-full left-0 text-[10px] font-medium text-destructive mt-0.5 whitespace-nowrap"
                    >
                      {{ favoriteColorErrorMessage }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-span-2 sm:col-span-6">
                <InputStandard
                  v-model="mpm.comment"
                  :validation-schema="schema.comment"
                  :id="'comment' + idSuffix"
                  :field-label="$t('General.comment')"
                >
                  <template #icon
                    ><MessageSquareMore class="icon-medium"
                  /></template>
                </InputStandard>
              </div>
              <div class="col-span-2 sm:col-span-6">
                <SelectContractpartner
                  v-model="mpm.contractpartnerId"
                  :validation-schema="schema.contractpartnerId"
                  :id-suffix="'CreatePreDefMoneyflow' + idSuffix"
                  :field-label="$t('General.contractpartner')"
                />
              </div>
              <div class="col-span-2 sm:col-span-6">
                <SelectCapitalsource
                  v-model="mpm.capitalsourceId"
                  :validation-schema="schema.capitalsourceId"
                  :id-suffix="'CreatePreDefMoneyflow' + idSuffix"
                  :field-label="$t('General.capitalsource')"
                  :validity-date="validityDate"
                />
              </div>
              <div class="col-span-2 sm:col-span-6">
                <SelectPostingAccount
                  v-model="mpm.postingAccountId"
                  :validation-schema="schema.postingAccountId"
                  :id-suffix="'CreatePreDefMoneyflow' + idSuffix"
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
        class="button-with-icon hidden md:flex"
        @click="resetForm"
      >
        <Undo2 class="icon-medium" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        :form-id="'createPreDefMoneyflowForm' + idSuffix"
      >
        <template #icon><Save class="icon-medium" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { amountSchema, globErr } from "@/tools/views/ZodUtil";
import { toTypedSchema } from "@vee-validate/zod";
import { Euro, RefreshCw, Save, Star, Undo2 } from "lucide-vue-next";
import { useField, useForm } from "vee-validate";
import { computed, ref, toRaw, useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { boolean, number, string, type ZodType } from "zod";
import SelectCapitalsource from "../capitalsource/SelectCapitalsource.vue";
import ButtonSubmit from "../common/ButtonSubmit.vue";
import DivError from "../common/DivError.vue";
import FavoriteIcon from "../common/FavoriteIcon.vue";
import InputStandard from "../common/InputStandard.vue";
import ModalVue from "../common/Modal.vue";
import SelectContractpartner from "../contractpartner/SelectContractpartner.vue";
import SelectPostingAccount from "../postingaccount/SelectPostingAccount.vue";

const { t } = useI18n();

defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
});

const serverErrors = ref(new Array<string>());

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
  favoriteColor: string(
    globErr(t("PreDefMoneyflow.validation.favoriteColor")),
  ).length(7, t("PreDefMoneyflow.validation.length.favoriteColor")),
  postingAccountId: number(
    globErr(t("Moneyflow.validation.postingAccountId")),
  ).gt(0),
  capitalsourceId: number(globErr(t("General.validation.capitalsource"))).gt(0),
  onceAMonth: boolean().optional(),
  isFavorite: boolean().optional(),
};

const mpm = ref({} as PreDefMoneyflow);
const origMpm = ref({} as PreDefMoneyflow | undefined);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const validityDate = new Date();
validityDate.setHours(0, 0, 0, 0);
const emit = defineEmits(["preDefMoneyflowCreated", "preDefMoneyflowUpdated"]);

const showColorPicker = ref(false);
const randomColors = ref<string[]>([]);

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

const toggleColorPicker = () => {
  showColorPicker.value = !showColorPicker.value;
  if (showColorPicker.value) updateRandomColors();
};

const selectColor = (color: string) => {
  mpm.value.favoriteColor = color;
  showColorPicker.value = false;
};

const {
  errorMessage: favoriteColorErrorMessage,
  setValue: setFavoriteColorValue,
} = useField<string>(
  () => "favoriteColor",
  toTypedSchema(schema.favoriteColor!),
);

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origMpm.value === undefined
    ? t("PreDefMoneyflow.title.create")
    : t("PreDefMoneyflow.title.update");
});

watch(
  () => mpm.value.favoriteColor,
  (newVal) => {
    setFavoriteColorValue(newVal ?? "");
  },
);

const resetForm = () => {
  updateRandomColors();
  if (origMpm.value) {
    mpm.value = structuredClone(toRaw(origMpm.value))!;
  } else {
    mpm.value = {} as PreDefMoneyflow;
    mpm.value.isFavorite = false;
    mpm.value.onceAMonth = false;
    mpm.value.favoriteAbbreviation = "";
    mpm.value.favoriteColor = randomColors.value[0];
  }
  showColorPicker.value = false;
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = async (_mpm?: PreDefMoneyflow) => {
  origMpm.value = _mpm ?? undefined;
  resetForm();
  modalComponent.value?._show();
};

const createPreDefMoneyflow = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  if (mpm.value.id > 0) {
    //update
    PreDefMoneyflowService.updatePreDefMoneyflow(mpm.value)
      .then(() => {
        modalComponent.value?._hide();
        emit("preDefMoneyflowUpdated", mpm.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  } else {
    //create
    PreDefMoneyflowService.createPreDefMoneyflow(mpm.value)
      .then((_mpm) => {
        mpm.value = _mpm;
        modalComponent.value?._hide();
        emit("preDefMoneyflowCreated", mpm.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});
defineExpose({ _show });
</script>
