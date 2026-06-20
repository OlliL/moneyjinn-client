<template>
  <div class="grid w-full gap-1.5 relative">
    <Label v-if="fieldLabel" :for="id" class="text-left ml-1">
      {{ fieldLabel }}
    </Label>

    <Input
      type="file"
      :id="id"
      :data-testid="id"
      multiple
      :class="[
        'file:mr-2 file:cursor-pointer file:rounded-md file:border file:border-input file:bg-background file:px-2 file:py-1 file:text-sm file:font-medium hover:file:bg-accent',
        errorMessage
          ? 'border-destructive! bg-destructive/3 focus-visible:ring-destructive/15'
          : 'border-input focus-visible:ring-ring',
      ]"
      @change="onInput"
    />

    <p
      v-if="errorMessage"
      class="text-[0.8rem] font-medium text-destructive mt-0.5 text-left ml-1"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "@/service/util/ValidationUtil";
import { computed, type Ref } from "vue";
import { any, type ZodType } from "zod";

const props = withDefaults(
  defineProps<{
    validationSchema?: ZodType;
    validationSchemaRef?: Ref<ZodType>;
    id: string;
    fieldLabel?: string;
  }>(),
  {
    validationSchema: () => any().optional(),
  },
);
const model = defineModel<FileList | null | undefined>();

const schema = computed(
  () => props.validationSchemaRef?.value ?? props.validationSchema,
);

const { errorMessage, handleBlur, handleInput } = useFormContext({
  schema: schema,
  model: model,
});

const onInput = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  model.value = files;
  handleInput();
  handleBlur();
};
</script>
