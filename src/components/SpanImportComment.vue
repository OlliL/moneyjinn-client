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

type ImportCommentLine = {
  label: string;
  value: string;
};

const props = defineProps({
  comment: {
    type: String,
    required: false,
  },
});

const importDataCommentLines = computed(() => {
  const resultArray: Array<ImportCommentLine> = [];

  if (!props.comment) return resultArray;

  // if comment does not contain \nSVWZ+ just return the comment as Verwendungszweck
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
    switch (lineParts[0]) {
      case "EREF":
        lineParts[0] = "End-to-End-ID";
        break;
      case "KREF":
        lineParts[0] = "Kundenreferenz";
        break;
      case "MREF":
        lineParts[0] = "Mandatsreferenz";
        break;
      case "CRED":
        lineParts[0] = "Gläubiger-ID";
        break;
    }
    if (lineParts.length === 2) {
      resultArray.push({ label: lineParts[0], value: lineParts[1] });
    }
  }
  // push the rest of the parts into resultArray
  for (let i = 1; i < parts.length; i++) {
    resultArray.push({
      label: "Verwendungszweck",
      value: parts[i].replaceAll("\n", ""),
    });
  }
  return resultArray;
});
</script>
