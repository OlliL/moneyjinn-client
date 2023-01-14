<template>
  <div class="input-group">
    <div class="form-floating">
      <input
        :id="id"
        type="text"
        @changeDate="onInput($event)"
        :class="'form-control ' + errorData.inputClass"
        ref="fieldRef"
      />
      <label :for="id" :style="'color: ' + errorData.fieldColor">{{
        errorData.fieldLabel
      }}</label>
    </div>
    <span class="input-group-text"><i class="bi bi-calendar-date"></i></span>
  </div>
</template>

<script lang="ts" setup>
import { Datepicker } from "vanillajs-datepicker";
import { useField } from "vee-validate";
import { toFieldValidator } from "@vee-validate/zod";
import { computed, onMounted, ref, watch, type PropType } from "vue";
import { preprocess, type ZodType } from "zod";

import {
  generateErrorDataVeeValidate,
  type ErrorData,
} from "@/tools/views/ErrorData";

const props = defineProps({
  validationSchema: {
    type: Object as PropType<ZodType>,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  fieldLabel: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Date,
    required: false,
  },
  labelStyle: {
    type: String,
    default: "",
  },
  pickMode: {
    type: String,
    default: "day",
  },
});
const emit = defineEmits(["update:modelValue"]);
const schema = ref();

const {
  meta: fieldMeta,
  errorMessage,
  setState,
  handleChange,
} = useField(props.id, schema, {
  initialValue: props.modelValue,
  syncVModel: false,
});

const de = {
  de: {
    days: [
      "Sonntag",
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag",
    ],
    daysShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    daysMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    months: [
      "Januar",
      "Februar",
      "März",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember",
    ],
    monthsShort: [
      "Jan",
      "Feb",
      "Mär",
      "Apr",
      "Mai",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Dez",
    ],
    today: "Heute",
    monthsTitle: "Monate",
    clear: "Löschen",
    weekStart: 1,
    format: "dd.mm.yyyy",
  },
};

Object.assign(Datepicker.locales, de);
let pickLevel = 0;
let format = "dd.mm.yyyy";

switch (props.pickMode) {
  case "day": {
    pickLevel = 0;
    format = "dd.mm.yyyy";
    break;
  }
  case "month": {
    pickLevel = 1;
    format = "mm.yyyy";
    break;
  }
  case "year": {
    pickLevel = 2;
    format = "yyyy";
    break;
  }
}

const fieldRef = ref();
let datepicker = {} as Datepicker;

onMounted(() => {
  if (!(datepicker instanceof Datepicker)) {
    datepicker = new Datepicker(fieldRef.value as HTMLInputElement, {
      buttonClass: "btn",
      pickLevel: pickLevel,
      clearBtn: true,
      todayBtn: true,
      todayBtnMode: 1,
      autohide: true,
      language: "de",
      format: format,
    });
    schema.value = toFieldValidator(
      preprocess(() => datepicker.getDate(), props.validationSchema)
    );
  }
});

const setDate = (newVal?: Date) => {
  if (datepicker instanceof Datepicker) {
    if (newVal === undefined) {
      if (datepicker.dates.length > 0) {
        datepicker.setDate(undefined);
      }
    } else {
      if (props.pickMode === "month" || props.pickMode === "year") {
        newVal.setDate(1);
      }
      if (props.pickMode === "year") newVal.setMonth(0);
      newVal.setHours(0, 0, 0, 0);

      if (datepicker.dates.length === 0) {
        datepicker.setDate(newVal);
      } else if (
        (datepicker.getDate() as Date).toISOString() != newVal?.toISOString()
      ) {
        datepicker.setDate(newVal);
      }
    }
  }
};
const onInput = (event: any) => {
  handleChange(event, true);
  if (datepicker.dates.length === 0) {
    if (props.modelValue !== undefined) {
      setState({ touched: true });
      emit("update:modelValue", undefined);
    }
  } else if (
    (datepicker.getDate() as Date).toISOString() !=
    props.modelValue?.toISOString()
  ) {
    setState({ touched: true });
    emit("update:modelValue", datepicker.getDate());
  }
};

//if (props.modelValue) setDate(props.modelValue);

const errorData = computed((): ErrorData => {
  return generateErrorDataVeeValidate(
    fieldMeta.touched,
    props.fieldLabel,
    errorMessage.value
  );
});

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      setDate(newVal);
    }
  },
  { immediate: true }
);
</script>

<style>
.form-floating > .bi-calendar-date + .datepicker_input + label {
  padding-left: 3.5rem;
  z-index: 3;
}
</style>
