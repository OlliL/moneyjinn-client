<template>
  <span
    v-for="(line, index) in importDataCommentLines"
    :key="index"
    class="block"
  >
    <b v-if="line.label">{{ line.label }}:</b> {{ line.value }}
  </span>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

type ImportCommentLine = {
  label: string;
  value: string;
};
const { t } = useI18n();

const props = defineProps<{
  comment?: string;
}>();

const importDataCommentLines = computed(() => {
  const resultArray: Array<ImportCommentLine> = [];

  if (!props.comment) return resultArray;

  // if comment does not contain \nSVWZ+ just return the comment as purpose
  if (
    !props.comment.includes("EREF+") &&
    !props.comment.includes("KREF+") &&
    !props.comment.includes("MREF+") &&
    !props.comment.includes("CRED+") &&
    !props.comment.includes("SVWZ+")
  ) {
    resultArray.push({ label: "", value: props.comment });
    return resultArray;
  }

  const parts = props.comment.split("SVWZ+");
  // seperate the first part by \n and push every part into resultArray
  const firstPart = parts[0].split("\n");
  for (let i = 0; i <= firstPart.length - 1; i++) {
    const lineParts = firstPart[i].split("+");

    let label = lineParts[0];
    switch (lineParts[0]) {
      case "EREF":
        label = t("General.importComment.endToEndId");
        break;
      case "KREF":
        label = t("General.importComment.customerReference");
        break;
      case "MREF":
        label = t("General.importComment.mandateReference");
        break;
      case "CRED":
        label = t("General.importComment.creditorId");
        break;
    }
    if (lineParts.length === 2) {
      resultArray.push({ label, value: lineParts[1] });
    }
  }
  // push the rest of the parts into resultArray
  for (let i = 1; i < parts.length; i++) {
    resultArray.push({
      label: t("General.importComment.purpose") as string,
      value: parts[i].replaceAll("\n", ""),
    });
  }
  return resultArray;
});
</script>
