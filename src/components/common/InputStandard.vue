<template>
  <div class="grid w-full gap-1.5 relative">
    <Label v-if="fieldLabel" :for="id" class="text-left ml-1">
      {{ fieldLabel }}
    </Label>

    <div class="flex -space-x-px relative">
      <Input
        v-model="model as string"
        v-bind="$attrs"
        ref="fieldRef"
        :id="id"
        :name="name"
        :data-testid="id"
        :type="fieldType"
        :disabled="disabled"
        :step="step"
        :placeholder="placeholder"
        :class="[
          'bg-background z-10',
          alignmentClass,
          $slots.icon || $slots.button ? 'rounded-r-none' : '',
          errorMessage
            ? 'border-destructive! bg-destructive/3 focus-visible:ring-destructive/15 border-r-destructive!'
            : 'border-input focus-visible:ring-ring',
        ]"
        @blur="handleBlur"
      />

      <div
        v-if="$slots.icon"
        :class="[
          'flex items-center justify-center px-2 border border-input text-foreground transition-colors relative',
          $slots.button ? '' : 'rounded-r-md',
          errorMessage ? 'border-l-transparent' : '',
        ]"
      >
        <slot name="icon"></slot>
      </div>
      <div
        v-if="$slots.button"
        :class="[
          'flex items-center justify-center px-2 border border-input rounded-r-md text-foreground transition-colors relative action-icon-button',
          errorMessage ? 'border-l-transparent' : '',
        ]"
      >
        <slot name="button"></slot>
      </div>
    </div>

    <p
      v-if="errorMessage"
      class="text-[0.8rem] font-medium text-destructive mt-0.5 text-left ml-1"
      :data-testid="id + '-error-item'"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "@/service/util/ValidationUtil";
import {
  computed,
  nextTick,
  onMounted,
  useTemplateRef,
  watch,
  type Ref,
} from "vue";
import { any, type ZodType } from "zod";
defineOptions({
  inheritAttrs: false,
});
const props = withDefaults(
  defineProps<{
    validationSchema?: ZodType;
    validationSchemaRef?: Ref<ZodType>;
    id: string;
    name?: string;
    fieldLabel?: string;
    fieldType?: string;
    focus?: boolean;
    align?: string;
    disabled?: boolean;
    step?: string;
    placeholder?: string;
  }>(),
  {
    validationSchema: () => any().optional(),
    fieldType: "text",
    focus: false,
    disabled: false,
  },
);
const model = defineModel<string | number>();

const schema = computed(
  () => props.validationSchemaRef?.value ?? props.validationSchema,
);

const { errorMessage, handleBlur } = useFormContext({
  schema: schema,
  model: model,
});

const alignmentClass = computed(() =>
  props.align ? "text-" + props.align : "",
);

const fieldRef = useTemplateRef<typeof Input>("fieldRef");

const getInputElement = () => {
  const refValue = fieldRef.value as unknown as
    | HTMLInputElement
    | { $el?: HTMLInputElement }
    | undefined;
  if (!refValue) return undefined;
  if ("$el" in refValue && refValue.$el) return refValue.$el;
  return refValue as HTMLInputElement;
};

onMounted(() => {
  if (props.focus) {
    nextTick(() => {
      getInputElement()?.focus();
    });
  }
});

watch(
  () => model.value,
  (newValue) => {
    nextTick(() => {
      const el = getInputElement();
      if (el && el.value !== String(newValue ?? "")) {
        el.value = String(newValue ?? "");
      }
    });
  },
  { immediate: true },
);
</script>
