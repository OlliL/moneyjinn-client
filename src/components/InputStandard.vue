<template>
  <div class="grid w-full gap-1.5 relative">
    <Label v-if="fieldLabel" :for="id" class="text-left ml-1">
      {{ fieldLabel }}
    </Label>

    <div class="flex -space-x-px relative">
      <Input
        v-model="fieldValue"
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
          isInvalid
            ? 'border-destructive! bg-destructive/3 focus-visible:ring-destructive/15 border-r-destructive!'
            : 'border-input focus-visible:ring-ring',
        ]"
        @input="onInput($event)"
      />

      <div
        v-if="$slots.icon"
        :class="[
          'flex items-center justify-center px-2 border border-input rounded-r-md text-foreground transition-colors relative',
          isInvalid ? 'border-l-transparent' : '',
        ]"
      >
        <slot name="icon"></slot>
      </div>
      <div
        v-if="$slots.button"
        :class="[
          'flex items-center justify-center px-2 border border-input rounded-r-md text-foreground transition-colors relative h-8 w-8 ',
          isInvalid ? 'border-l-transparent' : '',
        ]"
      >
        <slot name="button"></slot>
      </div>
    </div>

    <p
      v-if="isInvalid"
      class="text-[0.8rem] font-medium text-destructive mt-0.5 text-left ml-1"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toTypedSchema } from "@vee-validate/zod";
import { useField } from "vee-validate";
import {
  computed,
  nextTick,
  onMounted,
  useTemplateRef,
  watch,
  type PropType,
  type Ref,
} from "vue";
import { any, type ZodType } from "zod";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps({
  modelValue: {
    type: undefined,
    required: false,
  },
  validationSchema: {
    type: Object as PropType<ZodType>,
    required: false,
    default: any().optional(),
  },
  validationSchemaRef: {
    type: Object as PropType<Ref<ZodType>>,
    required: false,
  },
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  fieldLabel: {
    type: String,
    required: false,
  },
  fieldType: {
    type: String,
    default: "text",
  },
  focus: {
    type: Boolean,
    required: false,
    default: false,
  },
  align: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  step: {
    type: String,
    required: false,
  },
  placeholder: {
    type: String,
    required: false,
  },
});
const emit = defineEmits(["update:modelValue"]);

const schema = computed(() => {
  if (props.validationSchemaRef) {
    return toTypedSchema(props.validationSchemaRef.value);
  }
  return toTypedSchema(props.validationSchema);
});

const {
  value: fieldValue,
  meta: fieldMeta,
  errorMessage,
  setState,
  handleChange,
  setValue,
} = useField(props.id, schema, {
  syncVModel: true,
});

const onInput = (event: Event) => {
  setState({ touched: true });
  handleChange(event, true);
  emit("update:modelValue", fieldValue.value);
};

const isInvalid = computed(() => fieldMeta.touched && !!errorMessage.value);

const alignmentClass = computed(() => {
  return props.align ? "text-" + props.align : "";
});

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
  () => props.modelValue,
  (newValue) => {
    setValue(newValue, false);
    // The shadcn Input uses useVModel with passive:true, which means it does not
    // react to external modelValue changes. We therefore update the native input
    // element's value directly so the DOM stays in sync.
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
