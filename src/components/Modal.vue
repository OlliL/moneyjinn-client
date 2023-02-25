<template>
  <div
    class="modal fade"
    tabindex="-1"
    aria-labelledby=""
    aria-hidden="true"
    ref="modalEle"
    :style="'z-index: ' + zIndex"
  >
    <div class="modal-dialog" :style="modalStyle">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 class="modal-title w-100">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <slot name="body" />
        </div>
        <div class="modal-footer justify-content-md-center">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            {{ $t("Modal.cancel") }}
          </button>
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: "MyModal" };
</script>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { Modal } from "bootstrap";

const thisModalObj = ref({} as Modal);
const modalEle = ref();

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  maxWidth: {
    type: String,
    default: "",
  },
  zIndex: {
    type: String,
    default: "2000",
  },
});

const modalStyle = computed(() => {
  if (props.maxWidth) {
    return "max-width: " + props.maxWidth;
  }
  return "";
});

const _show = async () => {
  thisModalObj.value.show();
};
const _hide = async () => {
  thisModalObj.value.hide();
};

defineExpose({ _show, _hide });

onMounted(() => {
  thisModalObj.value = new Modal(modalEle.value as HTMLDivElement);
});
</script>
