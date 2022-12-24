<template>
  <div class="input-group">
    <div class="form-floating">
      <input
        :id="id"
        type="text"
        @changeDate="emitDate"
        :class="inputClass"
        :ref="id"
      />
      <label :for="id" :style="labelStyle">{{ label }}</label>
    </div>
    <span class="input-group-text"><i class="bi bi-calendar-date"></i></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Datepicker } from "vanillajs-datepicker";

export const de = {
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

export default defineComponent({
  name: "MyModal",

  data() {
    return {
      datepicker: {} as Datepicker,
    };
  },
  mounted() {
    this.initializeDatepicker();
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    defaultDate: {
      type: Date,
      default: undefined,
    },
    inputClass: {
      type: String,
      default: "form-control",
    },
    labelStyle: {
      type: String,
      default: "",
    },
  },
  watch: {
    defaultDate: {
      handler(newVal: Date, oldVal: Date) {
        if (newVal != oldVal && this.datepicker instanceof Datepicker) {
          console.log("~~", this.id, oldVal, newVal);
          this.datepicker.setDate(newVal);
        }
      },
      immediate: true,
    },
  },
  methods: {
    emitDate() {
      console.log(
        this.id,
        (this.datepicker.getDate() as Date).toISOString(),
        this.$props.defaultDate?.toISOString()
      );
      if (
        (this.datepicker.getDate() as Date).toISOString() !=
        this.$props.defaultDate?.toISOString()
      )
        this.$emit("dateSelected", this.datepicker.getDate());
    },
    initializeDatepicker() {
      if (!(this.datepicker instanceof Datepicker)) {
        Object.assign(Datepicker.locales, de);
        this.datepicker = new Datepicker(
          this.$refs[this.$props.id] as HTMLInputElement,
          {
            buttonClass: "btn",
            pickLevel: 0,
            todayBtn: true,
            todayBtnMode: 1,
            autohide: true,
            language: "de",
          }
        );
      }
    },
  },
  emits: ["dateSelected"],
});
</script>

<style>
.form-floating > .bi-calendar-date + .datepicker_input + label {
  padding-left: 3.5rem;
  z-index: 3;
}
</style>
