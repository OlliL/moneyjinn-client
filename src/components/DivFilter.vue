<template>
  <div class="row justify-content-md-center">
    <div :class="$slots.right ? 'col-md-5 mb-3' : 'col-md-auto mb-3'">
      <div class="row">
        <div class="col-md-auto align-self-center">
          <button
            type="button"
            class="btn btn-primary"
            @click="$emit('createClicked')"
          >
            {{ $t("General.new") }}
          </button>
        </div>
        <div class="col-md flex-grow-1">
          <div class="input-group align-items-center">
            <button
              type="button"
              class="btn btn-primary"
              @click="emit('update:modelValue', '')"
            >
              {{ $t("General.all") }}
            </button>
            <input
              class="form-control"
              type="text"
              :placeholder="placeholder"
              :value="props.modelValue"
              @input="
                emit(
                  'update:modelValue',
                  (($event as InputEvent)?.target as HTMLInputElement)?.value,
                )
              "
            />
            <div
              class="form-check form-switch align-self-center ms-2"
              v-if="showValidToggle"
            >
              <input
                class="form-check-input"
                type="checkbox"
                id="validInput"
                v-model="validNow"
                @change="emit('validNowToggled', validNow)"
              />
              <label class="form-check-label" for="validInput">{{
                $t("General.validNow")
              }}</label>
            </div>
            <slot name="right"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const validNow = ref(true);

const emit = defineEmits([
  "update:modelValue",
  "validNowToggled",
  "createClicked",
]);

const props = defineProps({
  placeholder: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
    required: true,
  },
  showValidToggle: {
    type: Boolean,
    default: true,
  },
});
</script>
